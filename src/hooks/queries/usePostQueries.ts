/**
 * TanStack Query를 사용한 게시글 관련 API 훅들
 * 
 * 게시글 목록 조회, 상세보기, 생성, 태그 조회 등의 기능을 
 * TanStack Query로 구현하여 효율적인 캐싱과 상태 관리를 제공합니다.
 * 
 * postService와 완전히 연동되어 Next.js fetch 캐싱 대신 
 * TanStack Query의 클라이언트 캐싱을 활용합니다.
 */

import { createMockApiResponse, mockPosts, shouldUseMockData } from '@/mock/mockData';
import { postService } from '@/services/postService';
import { PageableContent, PaginationParams } from '@/types/api';
import { PostDetailData } from '@/types/comment';
import { CreatePostRequest, CreatePostResponse, PostData, UpdatePostRequest } from '@/types/post';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';


// 게시글 관련 Query Key 팩토리 - 일관된 쿼리 키 관리
export const POST_QUERY_KEYS = {
  // 모든 게시글 관련 쿼리의 상위 키
  all: ['posts'] as const,

  // 게시글 목록 쿼리 키 (페이지네이션, 필터링 포함)
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (params?: PaginationParams) => [...POST_QUERY_KEYS.lists(), params] as const,

  // 인기 게시글 쿼리 키
  popular: () => [...POST_QUERY_KEYS.all, 'popular'] as const,

  // 게시글 상세 쿼리 키
  details: () => [...POST_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,

  // 태그 관련 쿼리 키
  tags: () => [...POST_QUERY_KEYS.all, 'tags'] as const,

  // 태그별 게시물 쿼리 키
  postsByTag: (tagName: string, params?: PaginationParams) =>
    [...POST_QUERY_KEYS.all, 'byTag', tagName, params] as const,
} as const;

/**
 * 게시글 목록을 조회하는 훅 (기본 페이지네이션)
 * TanStack Query를 통해 캐싱, 백그라운드 업데이트, 에러 처리를 자동화합니다.
 * 
 * @param params - 페이지네이션, 정렬 매개변수
 * @param options - TanStack Query 옵션
 */
export function usePosts(
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostData>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(params),
    queryFn: () => {
      // 목 데이터 사용 여부 확인
      if (shouldUseMockData()) {
        const mockResponse: PageableContent<PostData> = {
          content: mockPosts,
          page: params?.page || 0,
          size: params?.size || 10,
          totalElements: mockPosts.length,
          totalPages: 1
        };
        return createMockApiResponse(mockResponse);
      }
      return postService.getPosts(params);
    },

    // placeholderData: 새로운 페이지 로딩 중에도 이전 데이터를 표시
    // 이렇게 하면 페이지 전환 시 깜빡임 없이 부드러운 UX를 제공합니다
    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 무한 스크롤을 위한 게시글 목록 조회 훅
 * 
 * useInfiniteQuery는 페이지네이션 데이터를 무한 스크롤로 처리할 때 사용합니다.
 * 다음 페이지를 자동으로 로드하고 기존 데이터에 추가하는 기능을 제공합니다.
 */
export function useInfinitePosts(params?: {
  size?: number;
  sort?: string[];
}) {
  return useInfiniteQuery({
    queryKey: [...POST_QUERY_KEYS.lists(), { ...params, infinite: true }],

    // queryFn에서 pageParam을 받아 해당 페이지의 데이터를 가져옵니다
    queryFn: ({ pageParam = 0 }) =>
      postService.getPosts({
        ...params,
        page: pageParam,
        size: params?.size || 10
      }),

    // getNextPageParam: 다음 페이지가 있는지 확인하는 함수
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지인지 확인 (더 이상 데이터가 없으면 undefined 반환)
      const isLastPage = lastPage.page >= lastPage.totalPages - 1;
      return isLastPage ? undefined : lastPage.page + 1;
    },

    // initialPageParam: 첫 페이지 번호
    initialPageParam: 0,

    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 게시글의 상세 정보를 조회하는 훅
 * TanStack Query를 통해 캐싱, 백그라운드 업데이트, 에러 처리를 자동화합니다.
 * 
 * @param postId - 조회할 게시글 ID
 * @param options - TanStack Query 옵션
 */
export function usePost(
  postId: number,
  options?: Omit<UseQueryOptions<PostDetailData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(postId),
    queryFn: () => postService.getPostById(postId),

    // 게시글 상세 데이터를 더 적극적으로 페칭하도록 설정
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지 (기존 10분에서 단축)
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    retry: 3, // 재시도 횟수 증가 (2 -> 3)
    refetchOnWindowFocus: true, // 윈도우 포커스 시 재페칭 활성화
    refetchOnMount: true, // 마운트 시 재페칭 활성화

    // enabled: postId가 유효할 때만 쿼리 실행
    enabled: !!postId && postId > 0,
    ...options,
  });
}

/**
 * 사용 가능한 태그 목록을 조회하는 훅
 * 태그는 자주 변경되지 않으므로 긴 캐시 시간으로 설정합니다.
 * 
 * @param options - TanStack Query 옵션
 */
export function useTags(
  options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.tags(),
    queryFn: () => postService.getTags(),

    // 태그는 거의 변하지 않으므로 매우 긴 캐시 시간 설정
    staleTime: 1000 * 60 * 30, // 30분간 fresh 상태 유지
    gcTime: 1000 * 60 * 60, // 1시간간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 새 게시글을 생성하는 뮤테이션 훅
 * 성공 시 관련 쿼리 무효화를 통해 최신 데이터로 갱신합니다.
 * 
 * @param options - TanStack Query 뮤테이션 옵션
 */
export function useCreatePost(
  options?: UseMutationOptions<CreatePostResponse, Error, CreatePostRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => postService.createPost(postData),

    onSuccess: (newPost: CreatePostResponse, variables, context) => {      // 새 게시글 생성 성공 시 게시글 목록 캐시를 무효화
      // 이렇게 하면 목록 페이지에서 자동으로 최신 데이터를 다시 가져옵니다
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.lists()
      });

      // 마이페이지의 사용자 게시글 목록도 무효화
      queryClient.invalidateQueries({
        queryKey: ['my-posts']
      });

      // 새로 생성된 게시글을 상세 페이지 캐시에 미리 저장
      // 사용자가 상세 페이지로 이동할 때 별도 요청 없이 즉시 표시됩니다
      if (newPost.postId) {
        queryClient.setQueryData(
          POST_QUERY_KEYS.detail(newPost.postId),
          newPost
        );
      }

      console.log('게시글 생성 성공 - 관련 캐시가 갱신되었습니다');

      // 사용자 정의 성공 콜백 실행
      options?.onSuccess?.(newPost, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('게시글 생성 실패:', error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 게시글 좋아요 토글 뮤테이션
 * 
 * 이 훅은 TanStack Query의 useMutation을 사용하여:
 * - 좋아요 추가/취소를 서버에 요청
 * - Optimistic Update로 즉시 UI 반영
 * - 실패 시 이전 상태로 자동 롤백
 * - 관련 쿼리 자동 무효화
 * 
 * @param postId 좋아요를 토글할 게시글 ID
 * @returns 뮤테이션 객체 (mutate, isPending, error 등)
 */
export function useLikePost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      // TODO: 실제 좋아요 API 호출 구현 필요
      // if (isLiked) {
      //   return await postService.unlikePost(postId);
      // } else {
      //   return await postService.likePost(postId);
      // }

      // 임시 구현: 0.5초 지연 후 성공 응답
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, liked: !isLiked };
    },

    // Optimistic Update: 서버 응답 전에 UI를 먼저 업데이트
    onMutate: async (isLiked: boolean) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });

      // 이전 상태 백업 (롤백용)
      const previousPost = queryClient.getQueryData(POST_QUERY_KEYS.detail(postId));

      // Optimistic Update 적용
      queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !isLiked,
          likeCount: isLiked ? old.likeCount - 1 : old.likeCount + 1
        };
      });

      return { previousPost };
    },

    // 에러 발생 시 이전 상태로 롤백
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }
    },

    // 성공 또는 실패 후 관련 쿼리 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["my-likes"] }); // 마이페이지 좋아요 목록 갱신
    },
  });
}

