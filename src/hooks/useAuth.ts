/**
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 *
 * 이 훅은 여러 피처에서 공통으로 사용되는 횡단 관심사(cross-cutting concern)로
 * shared hooks 영역에서 관리됩니다.
 */

import { authService } from "@/features/auth";
import { useUserProfile, useUserRole } from "@/features/user";
import type { UserProfileResponse } from "@/generated/api/models";
import { performLogout } from "@/lib/tokenManager";
import { useQueryClient } from "@tanstack/react-query";

interface UseAuthOptions {
  initialUserRole?: string | null;
  initialUserProfile?: UserProfileResponse | null;
}

export function useAuth(options: UseAuthOptions = {}) {
  const queryClient = useQueryClient();

  const roleQuery = useUserRole({
    initialData: options.initialUserRole,
  });

  const isLoggedIn = roleQuery.data !== null && roleQuery.data !== undefined;
  const needsProfileCompletion = roleQuery.data === "PRE_REGISTER";
  const profileQuery = useUserProfile({
    enabled: isLoggedIn && !needsProfileCompletion,
    initialData: options.initialUserProfile ?? undefined,
  });
  const userProfile = needsProfileCompletion ? null : profileQuery.data;

  const isLoading =
    roleQuery.isLoading || (isLoggedIn && !needsProfileCompletion && profileQuery.isLoading);

  const logout = async () => {
    await performLogout(authService.logout, queryClient);
  };

  const refetchAuthStatus = async () => {
    const results = await Promise.allSettled([roleQuery.refetch(), profileQuery.refetch()]);
    return results;
  };

  return {
    isLoggedIn,
    userProfile,
    needsProfileCompletion,
    isLoading,
    error: roleQuery.error || profileQuery.error,
    isError: roleQuery.isError || profileQuery.isError,
    logout,
    refetchAuthStatus,
  };
}
