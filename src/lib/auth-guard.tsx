import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
  fallbackUrl?: string;
}

/**
 * 서버 컴포넌트에서 사용하는 인증 가드
 */
export async function AuthGuard({ children, requiredRole, fallbackUrl = "/" }: AuthGuardProps) {
  const session = await auth();

  // 인증되지 않은 경우
  if (!session || !session.user) {
    redirect(`${fallbackUrl}?error=authentication_required`);
  }

  // 토큰 에러가 있는 경우
  if (session.error === "RefreshAccessTokenError") {
    redirect(`${fallbackUrl}?error=session_expired`);
  }

  // 특정 역할이 필요한 경우
  if (requiredRole && session.user.role !== requiredRole) {
    redirect("/auth/error?error=insufficient_permissions");
  }

  return <>{children}</>;
}

/**
 * 클라이언트 컴포넌트에서 사용하는 인증 가드 훅
 */
// export function useAuthGuard(requiredRole?: string) {
//   // 이 부분은 클라이언트 컴포넌트에서 사용
//   // useSession과 useRouter를 활용한 클라이언트 사이드 가드
// }
