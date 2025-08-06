"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

// QueryClient 인스턴스를 모듈 레벨에서 생성하여 export 합니다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 여기에 기본 쿼리 옵션을 설정할 수 있습니다.
      // 예: staleTime, cacheTime 등
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
