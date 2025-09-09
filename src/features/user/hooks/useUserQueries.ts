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
import { deleteCookie } from "cookies-next";
import { userService } from "../services";

// 뮤테이션 컨텍스트 타입 정의
interface UpdateProfileContext {
  previousProfile: UserProfileResponse | undefined;
}

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
        deleteCookie("authorization", { path: "/" });
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 사용자 활동 통계를 조회하는 훅
 */
export function useUserActivityStats(
  options?: Omit<UseQueryOptions<UserActivityResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.activityStats(),
    queryFn: () => userService.getActivityCounts(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
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
        deleteCookie("authorization", { path: "/" });
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdrawAccount(),
    onSuccess: (data, variables, context) => {
      queryClient.clear();
      deleteCookie("authorization", { path: "/", domain: ".gamzatech.site" });
      window.location.href = "/";
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("계정 탈퇴 실패:", error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 사용자 프로필을 업데이트하는 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useUpdateProfile(
  options?: UseMutationOptions<
    UserProfileResponse,
    Error,
    UpdateProfileRequest,
    UpdateProfileContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => userService.updateProfile(profileData),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (profileData: UpdateProfileRequest): Promise<UpdateProfileContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.profile() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousProfile = queryClient.getQueryData<UserProfileResponse>(
        USER_QUERY_KEYS.profile()
      );

      // 낙관적으로 프로필 데이터 업데이트
      if (previousProfile) {
        const optimisticProfile: UserProfileResponse = {
          ...previousProfile,
          ...profileData,
        };
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), optimisticProfile);
      }

      return { previousProfile };
    },

    onSuccess: (updatedProfile, variables, context) => {
      // 서버에서 받은 실제 데이터로 캐시 업데이트
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.activityStats() });
      options?.onSuccess?.(updatedProfile, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      console.error("프로필 업데이트 실패:", error);

      // 백업된 데이터로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(USER_QUERY_KEYS.profile(), context.previousProfile);
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile() });
    },

    ...options,
  });
}
