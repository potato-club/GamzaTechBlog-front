import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { decodeJwt } from "jose";
import { Configuration, DefaultApi, ResponseDtoAccessTokenResponse } from "../generated/api";

// --- 타입 정의 ---
interface ApiErrorResponse {
  data?: string;
  code?: string;
  message?: string;
}

// --- 상수 정의 ---
const TOKEN_ERROR_CODES = {
  ACCESS_TOKEN_EXPIRED: "J004",
  REFRESH_TOKEN_EXPIRED: "C005",
} as const;

const QUERY_KEYS = {
  USER_PROFILE: ["userProfile"],
  USER_ACTIVITY: ["userActivity"],
} as const;

// --- 토큰 재발급 및 상태 관리 ---
let isRefreshingToken = false;
let failedRequestsQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: Error) => void;
  url: string;
  options: RequestInit;
}> = [];

// --- 사전 예방적 재발급을 위한 상태 ---
let tokenExpirationTime: number | null = null;

/**
 * 새로운 AccessToken의 만료 시간을 디코딩하여 저장합니다.
 * 로그인 성공 직후 또는 토큰을 새로 발급받았을 때 호출되어야 합니다.
 * @param accessToken 새로운 JWT Access Token
 */
export function updateTokenExpiration(accessToken: string) {
  try {
    const payload = decodeJwt(accessToken);
    tokenExpirationTime = payload.exp ? payload.exp * 1000 : null; // exp는 초 단위이므로 ms로 변환
    console.log(
      `Proactive refresh tracking: token expiration set to ${tokenExpirationTime ? new Date(tokenExpirationTime).toLocaleString() : "N/A"}`
    );
  } catch (e) {
    console.error("Failed to decode token for expiration tracking:", e);
    tokenExpirationTime = null;
  }
}

// --- 커스텀 에러 ---
export class RefreshTokenInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenInvalidError";
  }
}

const processFailedRequestsQueue = (error: Error | null, newAccessToken: string | null = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (newAccessToken) {
      const newOptions = { ...prom.options };
      const headers = new Headers(newOptions.headers);
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      newOptions.headers = headers;

      fetch(prom.url, newOptions)
        .then((response) => {
          invalidateRelatedQueries(prom.url);
          prom.resolve(response);
        })
        .catch(prom.reject);
    }
  });
  failedRequestsQueue = [];
};

const invalidateRelatedQueries = (url: string) => {
  if (typeof window === "undefined") return;
  try {
    import("@/providers/Providers").then(({ queryClient }) => {
      if (url.includes("/users/me") || url.includes("/profile")) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      }
      if (url.includes("/activity")) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ACTIVITY });
      }
    });
  } catch (error) {
    console.warn("Failed to invalidate queries:", error);
  }
};

