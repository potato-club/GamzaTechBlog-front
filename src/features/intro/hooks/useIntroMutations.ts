/**
 * 자기소개 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 자기소개 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useIntroQueries.ts 참조
 */

import type { IntroResponse } from "@/generated/api/models";
import type { ActionResult } from "@/lib/actionResult";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { createIntroAction, deleteIntroAction } from "../actions/introActions";
import { INTRO_QUERY_KEYS } from "./useIntroQueries";

/**
 * 새 자기소개를 작성하는 뮤테이션 훅
 *
 * 서버 액션 완료 후 캐시를 무효화하여 최신 상태를 유지합니다.
 *
 * @param options - React Query mutation 옵션
 */
export function useCreateIntro(
  options?: UseMutationOptions<ActionResult<IntroResponse>, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createIntroAction,

    onSuccess: (result, variables, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: INTRO_QUERY_KEYS.lists() });
      }
      options?.onSuccess?.(result, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("자기소개 작성 실패:", error);
      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * 자기소개 삭제 뮤테이션 훅
 *
 * 서버 액션 완료 후 캐시를 무효화하여 최신 상태를 유지합니다.
 *
 * @param options - React Query mutation 옵션
 */
export function useDeleteIntro(options?: UseMutationOptions<ActionResult<void>, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteIntroAction,

    onSuccess: (result, introId, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: INTRO_QUERY_KEYS.lists() });
      }
      options?.onSuccess?.(result, introId, context);
    },

    onError: (error, introId, context) => {
      console.error("자기소개 삭제 실패:", error);
      options?.onError?.(error, introId, context);
    },
  });
}
