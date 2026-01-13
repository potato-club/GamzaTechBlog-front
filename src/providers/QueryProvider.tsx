"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * 클라이언트용 QueryClientProvider 래퍼
 *
 * 클라이언트 컴포넌트에서 React Query를 사용하기 위한 Provider입니다.
 * 개발 환경에서는 ReactQueryDevtools도 함께 렌더링됩니다.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분
            refetchOnWindowFocus: false, // 탭 전환 시 자동 refetch 비활성화
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
