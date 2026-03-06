"use client";

/**
 * 관리자 기능 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 관리자 데이터 변경 (쓰기 전용)
 *
 * NOTE: 관리자 대기 목록은 서버 컴포넌트에서 fetch됩니다.
 * 따라서 클라이언트 캐시 대신 router.refresh()로 서버 데이터를 갱신합니다.
 */

import type { ActionResult } from "@/lib/actionResult";
import { useActionMutation, type ActionMutationOptions } from "@/lib/useActionMutation";
import { useRouter } from "next/navigation";
import { approveUserAction } from "../actions/adminActions";

/**
 * 사용자 승인 뮤테이션 훅
 *
 * 서버 컴포넌트에서 대기 목록을 fetch하므로 성공 시 router.refresh()로 갱신합니다.
 *
 * @param options - 성공/실패 콜백 옵션
 */
export function useApproveUser(options?: ActionMutationOptions<ActionResult<void>, number>) {
  const router = useRouter();

  return useActionMutation((userId: number) => approveUserAction(userId), {
    onSuccess: (result, userId) => {
      if (result.success) {
        // 서버 컴포넌트 리렌더링으로 대기 목록 갱신
        router.refresh();
      }

      options?.onSuccess?.(result, userId);
    },
    onError: (error, userId) => {
      console.error("사용자 승인 실패:", error);
      options?.onError?.(error, userId);
    },
    onSettled: (data, error, userId) => {
      options?.onSettled?.(data, error, userId);
    },
  });
}
