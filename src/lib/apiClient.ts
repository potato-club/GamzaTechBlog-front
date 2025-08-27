import { auth } from "../auth";
import { Configuration, DefaultApi } from "../generated/api";

/**
 * 쿠키 기반 인증을 사용하는 단순화된 fetch 함수
 * 쿠키를 Single Source of Truth로 사용하여 동기화 문제 해결
 * 401 에러 시 자동 토큰 갱신 후 재시도
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);

  if (typeof window === "undefined") {
    // Server-side - NextAuth 세션 사용
    try {
      const session = await auth();
      if (session?.authorization) {
        headers.set("Authorization", `Bearer ${session.authorization}`);
        console.warn("fetchWithAuth - Server: Using session token");
      }
    } catch {
      console.warn("fetchWithAuth - Server: No session available");
    }
  } else {
    // Client-side - 항상 쿠키 우선 사용
    const cookieAuth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authorization="))
      ?.split("=")[1];

    if (cookieAuth) {
      headers.set("Authorization", `Bearer ${cookieAuth}`);
      console.warn("fetchWithAuth - Client: Using cookie token");
    } else {
      console.warn("fetchWithAuth - Client: No authorization cookie found");
    }
  }

  // FormData가 아닌 요청 본문이 있을 경우, Content-Type을 설정합니다.
  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const newOptions: RequestInit = {
    ...options,
    headers,
    // 백엔드와 쿠키를 주고받기 위해 필요할 수 있습니다.
    credentials: "include",
  };

  // 디버깅: 실제 요청 정보 로깅
  console.warn("fetchWithAuth - Final request details:", {
    url,
    method: newOptions.method || "GET",
    headers: Object.fromEntries(headers.entries()),
    credentials: newOptions.credentials,
  });

  // 수정된 옵션으로 API 요청을 보냅니다.
  const response = await fetch(url, newOptions);

  // 응답 상태 로깅
  console.warn(`fetchWithAuth - Response status: ${response.status} for ${url}`);

  // 401 Unauthorized 응답 시 토큰 갱신 시도 또는 로그아웃
  if (response.status === 401 && typeof window !== "undefined") {
    console.warn("API request returned 401, attempting token refresh...");

    try {
      // 토큰 갱신 시도
      const refreshResponse = await fetch("/api/auth/session-check", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const result = await refreshResponse.json();
        if (result.success && result.authorization) {
          console.warn("Token refresh successful, retrying original request");

          // 새 토큰으로 원래 요청 재시도
          const newHeaders = new Headers(headers);
          newHeaders.set("Authorization", `Bearer ${result.authorization}`);

          return fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: "include",
          });
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    // 토큰 갱신 실패 시 로그아웃 처리
    console.warn("Token refresh failed, redirecting to home...");
    const currentPath = window.location.pathname;
    window.location.href = `/?error=session_expired&redirect=${encodeURIComponent(currentPath)}`;
    return response;
  }

  // 403 Forbidden 응답 시 추가 로깅
  if (response.status === 403) {
    console.error("API request returned 403 Forbidden:", {
      url,
      headers: Object.fromEntries(headers.entries()),
    });
  }

  return response;
}

// --- API 클라이언트 설정 ---
// 생성된 API 클라이언트가 우리가 만든 fetchWithAuth 함수를 사용하도록 설정합니다.
const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
  fetchApi: fetchWithAuth as typeof fetch,
  credentials: "include",
  // fetchWithAuth에서 토큰 처리를 담당하므로 여기서는 accessToken 설정을 제거합니다.
});

/**
 * 프로젝트 전역에서 사용되는 API 클라이언트 인스턴스입니다.
 */
export const apiClient = new DefaultApi(apiConfig);
