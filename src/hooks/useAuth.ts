/**
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 *
 * 이 훅은 여러 피처에서 공통으로 사용되는 횡단 관심사(cross-cutting concern)로
 * shared hooks 영역에서 관리됩니다.
 */

import { USER_QUERY_KEYS, userService, useUserProfile, useUserRole } from "@/features/user";
import type { UserProfileResponse } from "@/generated/api/models";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export function useAuth() {
  const queryClient = useQueryClient();

  const profileQuery = useUserProfile();
  const roleQuery = useUserRole();

  const isLoggedIn = roleQuery.data !== null && roleQuery.data !== undefined;
  const needsProfileCompletion = roleQuery.data === "PRE_REGISTER";
  const userProfile = needsProfileCompletion ? null : profileQuery.data;

  const isLoading =
    roleQuery.isLoading || (isLoggedIn && !needsProfileCompletion && profileQuery.isLoading);

  const login = (userData: UserProfileResponse, userRole: string) => {
    queryClient.setQueryData(USER_QUERY_KEYS.profile(), userData);
    queryClient.setQueryData(USER_QUERY_KEYS.role(), userRole);
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (logoutError) {
      console.error("백엔드 로그아웃 API 호출 실패:", logoutError);
    } finally {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.profile() });
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.role() });
      deleteCookie("authorization", { path: "/", domain: ".gamzatech.site" });
    }
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
    login,
    logout,
    refetchAuthStatus,
    // 추가적인 세부 정보가 필요한 경우를 위해 개별 쿼리도 노출
    queries: {
      profile: profileQuery,
      role: roleQuery,
    },
  };
}
