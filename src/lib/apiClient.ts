/**
 * Ky 기반 API 클라이언트
 *
 * 클라이언트 컴포넌트용 Ky 기반 HTTP 클라이언트와
 * 서버 컴포넌트용 native fetch 클라이언트를 제공합니다.
 *
 * @see docs/ky-migration-plan.md
 */

import ky, { HTTPError, type KyInstance, type Options } from "ky";
import { decodeJwt } from "jose";
import { Configuration, DefaultApi } from "@/generated/api";
import {
  getAuthCookie,
  isTokenNearExpiration,
  setTokenExpiration,
  removeAuthCookie,
} from "./tokenManager";

// --- 타입 정의 ---
interface ResponseDtoAccessTokenResponse {
  data?: {
    authorization?: string;
  };
}

/**
 * 커스텀 에러 - 리프레시 토큰 무효
 */
export class RefreshTokenInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenInvalidError";
  }
}

// --- 토큰 재발급 ---
/**
 * 토큰 재발급 Promise
 *
 * 동시에 여러 요청이 401 에러를 받았을 때 중복 재발급을 방지하기 위한 전역 Promise입니다.
 *
 * **동작 원리**:
 * 1. 첫 번째 요청이 401을 받으면 토큰 재발급 Promise를 생성하고 저장
 * 2. 같은 시점에 다른 요청들도 401을 받으면 저장된 같은 Promise를 재사용
 * 3. 재발급이 완료되면 Promise를 null로 초기화하여 다음 재발급을 준비
 *
 * @example
 * // 토큰 재발급 시작
 * if (!tokenRefreshPromise) {
 *   tokenRefreshPromise = refreshAccessToken().finally(() => {
 *     tokenRefreshPromise = null;
 *   });
 * }
 * // 모든 요청이 같은 Promise를 기다림
 * await tokenRefreshPromise;
 */
let tokenRefreshPromise: Promise<string | null> | null = null;

/**
 * 새로운 AccessToken의 만료 시간을 디코딩하여 저장합니다.
 * 로그인 성공 직후 또는 토큰을 새로 발급받았을 때 호출되어야 합니다.
 * @param accessToken 새로운 JWT Access Token
 */
export function updateTokenExpiration(accessToken: string) {
  try {
    const payload = decodeJwt(accessToken);
    const expirationTime = payload.exp ? payload.exp * 1000 : null;

    if (expirationTime) {
      setTokenExpiration(expirationTime);
    }
  } catch (e) {
    console.error("Failed to decode token expiration:", e);
  }
}

/**
 * 액세스 토큰 재발급
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const endpoint = "/api/auth/reissue";
    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${endpoint}`;
    
    const data = await ky
      .post(refreshUrl, {
        credentials: "include",
        retry: 0, // 토큰 재발급은 재시도하지 않음
      })
      .json<ResponseDtoAccessTokenResponse>();

    const newAccessToken = data.data?.authorization;

    if (newAccessToken) {
      updateTokenExpiration(newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    // Ky의 HTTPError 처리
    if (error instanceof HTTPError) {
      const status = error.response.status;

      // 리프레시 토큰 만료 시 쿠키 제거 및 에러 전파
      if ([400, 401, 403].includes(status)) {
        removeAuthCookie();
        throw new RefreshTokenInvalidError("Refresh token invalid or expired.");
      }
    }

    return null;
  }
}

/**
 * 쿼리 무효화 (React Query)
 */
const invalidateRelatedQueries = (url: string) => {
  if (typeof window === "undefined") return;

  try {
    import("@/providers/Providers").then(({ queryClient }) => {
      if (url.includes("/users/me") || url.includes("/profile")) {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      }
      if (url.includes("/activity")) {
        queryClient.invalidateQueries({ queryKey: ["userActivity"] });
      }
    });
  } catch (error) {
    console.warn("Failed to invalidate queries:", error);
  }
};

// --- Ky 인스턴스 생성 ---
export const kyClient: KyInstance = ky.create({
  // prefixUrl 제거: OpenAPI Generator가 이미 전체 URL을 생성함
  credentials: "include",
  timeout: 30000,
  retry: {
    limit: 3,
    methods: ["get", "post", "put", "delete", "patch"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    backoffLimit: 3000,
  },

  hooks: {
    beforeRequest: [
      async (request) => {
        // 1. 사전 예방적 토큰 갱신 (만료 1분 전)
        if (isTokenNearExpiration(60000)) {
          if (!tokenRefreshPromise) {
            tokenRefreshPromise = refreshAccessToken().finally(() => {
              tokenRefreshPromise = null;
            });
          }
          await tokenRefreshPromise;
        }

        // 2. 토큰 주입
        const token = getAuthCookie();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],

    afterResponse: [
      async (request, _options, response) => {
        // 401 에러 시 토큰 재발급 및 재시도
        if (response.status === 401) {
          // 토큰 재발급 (중복 방지)
          if (!tokenRefreshPromise) {
            tokenRefreshPromise = refreshAccessToken().finally(() => {
              tokenRefreshPromise = null;
            });
          }

          const newToken = await tokenRefreshPromise;

          if (newToken) {
            // 새 토큰으로 재시도
            request.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(request);
          }
        }

        // 성공한 요청에만 쿼리 무효화
        if (response.ok) {
          invalidateRelatedQueries(request.url);
        }

        return response;
      },
    ],

    beforeError: [
      (error) => {
        console.error(`[Ky Error] ${error.request.method} ${error.request.url}:`, error.message);
        return error;
      },
    ],
  },
});

// --- fetch 호환 래퍼 ---
/**
 * OpenAPI Generator가 생성한 API 클라이언트와 호환되도록 fetch 인터페이스를 제공합니다.
 */
export const kyFetchWrapper = async (
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  const url = typeof input === "string" ? input : input.toString();
  return kyClient(url, init as Options);
};

// ==================================================================================
// --- 클라이언트용 API 클라이언트 ---
// ==================================================================================

const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  fetchApi: kyFetchWrapper as typeof fetch,
  credentials: "include",
});

/**
 * 클라이언트 컴포넌트에서 사용하는 API 클라이언트 인스턴스입니다.
 * Ky 기반으로 토큰 재발급 및 요청 재시도 로직이 포함되어 있습니다.
 */
export const apiClient = new DefaultApi(apiConfig);

// ==================================================================================
// --- 서버용 API 클라이언트 ---
// ==================================================================================

/**
 * 서버 환경(서버 컴포넌트, Route Handlers 등)에서 사용될 fetch 함수입니다.
 * next/headers를 통해 현재 요청에 포함된 쿠키를 안전하게 읽어와 Authorization 헤더를 주입합니다.
 */
const serverFetch = async (
  url: string, // openapi-generator가 basePath와 결합하여 full URL을 전달합니다.
  options: RequestInit = {}
): Promise<Response> => {
  // "next/headers"는 서버 전용 모듈이므로, 클라이언트에서 이 파일을 임포트할 때 에러가 나지 않도록 함수 내에서 동적으로 import 합니다.
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const newOptions: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, newOptions);
};

/**
 * 서버 컴포넌트에서 사용할 API 클라이언트를 생성하는 팩토리 함수입니다.
 * 이 함수를 호출하면 현재 요청의 컨텍스트(쿠키)를 포함하는 새로운 API 클라이언트 인스턴스가 생성됩니다.
 */
export const createServerApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetchApi: serverFetch as typeof fetch,
  });
  return new DefaultApi(config);
};
