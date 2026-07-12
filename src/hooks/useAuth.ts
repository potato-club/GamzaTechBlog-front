/**
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 *
 * 이 훅은 여러 피처에서 공통으로 사용되는 횡단 관심사(cross-cutting concern)로
 * shared hooks 영역에서 관리됩니다.
 */

import { authService } from "@/features/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { performLogout } from "@/lib/tokenManager";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { userRole, userProfile: contextProfile, isLoading, refetch } = useAuthContext();

  const isLoggedIn = userRole !== null && userRole !== undefined;
  const needsProfileCompletion = userRole === "PRE_REGISTER";
  const userProfile = needsProfileCompletion ? null : contextProfile;

  const logout = async () => {
    await performLogout(authService.logout);
    // 클라이언트 인증 컨텍스트를 즉시 갱신(비로그인으로) + server-dynamic 페이지 재검증
    await refetch();
    router.refresh();
  };

  const refetchAuthStatus = async () => {
    await refetch();
    router.refresh();
  };

  return {
    isLoggedIn,
    userProfile,
    needsProfileCompletion,
    isLoading,
    error: null,
    isError: false,
    logout,
    refetchAuthStatus,
  };
}
