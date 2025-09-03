"use client";

import { apiClient, updateTokenExpiration } from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";
import { useEffect } from "react";

// QueryClient 인스턴스를 모듈 레벨에서 생성하여 다른 곳에서 임포트할 수 있도록 export 합니다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initialAccessToken = getCookie("authorization");

    console.log("Initial access token on app load:", initialAccessToken);

    if (typeof initialAccessToken === "string" && initialAccessToken) {
      // 1. 만료 시간 추적을 우선 설정합니다.
      updateTokenExpiration(initialAccessToken);

      // 2. 토큰이 이미 만료되었는지 확인합니다.
      try {
        const payload = decodeJwt(initialAccessToken);
        const isAlreadyExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;

        if (isAlreadyExpired) {
          console.warn("Token already expired on app load. Triggering refresh immediately.");
          // 3. 만료되었다면, 재발급 로직을 트리거하기 위해 인증 필요한 API를 호출합니다.
          // 이 호출의 성공/실패 여부는 중요하지 않으며, apiClient 내부의 재발급 로직을 실행시키는 것이 목적입니다.
          apiClient.getCurrentUserProfile().catch((err) => {
            console.error("Failed to refresh token on load, user might need to log in again:", err);
          });
        }
      } catch (e) {
        console.error("Could not decode initial token on app load:", e);
      }
    }
  }, []); // 빈 의존성 배열은 이 effect가 마운트 시 한 번만 실행되도록 보장합니다.

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
