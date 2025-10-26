/**
 * 자기소개 관련 변경 작업 훅들 (Mutations)
 *
 * 책임: 자기소개 데이터 변경 (쓰기 전용)
 * 읽기 작업은 useIntroQueries.ts 참조
 */

import type { IntroResponse, PagedResponseIntroResponse } from "@/generated/api/models";
import { useAuth } from "@/hooks/useAuth";
import { withOptimisticUpdate } from "@/lib/query-utils/optimisticHelpers";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { introService } from "../services/introService";
import { INTRO_QUERY_KEYS } from "./useIntroQueries";

/**
 * 새 자기소개를 작성하는 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공합니다.
 *
 * @param options - React Query mutation 옵션
 */
export function useCreateIntro(options?: UseMutationOptions<IntroResponse, Error, string>) {
  const queryClient = useQueryClient();
  const { userProfile } = useAuth();

  return useMutation({
    mutationFn: introService.createIntro,

    ...withOptimisticUpdate<string, PagedResponseIntroResponse>({
      queryClient,
      queryKey: INTRO_QUERY_KEYS.lists(),
      updateCache: (oldData, content) => {
        // 임시 자기소개 생성
        const tempIntro: IntroResponse = {
          introId: Date.now(), // 임시 ID
          content,
          createdAt: new Date(),
          nickname: userProfile?.nickname || "사용자",
          profileImageUrl: userProfile?.profileImageUrl,
          userId: -1, // 서버에서 실제 값으로 교체됨
        };

        return {
          ...oldData,
          content: [tempIntro, ...(oldData.content || [])],
          totalElements: (oldData.totalElements || 0) + 1,
        };
      },
    }),

    onSuccess: (newIntro, variables, context) => {
      options?.onSuccess?.(newIntro, variables, context);
    },

    onError: (error, variables, context) => {
      console.error("자기소개 작성 실패:", error);
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 자기소개 삭제 뮤테이션 훅
 *
 * 낙관적 업데이트를 통해 즉각적인 UI 반응을 제공합니다.
 *
 * @param options - React Query mutation 옵션
 */
export function useDeleteIntro(options?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: introService.deleteIntro,

    ...withOptimisticUpdate<number, PagedResponseIntroResponse>({
      queryClient,
      queryKey: INTRO_QUERY_KEYS.lists(),
      updateCache: (oldData, introId) => ({
        ...oldData,
        content: oldData.content?.filter((intro) => intro.introId !== introId) || [],
        totalElements: Math.max((oldData.totalElements || 0) - 1, 0),
      }),
    }),

    onSuccess: (data, introId, context) => {
      console.log("자기소개 삭제 성공:", introId);
      options?.onSuccess?.(data, introId, context);
    },

    onError: (error, introId, context) => {
      console.error("자기소개 삭제 실패:", error);
      options?.onError?.(error, introId, context);
    },

    ...options,
  });
}
