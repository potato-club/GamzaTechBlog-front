/**
 * TanStack Query를 사용한 사용자 관련 읽기 전용 훅들
 *
 * 책임: 사용자 데이터 조회 (읽기 전용)
 * 변경 작업(프로필 수정, 계정 탈퇴 등)은 useUserMutations.ts 참조
 */

import type {
  Pageable,
  UserActivityResponse,
  UserProfileResponse,
  UserPublicProfileResponse,
} from "@/generated/api/models";
import { handleTokenExpiration, isRefreshTokenInvalidError } from "@/lib/tokenManager";
import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { userService } from "../services";

// Query Key 상수들
export const USER_QUERY_KEYS = {
  all: ["user"] as const,
  profile: () => [...USER_QUERY_KEYS.all, "profile"] as const,
  activityStats: () => [...USER_QUERY_KEYS.all, "activityStats"] as const,
  role: () => [...USER_QUERY_KEYS.all, "role"] as const,
  publicProfile: (username: string) => [...USER_QUERY_KEYS.all, "publicProfile", username] as const,
  publicActivityStats: (username: string) =>
    [...USER_QUERY_KEYS.all, "publicActivityStats", username] as const,
  publicPosts: (username: string) => [...USER_QUERY_KEYS.all, "publicPosts", username] as const,
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
      if (isRefreshTokenInvalidError(error)) {
        // 토큰이 만료된 경우 로그아웃 처리
        handleTokenExpiration(queryClient);
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
      if (isRefreshTokenInvalidError(error)) {
        // 토큰이 만료된 경우 로그아웃 처리
        handleTokenExpiration(queryClient);
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 공개 프로필 정보를 조회하는 훅
 */
export function usePublicProfile(
  nickname: string,
  params?: Pageable,
  options?: Omit<UseQueryOptions<UserPublicProfileResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.publicProfile(nickname), params],
    queryFn: () => userService.getPublicProfile(nickname, params),
    enabled: !!nickname,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 공개 프로필의 활동 통계를 조회하는 훅
 */
// export function usePublicActivityStats(
//   nickname: string,
//   options?: Omit<UseQueryOptions<UserActivityResponse, Error>, "queryKey" | "queryFn">
// ) {
//   return useQuery({
//     queryKey: USER_QUERY_KEYS.publicActivityStats(nickname),
//     queryFn: () => userService.getPublicActivityCounts(nickname),
//     enabled: !!nickname,
//     staleTime: 1000 * 60 * 10,
//     gcTime: 1000 * 60 * 30,
//     retry: 2,
//     refetchOnWindowFocus: false,
//     ...options,
//   });
// }

/**
 * 공개 프로필의 게시글 목록을 조회하는 훅
 * 특정 사용자의 공개 게시글 조회 기능입니다.
 *
 * @param nickname - 조회할 사용자의 닉네임
 * @param params - 페이지네이션 및 정렬 파라미터
 * @param options - TanStack Query 옵션
 */
// export function usePublicPosts(
//   nickname: string,
//   params?: Pageable,
//   options?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
// ) {
//   return useQuery({
//     queryKey: [...USER_QUERY_KEYS.publicPosts(nickname), params], // 캐시 키: 공개 프로필 게시글 목록
//     queryFn: () => userService.getPublicPosts(nickname, params || { page: 0, size: 10 }),

//     enabled: !!nickname, // nickname이 있을 때만 실행
//     staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
//     gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
//     retry: 2,
//     refetchOnWindowFocus: false,
//     ...options,
//   });
// }
