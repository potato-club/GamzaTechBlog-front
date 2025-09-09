/**
 * TanStack Query를 사용한 게시글 관련 API 훅들
 */

import { POST_TEXTS } from "@/constants/uiTexts";
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

// 뮤테이션 컨텍스트 타입 정의
interface CreatePostContext {
  previousPosts: Array<[readonly unknown[], unknown]>;
  tempPostId: number;
}

interface DeletePostContext {
  previousPosts: Array<[readonly unknown[], unknown]>;
}

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
    queryFn: () => postService.getPosts(params || { page: 0, size: 10 }),
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
 * 새 게시글을 생성하는 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useCreatePost(
  options?: UseMutationOptions<PostResponse, Error, PostRequest, CreatePostContext>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: PostRequest) => postService.createPost(postData),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (postData: PostRequest): Promise<CreatePostContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.lists() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousPosts = queryClient.getQueriesData({ queryKey: POST_QUERY_KEYS.lists() });

      // 임시 게시글 객체 생성
      const tempPostId = Date.now();
      const tempPost = {
        postId: tempPostId,
        title: postData.title,
        content: postData.content,
        tags: postData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nickname: POST_TEXTS.STATUS_WRITING, // 실제 사용자 정보는 서버에서 설정
        profileImageUrl: undefined,
        likeCount: 0,
        commentCount: 0,
      };

      // 모든 게시글 목록 쿼리에 대해 낙관적 업데이트 적용
      queryClient.setQueriesData(
        { queryKey: POST_QUERY_KEYS.lists() },
        (oldData: PagedResponsePostListResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: [tempPost, ...(oldData.content || [])],
            totalElements: (oldData.totalElements || 0) + 1,
          };
        }
      );

      return { previousPosts, tempPostId };
    },

    onSuccess: (newPost, variables, context) => {
      // 서버에서 받은 실제 데이터로 캐시 업데이트
      if (context?.tempPostId) {
        queryClient.setQueriesData(
          { queryKey: POST_QUERY_KEYS.lists() },
          (oldData: PagedResponsePostListResponse | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              content: oldData.content?.map((post) =>
                post.postId === context.tempPostId ? newPost : post
              ) || [newPost],
            };
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      options?.onSuccess?.(newPost, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
    },

    ...options,
  });
}

/**
 * 게시글 삭제 뮤테이션 (낙관적 업데이트 포함)
 */
export function useDeletePost(
  options?: UseMutationOptions<void, Error, number, DeletePostContext>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),

    // 낙관적 업데이트: 서버 응답 전에 UI에서 즉시 제거
    onMutate: async (postId: number): Promise<DeletePostContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.lists() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousPosts = queryClient.getQueriesData({ queryKey: POST_QUERY_KEYS.lists() });

      // 모든 게시글 목록 쿼리에서 해당 항목 제거
      queryClient.setQueriesData(
        { queryKey: POST_QUERY_KEYS.lists() },
        (oldData: PagedResponsePostListResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: oldData.content?.filter((post) => post.postId !== postId) || [],
            totalElements: Math.max((oldData.totalElements || 0) - 1, 0),
          };
        }
      );

      return { previousPosts };
    },

    onSuccess: (data, postId, context) => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      options?.onSuccess?.(data, postId, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, postId, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options?.onError?.(error, postId, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
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
    queryFn: () => postService.getPostsByTag(tagName, params || { page: 0, size: 10 }),
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
    queryFn: () => postService.searchPosts(keyword, params || { page: 0, size: 10 }),
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
        queryFn: () => postService.getPosts(params || { page: 0, size: 10 }),
        staleTime: 1000 * 60 * 5,
      });
    },
    [queryClient]
  );

  const prefetchPostsByTag = useCallback(
    (tagName: string, params?: Pageable) => {
      queryClient.prefetchQuery({
        queryKey: POST_QUERY_KEYS.postsByTag(tagName, params),
        queryFn: () => postService.getPostsByTag(tagName, params || { page: 0, size: 10 }),
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
