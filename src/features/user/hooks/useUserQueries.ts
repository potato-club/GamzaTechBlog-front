/**
 * TanStack Query를 사용한 사용자 관련 API 훅들
 */

import type {
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api/models";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { userService } from "../services";

// Query Key 상수들
export const USER_QUERY_KEYS = {
  all: ["user"] as const,
  profile: () => [...USER_QUERY_KEYS.all, "profile"] as const,
  activityStats: () => [...USER_QUERY_KEYS.all, "activityStats"] as const,
  role: () => [...USER_QUERY_KEYS.all, "role"] as const,
} as const;

/**
 * 사용자 프로필 정보를 조회하는 훅
 */
export function useUserProfile(
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, "queryKey" | "queryFn">
) {
  const queryClient = useQueryClient();
  const { status } = useSession();

  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      // RefreshTokenInvalidError는 재시도하지 않음
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "RefreshTokenInvalidError"
      ) {
        // 토큰이 만료된 경우 로그아웃 처리
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.profile() });
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.role() });
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    enabled: status === "authenticated", // 인증된 경우에만 쿼리 실행
    ...options,
  });
}

/**
 * 사용자 활동 통계를 조회하는 훅
 */
export function useUserActivityStats(
  options?: Omit<UseQueryOptions<UserActivityResponse, Error>, "queryKey" | "queryFn">
) {
  const { status } = useSession();
  return useQuery({
    queryKey: USER_QUERY_KEYS.activityStats(),
    queryFn: () => userService.getActivityCounts(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: status === "authenticated", // 인증된 경우에만 쿼리 실행
    ...options,
  });
}

/**
 * 사용자 역할을 조회하는 훅
 */
export function useUserRole(
  options?: Omit<UseQueryOptions<string | null, Error>, "queryKey" | "queryFn">
) {
  const queryClient = useQueryClient();
  const { status } = useSession();

  return useQuery({
    queryKey: USER_QUERY_KEYS.role(),
    queryFn: () => userService.getUserRole(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: (failureCount, error) => {
      // RefreshTokenInvalidError는 재시도하지 않음
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "RefreshTokenInvalidError"
      ) {
        // 토큰이 만료된 경우 로그아웃 처리
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.profile() });
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.role() });
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    enabled: status === "authenticated", // 인증된 경우에만 쿼리 실행
    ...options,
  });
}

/**
 * 회원가입 시 프로필을 업데이트하는 뮤테이션 훅
 */
export function useUpdateProfileInSignup(
  options?: UseMutationOptions<UserProfileResponse, Error, UserProfileRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UserProfileRequest) => userService.updateProfileInSignup(profileData),
    onSuccess: (updatedProfile, variables, context) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.activityStats() });
      options?.onSuccess?.(updatedProfile, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 계정 탈퇴 뮤테이션 훅
 */
export function useWithdrawAccount(options?: UseMutationOptions<void, Error, void>) {
  return useMutation({
    mutationFn: () => userService.withdrawAccount(),
    onSuccess: async (data, variables, context) => {
      await options?.onSuccess?.(data, variables, context);
      await signOut({ callbackUrl: "/" });
    },
    onError: (error, variables, context) => {
      console.error("계정 탈퇴 실패:", error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 사용자 프로필을 업데이트하는 뮤테이션 훅
 */
export function useUpdateProfile(
  options?: UseMutationOptions<UserProfileResponse, Error, UpdateProfileRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => userService.updateProfile(profileData),
    onSuccess: (updatedProfile, variables, context) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      options?.onSuccess?.(updatedProfile, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 */
export function useAuth() {
  const { status } = useSession();

  const profileQuery = useUserProfile();
  const roleQuery = useUserRole();

  const isLoggedIn = status === "authenticated";
  const needsProfileCompletion = isLoggedIn && roleQuery.data === "PRE_REGISTER";
  const userProfile = isLoggedIn && !needsProfileCompletion ? profileQuery.data : undefined;

  const isLoading =
    status === "loading" ||
    (isLoggedIn && (roleQuery.isLoading || (!needsProfileCompletion && profileQuery.isLoading)));

  const logout = async () => {
    try {
      await userService.logout();
    } catch (logoutError) {
      console.error("백엔드 로그아웃 API 호출 실패(무시 가능):", logoutError);
    } finally {
      // Auth.js의 signOut 함수를 호출하여 세션을 종료합니다.
      await signOut({ callbackUrl: "/" });
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
    logout,
    refetchAuthStatus,
    profileQuery,
    roleQuery,
  };
}
