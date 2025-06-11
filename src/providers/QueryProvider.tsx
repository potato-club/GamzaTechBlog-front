'use client'; // 클라이언트 컴포넌트임을 명시

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode; }) {
  // QueryClient 인스턴스 생성.
  // 앱 전체에서 동일한 인스턴스를 사용하도록 useState로 관리 (컴포넌트 리렌더링 시 재생성 방지)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 기본 쿼리 옵션 설정 (선택 사항)
        staleTime: 5 * 60 * 1000, // 5분 (데이터가 fresh 상태로 유지되는 시간)
        refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화 (선택)
        retry: 1, // 실패 시 1번 재시도
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools: 개발 환경에서만 렌더링 (매우 유용) */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}