async function refreshAccessToken(): Promise<string | null> {
  try {
    const endpoint = "/api/auth/reissue";
    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${endpoint}`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      await handleRefreshTokenError(response);
      return null;
    }

    const data: ResponseDtoAccessTokenResponse = await response.json();
    const newAccessToken = data.data?.authorization;

    if (newAccessToken) {
      setCookie("authorization", newAccessToken, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      updateTokenExpiration(newAccessToken); // 새 토큰의 만료 시간 업데이트
      console.log("새 액세스 토큰 발급 및 저장 성공.");
      return newAccessToken;
    }
    return null;
  } catch (error) {
    if (error instanceof RefreshTokenInvalidError) {
      throw error;
    }
    console.error("토큰 재발급 중 네트워크 또는 기타 에러:", error);
    return null;
  }
}

async function handleRefreshTokenError(response: Response): Promise<void> {
  const errorData: ApiErrorResponse = await response
    .json()
    .catch(() => ({ message: "Failed to parse refresh error" }));

  console.error("토큰 재발급 API 실패:", response.status, errorData);

  const REFRESH_FAILED_STATUSES = [400, 401, 403];

  if (REFRESH_FAILED_STATUSES.includes(response.status)) {
    deleteCookie("authorization");
    console.warn("리프레시 토큰이 만료되었거나 유효하지 않습니다. 강제 로그아웃이 필요합니다.");
    throw new RefreshTokenInvalidError("Refresh token invalid or expired.");
  }
}

// --- 클라이언트용 fetch (하이브리드 방식 적용) ---
async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  isRetry = false
): Promise<Response> {
  const EXPIRE_BUFFER_MS = 60 * 1000; // 1분 버퍼

  // --- 1. 사전 예방적 재발급 로직 ---
  if (!isRetry && tokenExpirationTime && tokenExpirationTime < Date.now() + EXPIRE_BUFFER_MS) {
    console.warn("Token is about to expire, refreshing proactively...");
    // handleTokenRefresh는 재발급 및 요청 재시도를 모두 처리하므로, 호출하고 바로 반환합니다.
    return handleTokenRefresh(url, options);
  }

  // --- 2. 실제 API 요청 로직 ---
  const accessToken = getCookie("authorization");
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
    credentials: "include",
  };

  const response = await fetch(url, newOptions);

  // --- 3. 사후 대응적 재발급 로직 (Fallback) ---
  if (!isRetry) {
    const tokenExpired = await checkTokenExpiration(response);
    if (tokenExpired) {
      return handleTokenRefresh(url, newOptions);
    }
  }

  return response;
}

async function checkTokenExpiration(response: Response): Promise<boolean> {
  if (response.status !== 401 && response.status !== 403) return false;

  const accessToken = getCookie("authorization");
  if (!accessToken) return false;

  try {
    const clonedResponse = response.clone();
    const errorData: ApiErrorResponse = await clonedResponse.json();

    return (
      errorData.code === TOKEN_ERROR_CODES.ACCESS_TOKEN_EXPIRED ||
      (errorData.message?.includes("JWT 토큰을 찾을 수 없습니다") ?? false) ||
      (errorData.message?.includes("토큰이 만료되었습니다") ?? false) ||
      (errorData.message?.includes("액세스 토큰이 만료되었습니다") ?? false)
    );
  } catch (e) {
    console.error("토큰 만료 확인 중 에러:", e);
    return false;
  }
}

async function handleTokenRefresh(url: string, options: RequestInit): Promise<Response> {
  if (!isRefreshingToken) {
    isRefreshingToken = true;
    console.warn("Access token refresh initiated...");
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        processFailedRequestsQueue(null, newAccessToken);
        return await retryRequestWithNewToken(url, options, newAccessToken);
      } else {
        const error = new Error("토큰 재발급 실패로 인한 요청 중단");
        processFailedRequestsQueue(error, null);
        throw error;
      }
    } catch (refreshError: unknown) {
      processFailedRequestsQueue(refreshError as Error, null);
      if (refreshError instanceof RefreshTokenInvalidError) {
        console.error(
          "RefreshTokenInvalidError caught during refresh, propagating for logout:",
          refreshError
        );
        throw refreshError;
      }
      throw new Error("토큰 재발급 중 오류 발생");
    } finally {
      isRefreshingToken = false;
    }
  } else {
    console.log(
      "Token refresh already in progress. Queuing request:",
      url.replace(process.env.NEXT_PUBLIC_API_BASE_URL || "", "")
    );
    return new Promise((resolve, reject) => {
      failedRequestsQueue.push({ resolve, reject, url, options });
    });
  }
}

async function retryRequestWithNewToken(
  url: string,
  options: RequestInit,
  newAccessToken: string
): Promise<Response> {
  const retryHeaders = new Headers(options.headers);
  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
  const retryOptions = { ...options, headers: retryHeaders };

  console.log("Retrying original request:", url);
  return fetch(url, retryOptions);
}

// --- 클라이언트용 API 클라이언트 ---
const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  fetchApi: fetchWithAuth as typeof fetch,
  credentials: "include",
});

/**
 * 클라이언트 컴포넌트에서 사용하는 API 클라이언트 인스턴스입니다.
 * 정교한 토큰 재발급 및 요청 재시도 로직이 포함되어 있습니다.
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
