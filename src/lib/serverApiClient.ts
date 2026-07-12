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
 * 공개(비인증) 조회 전용 API 클라이언트
 *
 * native `fetch`를 그대로 쓴다 — 쿠키·Authorization을 붙이지 않으므로(그건 `backendFetch`가
 * 직접 하는 동작), 이 클라이언트를 타는 서버 컴포넌트가 정적화(ISR)되고 응답이 공유 캐시에
 * 안전하게 저장된다(개인화 누출 방지). 공개 조회(게시글 상세 등)에만 사용할 것.
 */
export const createPublicBackendApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    fetchApi: fetch as typeof fetch,
  });

  return new DefaultApi(config);
};
