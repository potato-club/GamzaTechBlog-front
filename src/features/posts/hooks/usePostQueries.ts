/**
 * TanStack Query를 사용한 게시글 관련 읽기 전용 훅들
 *
 * 책임: 게시글 데이터 조회 (읽기 전용)
 * 변경 작업(생성/수정/삭제)은 usePostMutations.ts 참조
 */

import type { Pageable, PostDetailResponse } from "@/generated/api/models";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { postService } from "../services";

// 게시글 관련 Query Key 팩토리
export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  list: (params?: Pageable) => [...POST_QUERY_KEYS.lists(), params] as const,
  popular: () => [...POST_QUERY_KEYS.all, "popular"] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
  tags: () => [...POST_QUERY_KEYS.all, "tags"] as const,
  postsByTag: (tagName: string, params?: Pageable) =>
    [...POST_QUERY_KEYS.all, "byTag", tagName, params] as const,
} as const;

/**
 * 특정 게시글의 상세 정보를 조회하는 훅
 *
 * 캐싱 전략:
 * - 게시글 내용은 자주 변하지 않으므로 긴 캐싱 시간 적용
 * - 댓글이나 좋아요는 별도 쿼리로 관리하여 독립적 업데이트
 */
export function usePost(
  postId: number,
  options?: Omit<UseQueryOptions<PostDetailResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(postId),
    queryFn: () => postService.getPostById(postId),
    staleTime: 1000 * 60 * 10, // 10분간 fresh (게시글 내용은 자주 안바뀜)
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    refetchOnWindowFocus: false,
    enabled: !!postId && postId > 0,
    ...options,
  });
}
