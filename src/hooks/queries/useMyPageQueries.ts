"use client";

/**
 * 마이페이지 관련 TanStack Query 훅 모음
 * 
 * 마이페이지에서 필요한 사용자의 게시글, 댓글, 좋아요 데이터를 
 * TanStack Query를 통해 효율적으로 관리합니다.
 */

import { createMockApiResponse, mockLikes, mockMyComments, mockPosts, shouldUseMockData } from "@/mock/mockData";
import { postService } from "@/services/postService";
import { PageableContent, PaginationParams } from "@/types/api";
import { PostData } from "@/types/post";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { commentService } from "../../services/commentService";

/**
 * 사용자가 작성한 게시글 목록을 조회하는 훅
 * 인증이 필요한 사용자별 게시글 조회 기능입니다.
 * 
 * @param params - 페이지네이션 및 정렬 파라미터
 * @param options - TanStack Query 옵션
 */
export function useMyPosts(
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PageableContent<PostData>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ["my-posts", params], // 캐시 키: 사용자의 게시글 목록
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
      return postService.getUserPosts(params);
    },

    staleTime: 1000 * 60 * 2, // 2분간 fresh 상태 유지 (사용자 데이터는 더 자주 갱신)
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * 사용자가 작성한 댓글 목록을 가져오는 훅
 * 
 * 이 훅은 TanStack Query의 useQuery를 사용하여:
 * - 사용자의 댓글 목록을 자동 캐싱
 * - 백그라운드에서 자동 갱신
 * - 로딩/에러 상태 자동 관리
 * - 댓글 추가/삭제 시 자동 무효화 가능
 * 
 * @returns {object} 쿼리 결과 객체 (data, isLoading, error 등)
 */
export function useMyComments(
  params?: PaginationParams,
) {
  return useQuery({
    queryKey: ["my-comments", params], // 캐시 키에 params 포함하여 페이지 변경 감지
    queryFn: () => {
      // 목 데이터 사용 여부 확인
      if (shouldUseMockData()) {
        const mockResponse = {
          content: mockMyComments,
          page: params?.page || 0,
          size: params?.size || 10,
          totalElements: mockMyComments.length,
          totalPages: 1
        };
        return createMockApiResponse(mockResponse);
      }
      return commentService.getUserComments(params);
    },

    staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하다고 간주
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
}

/**
 * 사용자가 좋아요한 게시글 목록을 가져오는 훅
 * 
 * 이 훅은 TanStack Query의 useQuery를 사용하여:
 * - 사용자의 좋아요 목록을 자동 캐싱
 * - 백그라운드에서 자동 갱신  
 * - 로딩/에러 상태 자동 관리
 * - 좋아요 추가/취소 시 자동 무효화 가능
 * 
 * @returns {object} 쿼리 결과 객체 (data, isLoading, error 등)
 */
export function useMyLikes(params?: PaginationParams) {
  return useQuery({
    queryKey: ["my-likes", params], // 캐시 키: 사용자의 좋아요 목록
    queryFn: () => {
      // 목 데이터 사용 여부 확인
      if (shouldUseMockData()) {
        const mockResponse = {
          content: mockLikes,
          page: params?.page || 0,
          size: params?.size || 10,
          totalElements: mockLikes.length,
          totalPages: 1
        };
        return createMockApiResponse(mockResponse);
      }
      return postService.getUserLikes(params);
    },

    staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하다고 간주
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
}

/**
 * 마이페이지 모든 데이터를 한 번에 가져오는 복합 훅
 * 
 * 이 훅은 여러 쿼리를 병렬로 실행하여:
 * - 게시글, 댓글, 좋아요 데이터를 동시에 로드
 * - 각각의 로딩/에러 상태를 개별 관리
 * - 전체 로딩 상태와 각 섹션 상태를 모두 제공
 * 
 * @returns {object} 모든 마이페이지 데이터와 상태
 */
export function useMyPageData() {
  const postsQuery = useMyPosts();
  const commentsQuery = useMyComments();
  const likesQuery = useMyLikes();

  return {
    // 각 섹션 데이터
    posts: postsQuery.data || [],
    comments: commentsQuery.data || [],
    likes: likesQuery.data || [],

    // 개별 로딩 상태
    isLoadingPosts: postsQuery.isLoading,
    isLoadingComments: commentsQuery.isLoading,
    isLoadingLikes: likesQuery.isLoading,

    // 전체 로딩 상태 (모든 쿼리가 로딩 중인지)
    isLoading: postsQuery.isLoading || commentsQuery.isLoading || likesQuery.isLoading,

    // 개별 에러 상태
    postsError: postsQuery.error,
    commentsError: commentsQuery.error,
    likesError: likesQuery.error,

    // 전체 에러 상태 (하나라도 에러가 있는지)
    hasError: !!postsQuery.error || !!commentsQuery.error || !!likesQuery.error,

    // 개별 쿼리 객체 (필요 시 직접 접근 가능)
    postsQuery,
    commentsQuery,
    likesQuery,
  };
}
