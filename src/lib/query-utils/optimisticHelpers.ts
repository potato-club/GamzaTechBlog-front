/**
 * TanStack Query 낙관적 업데이트를 위한 간단한 헬퍼 함수
 *
 * 복잡한 Generic 대신 단순한 구조로 중복 코드 제거
 */

import type { QueryClient } from '@tanstack/react-query';

/**
 * 낙관적 업데이트 헬퍼 설정
 */
interface OptimisticConfig<TData, TQueryData> {
  queryClient: QueryClient;
  queryKey: readonly unknown[];
  updateCache: (oldData: TQueryData, mutationData: TData) => TQueryData;
  invalidateKeys?: readonly (readonly unknown[])[];
}

/**
 * 낙관적 업데이트를 위한 mutation handlers 생성
 *
 * @example
 * ```typescript
 * export function useCreatePost() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: postService.createPost,
 *     ...withOptimisticUpdate({
 *       queryClient,
 *       queryKey: POST_QUERY_KEYS.lists(),
 *       updateCache: (oldData, newPost) => ({
 *         ...oldData,
 *         content: [createTempPost(newPost), ...oldData.content],
 *         totalElements: oldData.totalElements + 1,
 *       }),
 *     }),
 *   });
 * }
 * ```
 */
export function withOptimisticUpdate<TData, TQueryData>({
  queryClient,
  queryKey,
  updateCache,
  invalidateKeys,
}: OptimisticConfig<TData, TQueryData>) {
  return {
    onMutate: async (data: TData) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 2. 이전 데이터 백업
      const previousData = queryClient.getQueriesData<TQueryData>({ queryKey });

      // 3. 낙관적 업데이트
      queryClient.setQueriesData<TQueryData>({ queryKey }, (oldData) => {
        if (!oldData) return oldData;
        return updateCache(oldData, data);
      });

      return { previousData };
    },

    onError: (_error: Error, _data: TData, context?: { previousData: Array<[unknown[], TQueryData]> }) => {
      // 롤백
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey });
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  };
}
