/**
 * TanStack Query를 사용한 사용자 관련 API 훅들
 * 
 * TanStack Query는 서버 상태 관리를 위한 라이브러리입니다.
 * 기존의 useEffect + useState 패턴을 대체하여 더 효율적으로 
 * 서버 데이터를 캐싱, 동기화, 업데이트할 수 있습니다.
 * 
 * postService 등과 마찬가지로 fetch의 next 캐싱 대신 
 * TanStack Query의 클라이언트 캐싱을 활용합니다.
 * 
 * 주요 훅들 (각각 단일 책임 원칙에 따라 독립적으로 작동):
 * - useUserProfile: 사용자 프로필 정보 조회
 * - useUserRole: 사용자 역할 정보 조회  
 * - useUserActivityStats: 사용자 활동 통계 조회 (게시글 수, 댓글 수 등)
 * - useUpdateProfileInSignup: 회원가입 시 프로필 업데이트 뮤테이션
 * - useWithdrawAccount: 계정 탈퇴 뮤테이션
 */

import { userService } from '@/services/userService';
import { UserActivityStats, UserProfileData } from '@/types/user';
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';

// Query Key 상수들 - 캐시를 식별하는 고유 키들입니다
export const USER_QUERY_KEYS = {
  // 모든 사용자 관련 쿼리의 상위 키 (전체 무효화 시 사용)
  all: ['user'] as const,
  // 사용자 프로필 쿼리 키
  profile: () => [...USER_QUERY_KEYS.all, 'profile'] as const,
  // 사용자 활동 통계 쿼리 키  
  activityStats: () => [...USER_QUERY_KEYS.all, 'activityStats'] as const,
  // 사용자 역할 쿼리 키
  role: () => [...USER_QUERY_KEYS.all, 'role'] as const,
} as const;

/**
 * 사용자 프로필 정보를 조회하는 훅
 * 
 * TanStack Query의 useQuery를 사용하여 서버에서 사용자 프로필을 가져옵니다.
 * 성공적으로 데이터를 가져오면 자동으로 캐시되며, staleTime 동안 캐시된 데이터를 사용합니다.
 * 
 * @param options - TanStack Query 옵션
 */
