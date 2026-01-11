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
  const { userRole, userProfile: profileFromServer } = useAuthContext();

  const isLoggedIn = userRole !== null && userRole !== undefined;
  const needsProfileCompletion = userRole === "PRE_REGISTER";
  const userProfile = needsProfileCompletion ? null : profileFromServer;
  const isLoading = false;

  const logout = async () => {
    await performLogout(authService.logout);
    router.refresh();
  };

  const refetchAuthStatus = async () => {
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
