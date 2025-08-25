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
 *
 * ✨ React Query 중심 아키텍처:
 * - NextAuth는 토큰 관리만 담당
 * - 사용자 정보는 React Query로 관리하여 자동 캐시 무효화 및 업데이트
 * - 프로필 수정 후 간단한 invalidateQueries로 UI 자동 업데이트
 */
export function useAuth(options?: { initialData?: UserProfileResponse }) {
  const { status } = useSession();
  const queryClient = useQueryClient();

  // NextAuth는 토큰 상태만 확인
  const isLoggedIn = status === "authenticated";
  const isAuthLoading = status === "loading";

  // 사용자 정보는 React Query로 조회
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile({
    enabled: isLoggedIn, // 로그인된 경우에만 프로필 조회
    ...(options?.initialData && { initialData: options.initialData }),
  });

  // 프로필 완성 여부 확인
  const needsProfileCompletion = isLoggedIn && userProfile?.role === "PRE_REGISTER";

  // 전체 로딩 상태
  const isLoading = isAuthLoading || (isLoggedIn && isProfileLoading);

  const logout = async () => {
    try {
      await userService.logout();
    } catch (logoutError) {
      console.error("백엔드 로그아웃 API 호출 실패(무시 가능):", logoutError);
    } finally {
      // React Query 캐시 정리
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.all });
      // NextAuth 세션 종료
      await signOut({ callbackUrl: "/" });
    }
  };

  // React Query 기반 상태 갱신
  const refetchAuthStatus = async () => {
    if (isLoggedIn) {
      await refetchProfile();
    }
  };

  return {
    isLoggedIn,
    userProfile,
    needsProfileCompletion,
    isLoading,
    error: profileError,
    isError: !!profileError,
    logout,
    refetchAuthStatus,
  };
}
