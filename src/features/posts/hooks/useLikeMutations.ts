/**
 * 좋아요 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 좋아요 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useLikeQueries.ts 참조
 */

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { addLikeAction, removeLikeAction } from "../actions/likeActions";
import { LIKE_QUERY_KEYS } from "./useLikeQueries";
import { POST_QUERY_KEYS } from "./usePostQueries";
import type { ActionResult } from "@/lib/actionResult";

/**
 * 좋아요 추가 뮤테이션 훅
 *
 * 서버 액션 완료 후 관련 캐시를 무효화합니다.
 *
 * @param postId - 좋아요를 추가할 게시글 ID
 * @param options - React Query mutation 옵션
 */
export function useAddLike(
  postId: number,
  options?: UseMutationOptions<ActionResult<void>, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => addLikeAction(postId),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
        queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
      }
      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("좋아요 추가 실패:", error);
      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * 좋아요 취소 뮤테이션 훅
 *
 * 서버 액션 완료 후 관련 캐시를 무효화합니다.
 *
 * @param postId - 좋아요를 취소할 게시글 ID
 * @param options - React Query mutation 옵션
 */
export function useRemoveLike(
  postId: number,
  options?: UseMutationOptions<ActionResult<void>, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => removeLikeAction(postId),

    onSuccess: (result, variables, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.detail(postId) });
        queryClient.invalidateQueries({ queryKey: LIKE_QUERY_KEYS.status(postId) });
      }
      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("좋아요 취소 실패:", error);
      options?.onError?.(error, variables, context);
    },
  });
}
