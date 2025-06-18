"use client";

/**
 * 마이페이지 관련 TanStack Query 훅 모음
 * 
 * 마이페이지에서 필요한 사용자의 게시글, 댓글, 좋아요 데이터를 
 * TanStack Query를 통해 효율적으로 관리합니다.
 */

import { CommentData } from "@/types/comment";
import { PostData } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

/**
 * 사용자가 작성한 게시글 목록을 가져오는 훅
 * 
 * 이 훅은 TanStack Query의 useQuery를 사용하여:
 * - 사용자의 게시글 목록을 자동 캐싱
 * - 백그라운드에서 자동 갱신
 * - 로딩/에러 상태 자동 관리
 * - 다른 컴포넌트와 데이터 공유
 * 
 * @returns {object} 쿼리 결과 객체 (data, isLoading, error 등)
 */
export function useMyPosts() {
  return useQuery({
    queryKey: ["my-posts"], // 캐시 키: 사용자의 게시글 목록
    queryFn: async (): Promise<PostData[]> => {
      // 실제 API 호출 (현재는 목업 데이터 반환)
      // TODO: 실제 서비스 함수로 교체
      // return await userService.getMyPosts();

      // 임시 목업 데이터
      return [
        {
          postId: 1,
          title: "제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다",
          contentSnippet: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima aperiam animi libero quae sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!",
          writer: "GyeongHwan Lee",
          createdAt: "2025-06-12T03:34:18.808237",
          tags: ["# java", "# spring", "# backend"],
        },
        {
          postId: 2,
          title: "Next.js로 무한스크롤 구현하기",
          contentSnippet: "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
          writer: "Jinwoo Park",
          createdAt: "2025-04-27T00:00:00.000Z",
          tags: ["# nextjs", "# react", "# frontend"],
        },
      ] as PostData[];
    },
    staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하다고 간주
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
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
export function useMyComments() {
  return useQuery({
    queryKey: ["my-comments"], // 캐시 키: 사용자의 댓글 목록
    queryFn: async (): Promise<CommentData[]> => {
      // 실제 API 호출 (현재는 목업 데이터 반환)
      // TODO: 실제 서비스 함수로 교체
      // return await userService.getMyComments();

      // 임시 목업 데이터
      return [
        {
          commentId: 1,
          writer: "GyeongHwan Lee",
          content: "첫 댓글 달아봤습니다 하하.",
          createdAt: "2025-04-28T00:00:00.000Z",
          replies: ["첫 번째 답글입니다!", "두 번째 답글입니다!"],
        },
        {
          commentId: 2,
          writer: "Jinwoo Park",
          content: "좋은 글 감사합니다! Next.js에 대해 더 배우고 싶어요.",
          createdAt: "2025-04-27T00:00:00.000Z",
          replies: ["세 번째 답글입니다!", "네 번째 답글입니다!"],
        },
      ] as CommentData[];
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
export function useMyLikes() {
  return useQuery({
    queryKey: ["my-likes"], // 캐시 키: 사용자의 좋아요 목록
    queryFn: async () => {
      // 실제 API 호출 (현재는 목업 데이터 반환)
      // TODO: 실제 서비스 함수로 교체
      // return await userService.getMyLikes();

      // 임시 목업 데이터
      return [
        {
          id: 1,
          title: "좋아요 누른 게시글 제목",
          contentSnippet: "와우 좋아요 누른 게시글 내용이에용용",
          writer: "GyeongHwan Lee",
          createdAt: "2025-04-27T00:00:00.000Z",
          tags: ["# java", "# spring", "# backend"],
        },
        {
          id: 2,
          title: "Next.js로 무한스크롤 구현하기",
          contentSnippet: "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
          writer: "Jinwoo Park",
          createdAt: "2025-04-27T00:00:00.000Z",
          tags: ["# nextjs", "# react", "# frontend"],
        },
      ];
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
