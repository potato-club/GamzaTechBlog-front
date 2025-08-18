/**
 * TanStack Query를 사용한 게시글 관련 API 훅들
 */

import {
  Pageable,
  PagedResponsePostListResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
} from "@/generated/api/models";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
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
 * 게시글 목록을 조회하는 훅 (페이지네이션)
 *
 * 캐싱 전략:
 * - staleTime: 5분간 fresh 상태 유지 (재요청 안함)
 * - gcTime: 10분간 메모리에 캐시 보관
 * - refetchOnWindowFocus: false (윈도우 포커스시 재요청 방지)
 */
export function usePosts(
  params?: Pageable,
  options?: Omit<UseQueryOptions<PagedResponsePostListResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(params),
    queryFn: () => postService.getPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트시 재요청 방지 (stale하지 않은 경우)
    ...options,
  });
}

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

/**
 * 사용 가능한 태그 목록을 조회하는 훅
 */
export function useTags(options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.tags(),
    queryFn: () => postService.getTags(),
    staleTime: 1000 * 60 * 30, // 태그는 자주 변하지 않으므로 길게 캐싱
    ...options,
  });
}

/**
 * 새 게시글을 생성하는 뮤테이션 훅
 */
export function useCreatePost(options?: UseMutationOptions<PostResponse, Error, PostRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: PostRequest) => postService.createPost(postData),
    onSuccess: (newPost, variables, context) => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });

      options?.onSuccess?.(newPost, variables, context);
    },
    ...options,
  });
}

/**
 * 게시글 삭제 뮤테이션
 */
export function useDeletePost(options?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
    onSuccess: (data, postId, context) => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      options?.onSuccess?.(data, postId, context);
    },
    ...options,
  });
}

/**
 * 게시글 수정 뮤테이션
 */
export function useUpdatePost(
  options?: UseMutationOptions<PostResponse, Error, { postId: number; data: PostRequest }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }) => postService.updatePost(postId, data),
    onSuccess: (updatedPost, variables, context) => {
      queryClient.setQueryData<PostDetailResponse | undefined>(
        POST_QUERY_KEYS.detail(variables.postId),
        (old) => (old ? { ...old, ...updatedPost } : undefined)
      );
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      options?.onSuccess?.(updatedPost, variables, context);
    },
    ...options,
  });
}

/**
 * 인기 게시글 목록을 가져오는 훅
 */
export function usePopularPosts(
  options?: Omit<UseQueryOptions<PostPopularResponse[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.popular(),
    queryFn: () => postService.getPopularPosts(),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

/**
 * 특정 태그의 게시물 목록을 조회하는 훅
 *
 * 태그별 게시글은 일반 게시글 목록과 동일한 캐싱 전략 적용
 */
export function usePostsByTag(
  tagName: string,
  params?: Pageable,
  options?: Omit<UseQueryOptions<PagedResponsePostListResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.postsByTag(tagName, params),
    queryFn: () => postService.getPostsByTag(tagName, params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!tagName,
    ...options,
  });
}

/**
 * 게시글 검색 훅
 */
export function useSearchPosts(
  keyword: string,
  params?: Pageable,
  options?: Omit<UseQueryOptions<PagedResponsePostListResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["posts", "search", keyword, params],
    queryFn: () => postService.searchPosts(keyword, params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!keyword,
    ...options,
  });
}

/**
 * 게시글 목록 프리페치 훅
 *
 * 사용자가 링크에 마우스를 올렸을 때 미리 데이터를 가져와서
 * 실제 페이지 이동시 즉시 표시할 수 있도록 합니다.
 */
export function usePrefetchPosts() {
  const queryClient = useQueryClient();

  const prefetchPosts = useCallback(
    (params?: Pageable) => {
      queryClient.prefetchQuery({
        queryKey: POST_QUERY_KEYS.list(params),
        queryFn: () => postService.getPosts(params),
        staleTime: 1000 * 60 * 5,
      });
    },
    [queryClient]
  );

  const prefetchPostsByTag = useCallback(
    (tagName: string, params?: Pageable) => {
      queryClient.prefetchQuery({
        queryKey: POST_QUERY_KEYS.postsByTag(tagName, params),
        queryFn: () => postService.getPostsByTag(tagName, params),
        staleTime: 1000 * 60 * 5,
      });
    },
    [queryClient]
  );

  const prefetchPost = useCallback(
    (postId: number) => {
      queryClient.prefetchQuery({
        queryKey: POST_QUERY_KEYS.detail(postId),
        queryFn: () => postService.getPostById(postId),
        staleTime: 1000 * 60 * 10,
      });
    },
    [queryClient]
  );

  return {
    prefetchPosts,
    prefetchPostsByTag,
    prefetchPost,
  };
}
