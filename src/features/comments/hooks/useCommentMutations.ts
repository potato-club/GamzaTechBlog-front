/**
 * 댓글 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 댓글 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useCommentQueries.ts (또는 해당 read 훅)에서 처리합니다.
 */

import type { CommentRequest, CommentResponse, PostDetailResponse } from "@/generated/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { ActionResult } from "@/lib/actionResult";
import { POST_QUERY_KEYS } from "../../posts/hooks/usePostQueries";
import { createCommentAction, deleteCommentAction } from "../actions/commentActions";

/**
 * 댓글을 등록하는 뮤테이션 훅
 *
 * 서버 액션 완료 후 캐시를 무효화하여 최신 상태를 유지합니다.
 *
 * @param postId - 댓글을 작성할 게시글의 ID
 * @param options - React Query mutation 옵션
 */
export function useCreateComment(
  postId: number,
  options?: UseMutationOptions<ActionResult<CommentResponse>, Error, CommentRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (commentRequest: CommentRequest) =>
      createCommentAction(postId, commentRequest),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      }

      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("댓글 등록 실패:", error);
      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * 댓글을 삭제하는 뮤테이션 훅
 *
 * 서버 액션 완료 후 캐시를 무효화하여 최신 상태를 유지합니다.
 *
 * @param postId - 댓글이 속한 게시글의 ID
 * @param options - React Query mutation 옵션
 */
export function useDeleteComment(
  postId: number,
  options?: UseMutationOptions<ActionResult<void>, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteCommentAction(postId, commentId),

    onSuccess: (result, commentId, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
      }

      options?.onSuccess?.(result, commentId, context);
    },

    onError: (error, commentId, context) => {
      console.error("댓글 삭제 실패:", error);
      options?.onError?.(error, commentId, context);
    },
  });
}

/**
 * 댓글 관련 캐시를 수동으로 관리하는 유틸리티 훅
 *
 * 특수한 경우에 캐시를 직접 조작해야 할 때 사용합니다.
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
