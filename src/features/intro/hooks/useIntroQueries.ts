/**
 * TanStack Query를 사용한 자기소개 관련 API 훅들
 */

import { IntroResponse, Pageable, PagedResponseIntroResponse } from "@/generated/api/models";
import { useAuth } from "@/hooks/useAuth";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { introService } from "../services/introService";
import { withOptimisticUpdate } from "@/lib/query-utils/optimisticHelpers";

// 자기소개 관련 Query Key 팩토리
export const INTRO_QUERY_KEYS = {
  all: ["intros"] as const,
  lists: () => [...INTRO_QUERY_KEYS.all, "list"] as const,
  list: (params?: Pageable) => [...INTRO_QUERY_KEYS.lists(), params] as const,
} as const;

/**
 * 자기소개 목록을 조회하는 훅 (페이지네이션)
 */
export function useIntros(
  params?: Pageable,
  options?: Omit<UseQueryOptions<PagedResponseIntroResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: INTRO_QUERY_KEYS.list(params),
    queryFn: () => introService.getIntroList(params || { page: 0, size: 10 }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
}

/**
 * 새 자기소개를 작성하는 뮤테이션 훅 (낙관적 업데이트 포함)
 */
export function useCreateIntro(
  options?: UseMutationOptions<IntroResponse, Error, string>
) {
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
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
}

/**
 * 자기소개 삭제 뮤테이션 (낙관적 업데이트 포함)
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
      options?.onSuccess?.(data, introId, context);
    },

    onError: (error, introId, context) => {
      options?.onError?.(error, introId, context);
    },

    ...options,
  });
}
