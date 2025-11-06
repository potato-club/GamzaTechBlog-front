/**
 * 좋아요 관련 읽기 전용 훅들
 *
 * 책임: 좋아요 상태 조회 (읽기 전용)
 * 변경 작업(추가, 취소)은 useLikeMutations.ts 참조
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { likeService } from "../services/likeService";

// 좋아요 관련 Query Key
export const LIKE_QUERY_KEYS = {
  all: ["likes"] as const,
  status: (postId: number) => [...LIKE_QUERY_KEYS.all, "status", postId] as const,
} as const;

/**
 * 특정 게시글의 좋아요 상태를 확인하는 쿼리 훅
 *
 * @param postId - 조회할 게시글 ID
 * @param enabled - 쿼리 활성화 여부 (로그인 상태에 따라 제어)
 * @param options - React Query 옵션
 */
export function useLikeStatus(
  postId: number,
  enabled: boolean = true,
  options?: Omit<UseQueryOptions<boolean, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: LIKE_QUERY_KEYS.status(postId),
    queryFn: () => likeService.checkLikeStatus(postId),
    enabled: enabled && !!postId, // 로그인 상태이고 postId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 1, // 에러 시 1회만 재시도
    ...options,
  });
}
