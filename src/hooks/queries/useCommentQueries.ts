/**
 * TanStack Query를 사용한 댓글 관련 API 훅들
 * 
 * 댓글 등록, 수정, 삭제 등의 기능을 TanStack Query로 구현하여
 * 효율적인 상태 관리와 UI 업데이트를 제공합니다.
 */

import { commentService } from '@/services/commentService';
import type { CommentRequest, CommentResponse, PostDetailResponse } from '@/generated/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from './usePostQueries';

/**
 * 댓글을 등록하는 뮤테이션 훅
 * 
 * @param postId - 댓글을 작성할 게시글의 ID
 */
export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentRequest: CommentRequest) =>
      commentService.registerComment(postId, commentRequest),

    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });

      const previousPost = queryClient.getQueryData<PostDetailResponse>(POST_QUERY_KEYS.detail(postId));

      queryClient.setQueryData<PostDetailResponse | undefined>(
        POST_QUERY_KEYS.detail(postId),
        (old) => {
          if (!old) return old;

          // Optimistic Update를 위한 임시 댓글 객체 생성
          const optimisticComment: CommentResponse = {
            commentId: Date.now(), // 임시 ID
            writer: 'Me', // 실제로는 로그인 유저 정보로 대체 필요
            writerProfileImageUrl: '', // 실제로는 로그인 유저 정보로 대체 필요
            content: newComment.content,
            createdAt: new Date(), // 현재 시간으로 설정
          };

          return {
            ...old,
            comments: [...(old.comments || []), optimisticComment],
          };
        }
      );

      return { previousPost };
    },

    onSuccess: (newComment: CommentResponse) => {
      // 성공 시에는 서버로부터 받은 실제 데이터로 캐시를 무효화하여 갱신
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      console.log('댓글 등록 성공:', newComment);
    },

    onError: (error, newComment, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }
      console.error('댓글 등록 실패:', error);
    },

    onSettled: () => {
      // 최종적으로 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
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

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });

      const previousPost = queryClient.getQueryData<PostDetailResponse>(POST_QUERY_KEYS.detail(postId));

      queryClient.setQueryData<PostDetailResponse | undefined>(
        POST_QUERY_KEYS.detail(postId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            comments: old.comments?.filter((comment) => comment.commentId !== commentId),
          };
        }
      );

      return { previousPost };
    },

    onSuccess: (_, commentId) => {
      console.log('댓글 삭제 성공:', commentId);
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
    },

    onError: (error, commentId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(POST_QUERY_KEYS.detail(postId), context.previousPost);
      }
      console.error('댓글 삭제 실패:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
    },
  });
}

/**
 * 댓글 관련 캐시를 수동으로 관리하는 유틸리티 훅
 */
export function useCommentUtils(postId: number) {
  const queryClient = useQueryClient();

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
  };

  const addCommentToCache = (newComment: CommentResponse) => {
    queryClient.setQueryData<PostDetailResponse | undefined>(
      POST_QUERY_KEYS.detail(postId),
      (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: [...(old.comments || []), newComment],
        };
      }
    );
  };

  const removeCommentFromCache = (commentId: number) => {
    queryClient.setQueryData<PostDetailResponse | undefined>(
      POST_QUERY_KEYS.detail(postId),
      (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments?.filter((comment) => comment.commentId !== commentId),
        };
      }
    );
  };

  return {
    invalidateComments,
    addCommentToCache,
    removeCommentFromCache,
  };
}