export function useUserProfile(
  options?: Omit<UseQueryOptions<UserProfileData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 사용자 활동 통계를 조회하는 훅
 * 
 * 작성한 게시글 수, 댓글 수, 좋아요 수 등의 통계 정보를 가져옵니다.
 * TanStack Query를 통해 캐싱, 백그라운드 업데이트, 에러 처리를 자동화합니다.
 * 
 * @param options - TanStack Query 옵션
 */
export function useUserActivityStats(
  options?: Omit<UseQueryOptions<UserActivityStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.activityStats(),
    queryFn: () => userService.getActivityCounts(),

    // 통계는 자주 변하지 않으므로 더 긴 캐시 시간 설정
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 사용자 역할을 조회하는 훅
 * 
 * TanStack Query의 useQuery를 사용하여 서버에서 사용자 역할(ROLE)을 가져옵니다.
 * 역할은 'USER', 'PRE_REGISTER' 등의 값을 가지며, 인증 상태를 판단하는 데 사용됩니다.
 * 
 * @param options - TanStack Query 옵션
 */
export function useUserRole(
  options?: Omit<UseQueryOptions<string | null, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.role(),
    queryFn: () => userService.getUserRole(),
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 회원가입 시 프로필을 업데이트하는 뮤테이션 훅
 * 
 * useMutation은 CREATE, UPDATE, DELETE와 같은 변경 작업에 사용합니다.
 * 성공 시 프로필 캐시를 업데이트하고 활동 통계 캐시를 무효화합니다.
 * 
 * @param options - TanStack Query 뮤테이션 옵션
 */
export function useUpdateProfileInSignup(
  options?: UseMutationOptions<UserProfileData, Error, Partial<UserProfileData>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<UserProfileData>) =>
      userService.updateProfileInSignup(profileData),

    onSuccess: (updatedProfile, variables, context) => {
      // 프로필 업데이트 성공 시 프로필 캐시 업데이트
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);

      // 활동 통계 캐시 무효화 (새로운 사용자이므로 다시 가져오기)
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.activityStats()
      });

      console.log('프로필 업데이트 성공 - 프로필 캐시가 갱신되었습니다');

      // 사용자 정의 성공 콜백 실행
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
 * 
 * 계정 탈퇴는 로그아웃과 달리 계정 자체를 삭제하는 작업입니다.
 * 성공 시 모든 캐시를 완전히 제거합니다.
 * 
 * @param options - TanStack Query 뮤테이션 옵션
 */
export function useWithdrawAccount(
  options?: UseMutationOptions<void, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdrawAccount(),

    onSuccess: (data, variables, context) => {
      // 계정 탈퇴 성공 시 모든 캐시 제거
      queryClient.clear();      // 쿠키도 완전히 제거
      deleteCookie('authorization', { path: '/', domain: '.gamzatech.site' });

      console.log('계정 탈퇴 성공 - 모든 캐시 및 인증 정보가 제거되었습니다');

      window.location.href = '/';

      // 사용자 정의 성공 콜백 실행
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
 * 인증 상태를 종합적으로 관리하는 컴포지션 훅
 * 
 * 기존의 독립적인 훅들(useUserProfile, useUserRole)을 조합하여
 * 인증 상태를 종합적으로 판단하고 필요한 인터페이스를 제공합니다.
 * 
 * 각 기능은 독립적인 훅으로 분리되어 있어 단일 책임 원칙을 따르며,
 * 이 훅은 단순히 조합하는 역할만 수행합니다.
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // 각각 독립적인 훅들을 사용 - 단일 책임 원칙 준수
  const profileQuery = useUserProfile();
  const roleQuery = useUserRole();

  // 인증 상태 계산 로직
  const isLoggedIn = roleQuery.data !== null && roleQuery.data !== undefined;
  const needsProfileCompletion = roleQuery.data === 'PRE_REGISTER';
  const userProfile = needsProfileCompletion ? null : profileQuery.data;

  // 전체 로딩 상태 (둘 중 하나라도 로딩 중이면 로딩 상태)
  const isLoading = roleQuery.isLoading || (isLoggedIn && !needsProfileCompletion && profileQuery.isLoading);

  // 로그인 후 캐시 업데이트 함수
  const login = (userData: UserProfileData, userRole: string) => {
    queryClient.setQueryData(USER_QUERY_KEYS.profile(), userData);
    queryClient.setQueryData(USER_QUERY_KEYS.role(), userRole);
    console.log('로그인 성공 - 프로필 및 역할 캐시가 업데이트되었습니다');
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    try {
      await userService.logout();
      console.log('백엔드 로그아웃 완료');
    } catch (logoutError) {
      console.error("백엔드 로그아웃 API 호출 실패:", logoutError);
    } finally {
      // 사용자 관련 캐시만 제거 (활동 통계는 유지)
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.profile() });
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.role() });

      // 쿠키 삭제
      deleteCookie('authorization', { path: '/', domain: '.gamzatech.site' });
      console.log('클라이언트 로그아웃 처리 완료 - 인증 관련 캐시 및 쿠키가 제거되었습니다');
    }
  };

  // 인증 상태 새로고침 함수
  const refetchAuthStatus = async () => {
    const results = await Promise.allSettled([
      roleQuery.refetch(),
      profileQuery.refetch()
    ]);

    console.log('인증 상태 새로고침 완료');
    return results;
  };

  return {
    // 인증 상태
    isLoggedIn,
    userProfile,
    needsProfileCompletion,

    // 로딩 및 에러 상태
    isLoading,
    error: roleQuery.error || profileQuery.error,
    isError: roleQuery.isError || profileQuery.isError,

    // 액션 함수들
    login,
    logout,
    refetchAuthStatus,

    // 개별 쿼리 접근 (필요한 경우)
    profileQuery,
    roleQuery,
  };
}
