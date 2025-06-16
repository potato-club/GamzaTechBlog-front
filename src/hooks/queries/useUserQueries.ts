/**
 * TanStack Query를 사용한 사용자 관련 API 훅들
 * 
 * TanStack Query는 서버 상태 관리를 위한 라이브러리입니다.
 * 기존의 useEffect + useState 패턴을 대체하여 더 효율적으로 
 * 서버 데이터를 캐싱, 동기화, 업데이트할 수 있습니다.
 */

import { userService } from '@/services/userService';
import { UserProfileData } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
 * useQuery는 GET 요청과 같은 읽기 전용 작업에 사용합니다.
 * 자동으로 캐싱, 백그라운드 재검증, 에러 처리 등을 제공합니다.
 */
export function useUserProfile() {
  return useQuery({
    // queryKey: 캐시를 식별하는 고유 키 (배열 형태)
    queryKey: USER_QUERY_KEYS.profile(),

    // queryFn: 실제 데이터를 가져오는 함수
    queryFn: () => userService.getProfile(),

    // staleTime: 데이터가 "신선한" 상태로 유지되는 시간 (5분)
    // 이 시간 동안은 다시 요청하지 않고 캐시된 데이터를 사용합니다
    staleTime: 5 * 60 * 1000, // 5분

    // retry: 실패 시 재시도 횟수
    retry: 2,

    // refetchOnWindowFocus: 창에 포커스가 돌아올 때 자동 재검증 여부
    refetchOnWindowFocus: false,
  });
}

/**
 * 사용자 활동 통계를 조회하는 훅
 * 
 * 작성한 게시글 수, 댓글 수, 좋아요 수 등의 통계 정보를 가져옵니다.
 */
export function useUserActivityStats() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.activityStats(),
    queryFn: () => userService.getActivityCounts(),

    // 통계는 자주 변하지 않으므로 더 긴 캐시 시간 설정
    staleTime: 10 * 60 * 1000, // 10분
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * 사용자 역할을 조회하는 훅
 */
export function useUserRole() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.role(),
    queryFn: () => userService.getUserRole(),
    staleTime: 10 * 60 * 1000, // 10분 - 역할은 자주 변하지 않음
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * 회원가입 시 프로필을 업데이트하는 뮤테이션 훅
 * 
 * useMutation은 CREATE, UPDATE, DELETE와 같은 변경 작업에 사용합니다.
 * 성공/실패 콜백, 로딩 상태 등을 제공합니다.
 */
export function useUpdateProfileInSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: 실제 변경 작업을 수행하는 함수
    mutationFn: (profileData: Partial<UserProfileData>) =>
      userService.updateProfileInSignup(profileData),

    // onSuccess: 변경 작업이 성공했을 때 실행되는 콜백
    onSuccess: (updatedProfile) => {
      // 성공 시 사용자 프로필 캐시를 새로운 데이터로 업데이트
      queryClient.setQueryData(USER_QUERY_KEYS.profile(), updatedProfile);

      // 관련된 다른 쿼리들도 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.activityStats()
      });

      console.log('프로필 업데이트 성공 - 캐시가 갱신되었습니다');
    },

    // onError: 변경 작업이 실패했을 때 실행되는 콜백
    onError: (error) => {
      console.error('프로필 업데이트 실패:', error);
    },
  });
}

/**
 * 로그아웃 뮤테이션 훅
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.logout(),

    onSuccess: () => {
      // 로그아웃 성공 시 모든 사용자 관련 캐시 제거
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.all });

      // 또는 모든 쿼리 캐시를 초기화할 수도 있습니다
      // queryClient.clear();

      console.log('로그아웃 성공 - 모든 사용자 캐시가 제거되었습니다');
    },

    onError: (error) => {
      console.error('로그아웃 실패:', error);
    },
  });
}

/**
 * 계정 탈퇴 뮤테이션 훅
 */
export function useWithdrawAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdrawAccount(),

    onSuccess: () => {
      // 계정 탈퇴 성공 시 모든 캐시 제거
      queryClient.clear();
      console.log('계정 탈퇴 성공 - 모든 캐시가 제거되었습니다');
    },

    onError: (error) => {
      console.error('계정 탈퇴 실패:', error);
    },
  });
}
