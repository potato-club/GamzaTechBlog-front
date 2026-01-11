"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import type { UserProfileResponse } from "@/generated/api/models";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

// 🎯 개발 환경에서만 Devtools 로드
const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then((mod) => ({
            default: mod.ReactQueryDevtools,
          })),
        { ssr: false }
      )
    : () => null;

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

interface ProvidersProps {
  children: React.ReactNode;
  initialUserRole?: string | null;
  initialUserProfile?: UserProfileResponse | null;
}

export default function Providers({
  children,
  initialUserRole,
  initialUserProfile,
}: ProvidersProps) {
  return (
    <AuthProvider initialUserRole={initialUserRole} initialUserProfile={initialUserProfile}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