export function useDeletePost(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),

    onSuccess: (data, variables, context) => {
      // 게시글 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(variables) });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });

      console.log('게시글 삭제 성공 - 관련 캐시가 갱신되었습니다');

      // 사용자 정의 성공 콜백 실행
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('게시글 삭제 실패:', error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 게시글 수정 뮤테이션
 * 
 * TanStack Query의 useMutation을 사용하여:
 * - 게시글 수정을 서버에 요청
 * - 성공 시 관련 캐시 자동 무효화
 * - 에러 처리 및 사용자 피드백
 * 
 * @param options - TanStack Query 뮤테이션 옵션
 */
export function useUpdatePost(
  options?: UseMutationOptions<CreatePostResponse, Error, { postId: number; data: UpdatePostRequest; }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostRequest; }) =>
      postService.updatePost(postId, data),

    onSuccess: (updatedPost: CreatePostResponse, variables, context) => {
      // 수정된 게시글의 상세 페이지 캐시 업데이트
      queryClient.setQueryData(
        POST_QUERY_KEYS.detail(variables.postId),
        updatedPost
      );

      // 게시글 목록 캐시를 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.lists()
      });

      // 마이페이지의 사용자 게시글 목록도 무효화
      queryClient.invalidateQueries({
        queryKey: ['my-posts']
      });

      console.log('게시글 수정 성공 - 관련 캐시가 갱신되었습니다');

      // 사용자 정의 성공 콜백 실행
      options?.onSuccess?.(updatedPost, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('게시글 수정 실패:', error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 여러 쿼리를 무효화하는 유틸리티 함수들
 * 게시글 생성/수정/삭제 후 관련 캐시 갱신에 사용합니다.
 */
export function useInvalidatePostQueries() {
  const queryClient = useQueryClient();

  return {
    /**
     * 모든 게시글 관련 쿼리 무효화
     */
    invalidateAllPosts: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.all });
    },

    /**
     * 게시글 목록 쿼리들 무효화
     */
    invalidatePostLists: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() });
    },

    /**
     * 사용자 게시글 목록 무효화
     */
    invalidateUserPosts: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
    },

    /**
     * 특정 게시글 상세 무효화
     */
    invalidatePost: (postId: number) => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
    },

    /**
     * 태그 목록 무효화
     */
    invalidateTags: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.tags() });
    },
  };
}

