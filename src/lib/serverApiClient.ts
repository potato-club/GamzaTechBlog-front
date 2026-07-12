import "server-only";

import { Configuration, DefaultApi } from "@/generated/api";
import { cookies } from "next/headers";

export const backendFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const createBackendApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetchApi: backendFetch as typeof fetch,
  });

  return new DefaultApi(config);
};

/**
 * 공개(비인증) 조회 전용 fetch
 *
 * `backendFetch`와 달리 `cookies()`를 호출하지 않는다. 쿠키(dynamic API) 접근이 없어야
 * 이 fetch를 타는 서버 컴포넌트가 정적화(ISR)될 수 있다. 또한 요청자 토큰이 붙지 않으므로
 * 응답이 공유 Data Cache에 안전하게 저장된다(개인화 누출 방지).
 *
 * 공개 조회(게시글 상세 등)에만 사용할 것. 개인화 조회는 `backendFetch`를 쓴다.
 */
export const publicFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * 공개(비인증) 조회 전용 API 클라이언트
 * 쿠키를 읽지 않는 `publicFetch`를 사용한다.
 */
export const createPublicBackendApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetchApi: publicFetch as typeof fetch,
  });

  return new DefaultApi(config);
};
