import { API_CONFIG } from "@/config/api";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { ResponseDtoAccessTokenResponse } from "../generated/api";

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

// --- 토큰 재발급 중 상태 관리 ---
let isRefreshingToken = false;
// 재발급 중 실패한 요청들을 저장할 큐
let failedRequestsQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: Error) => void;
  url: string;
  options: RequestInit;
}> = [];

// --- 커스텀 에러: 리프레시 토큰이 유효하지 않을 때 발생 ---
export class RefreshTokenInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenInvalidError";
  }
}

// 큐에 쌓인 요청들을 처리하는 함수
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
          // 재시도 성공 후 관련 쿼리 무효화
          invalidateRelatedQueries(prom.url);
          prom.resolve(response);
        })
        .catch(prom.reject);
    }
  });
  failedRequestsQueue = [];
};

// 쿼리 무효화 로직 분리
const invalidateRelatedQueries = (url: string) => {
  // 클라이언트 환경에서만 실행
  if (typeof window === "undefined") return;

  try {
    // 동적 import로 queryClient 가져오기 (클라이언트에서만)
    import("@/providers/QueryProvider").then(({ queryClient }) => {
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

// --- 새 액세스 토큰을 발급받는 함수 ---
async function refreshAccessToken(): Promise<string | null> {
  try {
    const endpoint = "/api/auth/reissue";
    const refreshUrl = `${API_CONFIG.BASE_URL}${endpoint}`;

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

// 리프레시 토큰 에러 처리 분리
async function handleRefreshTokenError(response: Response): Promise<void> {
  const errorData: ApiErrorResponse = await response
    .json()
    .catch(() => ({ message: "Failed to parse refresh error" }));

  console.error("토큰 재발급 API 실패:", response.status, errorData);

  // 리프레시 토큰 만료 상태 코드들
  const REFRESH_FAILED_STATUSES = [400, 401, 403];

  if (REFRESH_FAILED_STATUSES.includes(response.status)) {
    deleteCookie("authorization");
    console.warn("리프레시 토큰이 만료되었거나 유효하지 않습니다. 강제 로그아웃이 필요합니다.");
    throw new RefreshTokenInvalidError("Refresh token invalid or expired.");
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}, isRetry = false) {
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

  // 토큰 만료 처리 (재시도가 아닌 경우에만)
  if (!isRetry) {
    const tokenExpired = await checkTokenExpiration(response);
    if (tokenExpired) {
      return await handleTokenRefresh(url, newOptions);
    }
  }

  return response;
}

// --- 토큰 만료 확인 함수 ---
async function checkTokenExpiration(response: Response): Promise<boolean> {
  if (response.status !== 403) return false;

  // 토큰이 없으면 토큰 만료가 아님 (로그인하지 않은 상태)
  const accessToken = getCookie("authorization");
  if (!accessToken) return false;

  try {
    const clonedResponse = response.clone();
    const errorData: ApiErrorResponse = await clonedResponse.json();

    // 토큰이 있는 상태에서 토큰 관련 에러인 경우에만 토큰 만료로 판단
    return (
      errorData.code === TOKEN_ERROR_CODES.ACCESS_TOKEN_EXPIRED ||
      errorData.message?.includes("JWT 토큰을 찾을 수 없습니다") ||
      errorData.message?.includes("토큰이 만료되었습니다") ||
      errorData.message?.includes("액세스 토큰이 만료되었습니다")
    );
  } catch (e) {
    console.error("토큰 만료 확인 중 에러:", e);
    return false;
  }
}

// --- 토큰 재발급 및 재시도 처리 함수 ---
async function handleTokenRefresh(url: string, options: RequestInit): Promise<Response> {
  console.warn("액세스 토큰 만료 감지. 재발급 시도...");

  if (!isRefreshingToken) {
    isRefreshingToken = true;
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        processFailedRequestsQueue(null, newAccessToken);
        return await retryRequestWithNewToken(url, options, newAccessToken);
      } else {
        processFailedRequestsQueue(new Error("토큰 재발급 실패로 인한 요청 중단"), null);
        throw new Error("토큰 재발급 실패");
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
    // 이미 재발급 중: 현재 요청을 큐에 추가
    console.log(
      "이미 토큰 재발급 중. 현재 요청을 큐에 추가:",
      url.replace(API_CONFIG.BASE_URL, "")
    );
    return new Promise((resolve, reject) => {
      failedRequestsQueue.push({ resolve, reject, url, options });
    });
  }
}

// --- 새 토큰으로 요청 재시도 함수 ---
async function retryRequestWithNewToken(
  url: string,
  options: RequestInit,
  newAccessToken: string
): Promise<Response> {
  const retryHeaders = new Headers(options.headers);
  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
  const retryOptions = { ...options, headers: retryHeaders };

  console.log("원래 요청 재시도:", url);
  return await fetch(url, retryOptions);
}
