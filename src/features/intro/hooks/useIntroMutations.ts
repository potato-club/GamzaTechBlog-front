/**
 * 자기소개 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 자기소개 데이터 변경 (쓰기 전용)
 * 읽기 작업은 서버 컴포넌트에서 처리
 */

import type { IntroResponse } from "@/generated/api/models";
import type { ActionResult } from "@/lib/actionResult";
import { useActionMutation, type ActionMutationOptions } from "@/lib/useActionMutation";
import { createIntroAction, deleteIntroAction } from "../actions/introActions";

/**
 * 새 자기소개를 작성하는 뮤테이션 훅
 *
 * @param options - 성공/실패 콜백 옵션
 */
export function useCreateIntro(
  options?: ActionMutationOptions<ActionResult<IntroResponse>, string>
) {
  return useActionMutation(createIntroAction, {
    onSuccess: (result, variables) => {
      options?.onSuccess?.(result, variables);
    },
    onError: (error, variables) => {
      console.error("자기소개 작성 실패:", error);
      options?.onError?.(error, variables);
    },
    onSettled: (data, error, variables) => {
      options?.onSettled?.(data, error, variables);
    },
  });
}

/**
 * 자기소개 삭제 뮤테이션 훅
 *
 * @param options - 성공/실패 콜백 옵션
 */
export function useDeleteIntro(options?: ActionMutationOptions<ActionResult<void>, number>) {
  return useActionMutation(deleteIntroAction, {
    onSuccess: (result, introId) => {
      options?.onSuccess?.(result, introId);
    },
    onError: (error, introId) => {
      console.error("자기소개 삭제 실패:", error);
      options?.onError?.(error, introId);
    },
    onSettled: (data, error, introId) => {
      options?.onSettled?.(data, error, introId);
    },
  });
}
