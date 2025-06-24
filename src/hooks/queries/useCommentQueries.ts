/**
 * TanStack Query를 사용한 댓글 관련 API 훅들
 * 
 * 댓글 등록, 수정, 삭제 등의 기능을 TanStack Query로 구현하여
 * 효율적인 상태 관리와 UI 업데이트를 제공합니다.
 */

import { commentService } from '@/services/commentService';
import { CommentData, CommentRequest } from '@/types/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from './usePostQueries';

// 댓글 관련 Query Key 상수들
export const COMMENT_QUERY_KEYS = {
  // 모든 댓글 관련 쿼리의 상위 키
  all: ['comments'] as const,

  // 특정 게시글의 댓글들
  byPost: (postId: number) => [...COMMENT_QUERY_KEYS.all, 'post', postId] as const,
} as const;

/**
 * 댓글을 등록하는 뮤테이션 훅
 * 
 * @param postId - 댓글을 작성할 게시글의 ID
 */
export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: 댓글 등록 API 호출
    mutationFn: (commentRequest: CommentRequest) =>
      commentService.registerComment(postId, commentRequest),

    // onMutate: 뮤테이션이 시작되기 전에 실행 (Optimistic Update 가능)
    // Optimistic Update는 서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 기법입니다
    onMutate: async (newComment) => {
      // 해당 게시글의 기존 캐시 쿼리들을 취소하여 충돌 방지
      await queryClient.cancelQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });

      // 이전 데이터를 백업 (실패 시 롤백용)
      const previousPost = queryClient.getQueryData(POST_QUERY_KEYS.detail(postId));

      // Optimistic Update: 서버 응답 전에 UI에 새 댓글을 미리 표시
      queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), (old: any) => {
        if (!old) return old;

        const optimisticComment: CommentData = {
          commentId: Date.now(), // 임시 ID (서버에서 실제 ID를 받으면 교체됨)
          writer: '현재 사용자', // 실제로는 현재 로그인한 사용자 정보 사용
          content: newComment.content,
          createdAt: new Date().toLocaleDateString('ko-KR'),
          replies: [],
        };

        return {
          ...old,
          comments: [...old.comments, optimisticComment],
        };
      });

      // 롤백을 위해 이전 데이터 반환
      return { previousPost };
    },

    // onSuccess: 댓글 등록 성공 시 실행
    onSuccess: (newComment: CommentData) => {
      // 성공 시 해당 게시글의 데이터를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });

      console.log('댓글 등록 성공:', newComment);
    },

    // onError: 댓글 등록 실패 시 실행
    onError: (error, newComment, context) => {
      // 실패 시 이전 데이터로 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }

      console.error('댓글 등록 실패:', error);
    },

    // onSettled: 성공/실패 관계없이 뮤테이션 완료 후 실행
    onSettled: () => {
      // 최종적으로 해당 게시글 데이터를 다시 가져와서 동기화
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });
    },
  });
}

/**
 * 댓글을 삭제하는 뮤테이션 훅
 * 
 * @param postId - 댓글이 속한 게시글의 ID
 */
export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),

    // Optimistic Update: 삭제 전에 UI에서 미리 제거
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });

      const previousPost = queryClient.getQueryData(POST_QUERY_KEYS.detail(postId));

      // UI에서 해당 댓글을 미리 제거
      queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), (old: any) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.filter((comment: CommentData) =>
            comment.commentId !== commentId
          ),
        };
      });

      return { previousPost };
    },

    onSuccess: (_, commentId) => {
      console.log('댓글 삭제 성공:', commentId);

      // 성공 시 게시글 데이터 갱신
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });
    },

    onError: (error, commentId, context) => {
      // 실패 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }

      console.error('댓글 삭제 실패:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.detail(postId)
      });
    },
  });
}

/**
 * 댓글 관련 캐시를 수동으로 관리하는 유틸리티 훅
 */
export function useCommentUtils(postId: number) {
  const queryClient = useQueryClient();

  // 특정 게시글의 댓글 캐시 무효화
  const invalidateComments = () => {
    queryClient.invalidateQueries({
      queryKey: POST_QUERY_KEYS.detail(postId)
    });
  };

  // 댓글을 수동으로 캐시에 추가 (예: 실시간 업데이트 시)
  const addCommentToCache = (newComment: CommentData) => {
    queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), (old: any) => {
      if (!old) return old;

      return {
        ...old,
        comments: [...old.comments, newComment],
      };
    });
  };

  // 댓글을 수동으로 캐시에서 제거
  const removeCommentFromCache = (commentId: number) => {
    queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), (old: any) => {
      if (!old) return old;

      return {
        ...old,
        comments: old.comments.filter((comment: CommentData) =>
          comment.commentId !== commentId
        ),
      };
    });
  };

  return {
    invalidateComments,
    addCommentToCache,
    removeCommentFromCache,
  };
}
