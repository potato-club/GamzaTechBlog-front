import { getSession } from "next-auth/react";
import { auth } from "../auth";
import { Configuration, DefaultApi } from "../generated/api";

/**
 * NextAuth.js 세션과 통합된 새로운 fetch 함수입니다.
 * API 요청 시 자동으로 Authorization 헤더에 액세스 토큰을 추가합니다.
 * 토큰 재발급 및 요청 대기열과 같은 복잡한 로직은 모두 Auth.js의 콜백에서 처리되므로
 * 이 파일에서는 해당 로직이 모두 제거되었습니다.
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let session;
  if (typeof window === "undefined") {
    // Server-side
    try {
      session = await auth();
    } catch {
      // 빌드 시점에는 세션이 없을 수 있으므로 오류를 무시하고 진행합니다.
      console.warn("Auth.js failed during build, continuing without session.");
      session = null;
    }
  } else {
    // Client-side
    session = await getSession();
  }

  const headers = new Headers(options.headers);

  console.log("Session in fetchWithAuth:", session); // Added for debugging

  // 세션에 액세스 토큰이 있으면 Authorization 헤더에 추가합니다.
  if (session?.authorization) {
    headers.set("Authorization", `Bearer ${session.authorization}`);
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

  // 수정된 옵션으로 API 요청을 보냅니다.
  const response = await fetch(url, newOptions);

  // 401 Unauthorized 응답 시 클라이언트 사이드에서 메인 페이지로 리다이렉트
  if (response.status === 401 && typeof window !== "undefined") {
    console.warn("API request returned 401, redirecting to home...");
    const currentPath = window.location.pathname;
    window.location.href = `/?error=session_expired&redirect=${encodeURIComponent(currentPath)}`;
    return response;
  }

  return response;
}

// --- API 클라이언트 설정 ---
// 생성된 API 클라이언트가 우리가 만든 fetchWithAuth 함수를 사용하도록 설정합니다.
const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
  fetchApi: fetchWithAuth as typeof fetch,
  credentials: "include",
});

/**
 * 프로젝트 전역에서 사용되는 API 클라이언트 인스턴스입니다.
 */
export const apiClient = new DefaultApi(apiConfig);
