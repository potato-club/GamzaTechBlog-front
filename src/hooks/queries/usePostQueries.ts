/**
 * TanStack Query를 사용한 게시글 관련 API 훅들
 */

import {
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
} from '@/generated/api';
import { postService } from '@/services/postService';
import { PageableContent, PaginationParams } from '@/types/api';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

// 게시글 관련 Query Key 팩토리
export const POST_QUERY_KEYS = {
  all: ['posts'] as const,
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (params?: PaginationParams) => [...POST_QUERY_KEYS.lists(), params] as const,
  popular: () => [...POST_QUERY_KEYS.all, 'popular'] as const,
  details: () => [...POST_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
  tags: () => [...POST_QUERY_KEYS.all, 'tags'] as const,
  postsByTag: (tagName: string, params?: PaginationParams) =>
    [...POST_QUERY_KEYS.all, 'byTag', tagName, params] as const,
} as const;

/**
 * 게시글 목록을 조회하는 훅 (페이지네이션)
 */
export function usePosts(
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostResponse>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(params),
    queryFn: () => postService.getPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
}

/**
 * 무한 스크롤을 위한 게시글 목록 조회 훅
 */
export function useInfinitePosts(params?: { size?: number; sort?: string[] }) {
  return useInfiniteQuery({
    queryKey: [...POST_QUERY_KEYS.lists(), { ...params, infinite: true }],
    queryFn: ({ pageParam = 0 }) =>
      postService.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 특정 게시글의 상세 정보를 조회하는 훅
 */
export function usePost(
  postId: number,
  options?: Omit<UseQueryOptions<PostDetailResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(postId),
    queryFn: () => postService.getPostById(postId),
    staleTime: 1000 * 60 * 5,
    enabled: !!postId && postId > 0,
    ...options,
  });
}

/**
 * 사용 가능한 태그 목록을 조회하는 훅
 */
export function useTags(options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>) {
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
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });

      if (newPost.postId) {
        const detailData: PostDetailResponse = {
          ...newPost,
          writer: newPost.authorGithubId,
          comments: [],
        };
        queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.postId), detailData);
      }
      options?.onSuccess?.(newPost, variables, context);
    },
    ...options,
  });
}

/**
 * 게시글 좋아요 토글 뮤테이션 (Optimistic Update)
 */
export function useLikePost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      // TODO: 실제 좋아요 API 연동 필요
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, liked: !isLiked };
    },
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      const previousPost = queryClient.getQueryData<PostDetailResponse>(POST_QUERY_KEYS.detail(postId));

      queryClient.setQueryData<PostDetailResponse | undefined>(
        POST_QUERY_KEYS.detail(postId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            isLiked: !isLiked,
            likesCount: isLiked ? (old.likesCount ?? 1) - 1 : (old.likesCount ?? 0) + 1,
          };
        }
      );
      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: ['my-likes'] });
    },
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
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
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
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      options?.onSuccess?.(updatedPost, variables, context);
    },
    ...options,
  });
}

/**
 * 인기 게시글 목록을 가져오는 훅
 */
export function usePopularPosts(
  options?: Omit<UseQueryOptions<PostPopularResponse[], Error>, 'queryKey' | 'queryFn'>
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
 */
export function usePostsByTag(
  tagName: string,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostResponse>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.postsByTag(tagName, params),
    queryFn: () => postService.getPostsByTag(tagName, params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!tagName,
    ...options,
  });
}

/**
 * 게시글 검색 훅
 */
export function useSearchPosts(
  keyword: string,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostResponse>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['posts', 'search', keyword, params],
    queryFn: () => postService.searchPosts(keyword, params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!keyword,
    ...options,
  });
}
