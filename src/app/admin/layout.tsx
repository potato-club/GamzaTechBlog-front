import { AuthGuard } from "@/lib/auth-guard";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * 관리자 페이지 레이아웃 - 서버 사이드에서 ADMIN 권한 체크
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard requiredRole="ADMIN" fallbackUrl="/auth/error">
      {children}
    </AuthGuard>
  );
}
