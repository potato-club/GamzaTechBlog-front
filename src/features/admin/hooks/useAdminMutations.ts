"use client";

/**
 * 관리자 기능 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 관리자 데이터 변경 (쓰기 전용)
 */

import type { ActionResult } from "@/lib/actionResult";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { approveUserAction } from "../actions/adminActions";

/** 관리자 관련 쿼리 키 */
export const ADMIN_QUERY_KEYS = {
  pendingUsers: () => ["admin", "pendingUsers"] as const,
};

/**
 * 사용자 승인 뮤테이션 훅
 *
 * 서버 액션 완료 후 캐시를 무효화하여 대기 목록을 갱신합니다.
 *
 * @param options - React Query mutation 옵션 (onSuccess, onError 등)
 */
export function useApproveUser(options?: UseMutationOptions<ActionResult<void>, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (userId: number) => approveUserAction(userId),

    onSuccess: (result, userId, context) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingUsers() });
      }

      options?.onSuccess?.(result, userId, context);
    },

    onError: (error, userId, context) => {
      console.error("사용자 승인 실패:", error);
      options?.onError?.(error, userId, context);
    },
  });
}
