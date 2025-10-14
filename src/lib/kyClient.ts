/**
 * Ky 기반 HTTP 클라이언트 (POC)
 *
 * 이 파일은 fetch → Ky 마이그레이션의 POC입니다.
 * 검증 후 apiClient.ts에 통합됩니다.
 *
 * @see docs/ky-migration-plan.md
 */

import ky, { type KyInstance, type Options } from "ky";
import { decodeJwt } from "jose";
import {
  getAuthCookie,
  isTokenNearExpiration,
  setTokenExpiration,
  removeAuthCookie,
} from "./tokenManager";

// --- 타입 정의 ---
interface ApiErrorResponse {
  data?: string;
  code?: string;
  message?: string;
}

interface ResponseDtoAccessTokenResponse {
  data?: {
    authorization?: string;
  };
}

const TOKEN_ERROR_CODES = {
  ACCESS_TOKEN_EXPIRED: "J004",
  REFRESH_TOKEN_EXPIRED: "C005",
} as const;

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
let tokenRefreshPromise: Promise<string | null> | null = null;

/**
 * 새로운 AccessToken의 만료 시간을 디코딩하여 저장합니다.
 */
function updateTokenExpiration(accessToken: string) {
  try {
    const payload = decodeJwt(accessToken);
    const expirationTime = payload.exp ? payload.exp * 1000 : null;

    if (expirationTime) {
      setTokenExpiration(expirationTime);
      console.log(
        `Proactive refresh tracking: token expiration set to ${new Date(expirationTime).toLocaleString()}`
      );
    }
  } catch (e) {
    console.error("Failed to decode token for expiration tracking:", e);
  }
}

/**
 * 액세스 토큰 재발급
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const endpoint = "/api/auth/reissue";
    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${endpoint}`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response
        .json()
        .catch(() => ({ message: "Failed to parse refresh error" }));

      console.error("토큰 재발급 API 실패:", response.status, errorData);

      // 리프레시 토큰 자체가 만료되었거나 유효하지 않은 경우
      if ([400, 401, 403].includes(response.status)) {
        removeAuthCookie();
        console.warn("리프레시 토큰이 만료되었거나 유효하지 않습니다. 강제 로그아웃이 필요합니다.");
        throw new RefreshTokenInvalidError("Refresh token invalid or expired.");
      }

      return null;
    }

    const data: ResponseDtoAccessTokenResponse = await response.json();
    const newAccessToken = data.data?.authorization;

    if (newAccessToken) {
      updateTokenExpiration(newAccessToken);
      console.log("✅ 새 액세스 토큰 발급 성공");
      return newAccessToken;
    }

    return null;
  } catch (error) {
    if (error instanceof RefreshTokenInvalidError) {
      throw error;
    }
    console.error("토큰 재발급 중 에러:", error);
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
        console.log(`🚀 [Ky] ${request.method} ${request.url}`);

        // 1. 사전 예방적 토큰 갱신 (만료 1분 전)
        if (isTokenNearExpiration(60000)) {
          console.warn("⚠️ 토큰 만료 임박, 사전 갱신 시작...");

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
      async (request, options, response) => {
        console.log(`✅ [Ky] ${response.status} ${request.url}`);

        // 쿼리 무효화
        invalidateRelatedQueries(request.url);

        // 401 에러 처리 (사후 대응적 재발급)
        if (response.status === 401) {
          try {
            const errorData: ApiErrorResponse = await response.clone().json();

            // 액세스 토큰 만료 확인
            const isTokenExpired =
              errorData.code === TOKEN_ERROR_CODES.ACCESS_TOKEN_EXPIRED ||
              errorData.message?.includes("JWT 토큰을 찾을 수 없습니다") ||
              errorData.message?.includes("토큰이 만료되었습니다") ||
              errorData.message?.includes("액세스 토큰이 만료되었습니다");

            if (isTokenExpired) {
              console.warn("🔄 401 에러, 토큰 재발급 시도...");

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
                console.log("🔄 새 토큰으로 재시도");
                return ky(request);
              } else {
                console.error("❌ 토큰 재발급 실패, 로그아웃 필요");
                removeAuthCookie();
                throw new Error("토큰 재발급 실패로 인한 요청 중단");
              }
            }
          } catch (e) {
            if (e instanceof RefreshTokenInvalidError) {
              console.error("RefreshTokenInvalidError caught, propagating for logout:", e);
              throw e;
            }
            console.error("401 에러 처리 중 실패:", e);
            throw e;
          }
        }

        return response;
      },
    ],

    beforeError: [
      (error) => {
        console.error(`❌ [Ky Error] ${error.request.method} ${error.request.url}`);
        console.error("Error:", error.message);
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
