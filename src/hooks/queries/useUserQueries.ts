/**
 * TanStack Query를 사용한 사용자 관련 API 훅들
 */

import { userService } from '@/services/userService';
import type {
  UpdateProfileRequest,
  UserActivityResponse,
  UserProfileRequest,
  UserProfileResponse,
} from '@/generated/api';
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';

// Query Key 상수들
export const USER_QUERY_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_QUERY_KEYS.all, 'profile'] as const,
  activityStats: () => [...USER_QUERY_KEYS.all, 'activityStats'] as const,
  role: () => [...USER_QUERY_KEYS.all, 'role'] as const,
} as const;

/**
 * 사용자 프로필 정보를 조회하는 훅
 */
export function useUserProfile(
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 사용자 활동 통계를 조회하는 훅
 */
export function useUserActivityStats(
  options?: Omit<UseQueryOptions<UserActivityResponse, Error>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<string | null, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.role(),
    queryFn: () => userService.getUserRole(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
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
    mutationFn: (profileData: UserProfileRequest) =>
      userService.updateProfileInSignup(profileData),
    onSuccess: (updatedProfile, variables, context) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.activityStats() });
      options?.onSuccess?.(updatedProfile, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('프로필 업데이트 실패:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 계정 탈퇴 뮤테이션 훅
 */
export function useWithdrawAccount(
  options?: UseMutationOptions<void, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdrawAccount(),
    onSuccess: (data, variables, context) => {
      queryClient.clear();
      deleteCookie('authorization', { path: '/', domain: '.gamzatech.site' });
      window.location.href = '/';
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('계정 탈퇴 실패:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 프로필 이미지를 업로드하는 뮤테이션 훅
 */
export function useUpdateProfileImage(
  options?: UseMutationOptions<string, Error, File>
) {
  return useMutation({
    mutationFn: (imageFile: File) => userService.updateProfileImage(imageFile),
    onSuccess: (imageUrl, variables, context) => {
      console.log('프로필 이미지 업로드 성공:', imageUrl);
      options?.onSuccess?.(imageUrl, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('프로필 이미지 업로드 실패:', error);
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
      console.error('프로필 업데이트 실패:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 */
export function useAuth() {
  const queryClient = useQueryClient();

  const profileQuery = useUserProfile();
  const roleQuery = useUserRole();

  const isLoggedIn = roleQuery.data !== null && roleQuery.data !== undefined;
  const needsProfileCompletion = roleQuery.data === 'PRE_REGISTER';
  const userProfile = needsProfileCompletion ? null : profileQuery.data;

  const isLoading = roleQuery.isLoading || (isLoggedIn && !needsProfileCompletion && profileQuery.isLoading);

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
      deleteCookie('authorization', { path: '/', domain: '.gamzatech.site' });
    }
  };

  const refetchAuthStatus = async () => {
    const results = await Promise.allSettled([
      roleQuery.refetch(),
      profileQuery.refetch()
    ]);
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
    profileQuery,
    roleQuery,
  };
}
