/**
 * 좋아요 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 좋아요 데이터 변경 (쓰기 전용)
 * 읽기 작업은 RSC에서 초기 상태를 전달합니다.
 */

import { useActionMutation, type ActionMutationOptions } from "@/lib/useActionMutation";
import { addLikeAction, removeLikeAction } from "../actions/likeActions";
import type { ActionResult } from "@/lib/actionResult";

/**
 * 좋아요 추가 뮤테이션 훅
 *
 * @param postId - 좋아요를 추가할 게시글 ID
 * @param options - 성공/실패 콜백 옵션
 */
export function useAddLike(
  postId: number,
  options?: ActionMutationOptions<ActionResult<void>, void>
) {
  return useActionMutation(() => addLikeAction(postId), {
    onSuccess: (result, variables) => {
      options?.onSuccess?.(result, variables);
    },
    onError: (error, variables) => {
      console.error("좋아요 추가 실패:", error);
      options?.onError?.(error, variables);
    },
    onSettled: (data, error, variables) => {
      options?.onSettled?.(data, error, variables);
    },
  });
}

/**
 * 좋아요 취소 뮤테이션 훅
 *
 * @param postId - 좋아요를 취소할 게시글 ID
 * @param options - 성공/실패 콜백 옵션
 */
export function useRemoveLike(
  postId: number,
  options?: ActionMutationOptions<ActionResult<void>, void>
) {
  return useActionMutation(() => removeLikeAction(postId), {
    onSuccess: (result, variables) => {
      options?.onSuccess?.(result, variables);
    },
    onError: (error, variables) => {
      console.error("좋아요 취소 실패:", error);
      options?.onError?.(error, variables);
    },
    onSettled: (data, error, variables) => {
      options?.onSettled?.(data, error, variables);
    },
  });
}
