/**
 * 댓글 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 댓글 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useCommentQueries.ts (또는 해당 read 훅)에서 처리합니다.
 */

import type { CommentRequest, CommentResponse } from "@/generated/api";
import type { ActionResult } from "@/lib/actionResult";
import { useActionMutation, type ActionMutationOptions } from "@/lib/useActionMutation";
import { createCommentAction, deleteCommentAction } from "../actions/commentActions";

/**
 * 댓글을 등록하는 뮤테이션 훅
 *
 * @param postId - 댓글을 작성할 게시글의 ID
 * @param options - 성공/실패 콜백 옵션
 */
export function useCreateComment(
  postId: number,
  options?: ActionMutationOptions<ActionResult<CommentResponse>, CommentRequest>
) {
  return useActionMutation<ActionResult<CommentResponse>, CommentRequest>(
    (commentRequest) => createCommentAction(postId, commentRequest),
    {
      onSuccess: (result, variables) => {
        options?.onSuccess?.(result, variables);
      },
      onError: (error, variables) => {
        console.error("댓글 등록 실패:", error);
        options?.onError?.(error, variables);
      },
      onSettled: (data, error, variables) => {
        options?.onSettled?.(data, error, variables);
      },
    }
  );
}

/**
 * 댓글을 삭제하는 뮤테이션 훅
 *
 * @param postId - 댓글이 속한 게시글의 ID
 * @param options - 성공/실패 콜백 옵션
 */
export function useDeleteComment(
  postId: number,
  options?: ActionMutationOptions<ActionResult<void>, number>
) {
  return useActionMutation<ActionResult<void>, number>(
    (commentId) => deleteCommentAction(postId, commentId),
    {
      onSuccess: (result, commentId) => {
        options?.onSuccess?.(result, commentId);
      },
      onError: (error, commentId) => {
        console.error("댓글 삭제 실패:", error);
        options?.onError?.(error, commentId);
      },
      onSettled: (data, error, commentId) => {
        options?.onSettled?.(data, error, commentId);
      },
    }
  );
}