/**
 * 인기 게시글 목록을 가져오는 훅
 * 
 * 이 훅은 TanStack Query의 useQuery를 사용하여:
 * - 인기 게시글 목록을 자동 캐싱
 * - 백그라운드에서 자동 갱신
 * - 로딩/에러 상태 자동 관리
 * - 메인 사이드바에서 표시
 * 
 * @returns {object} 쿼리 결과 객체 (data, isLoading, error 등)
 */
export function usePopularPosts() {
  return useQuery({
    queryKey: POST_QUERY_KEYS.popular(), // 일관된 캐시 키 사용
    queryFn: () => postService.getPopularPosts(), // 실제 API 호출

    // 인기 게시글은 자주 변하므로 적당한 캐시 시간 설정
    staleTime: 1000 * 60 * 10, // 10분간 데이터를 신선하다고 간주
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 태그의 게시물 목록을 조회하는 훅
 * 
 * @param tagName - 조회할 태그명
 * @param params - 페이지네이션, 정렬 매개변수
 * @param options - TanStack Query 옵션
 */
export function usePostsByTag(
  tagName: string,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostData>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POST_QUERY_KEYS.postsByTag(tagName, params),
    queryFn: () => postService.getPostsByTag(tagName, params),

    // placeholderData: 새로운 페이지 로딩 중에도 이전 데이터를 표시
    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!tagName, // tagName이 있을 때만 쿼리 실행
    ...options,
  });
}
