/**
 * TanStack Query를 사용한 자기소개 관련 API 훅들
 */

import { IntroResponse, Pageable, PagedResponseIntroResponse } from "@/generated/api/models";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useAuth } from "../../user/hooks/useUserQueries";
import { introService } from "../services/introService";

// 뮤테이션 컨텍스트 타입 정의
interface CreateIntroContext {
  previousIntros: Array<[readonly unknown[], unknown]>;
  tempIntroId: number;
}

interface DeleteIntroContext {
  previousIntros: Array<[readonly unknown[], unknown]>;
}

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
  options?: UseMutationOptions<IntroResponse, Error, string, CreateIntroContext>
) {
  const queryClient = useQueryClient();
  const { userProfile } = useAuth();

  return useMutation({
    mutationFn: (content: string) => introService.createIntro(content),

    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (content: string): Promise<CreateIntroContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: INTRO_QUERY_KEYS.lists() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousIntros = queryClient.getQueriesData({ queryKey: INTRO_QUERY_KEYS.lists() });

      // 임시 자기소개 객체 생성 (서버 응답과 유사한 구조)
      const tempIntroId = Date.now(); // 임시 ID
      const tempIntro: IntroResponse = {
        introId: tempIntroId,
        content,
        createdAt: new Date(),
        // 현재 로그인한 사용자 정보 사용
        nickname: userProfile?.nickname || "사용자",
        profileImageUrl: userProfile?.profileImageUrl,
        // IntroResponse에는 userId가 있지만 UserProfileResponse에는 없으므로 임시값 사용
        userId: 0, // 서버에서 실제 값으로 교체됨
      };

      // 모든 자기소개 목록 쿼리에 대해 낙관적 업데이트 적용
      queryClient.setQueriesData(
        { queryKey: INTRO_QUERY_KEYS.lists() },
        (oldData: PagedResponseIntroResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: [tempIntro, ...(oldData.content || [])],
            totalElements: (oldData.totalElements || 0) + 1,
          };
        }
      );

      // 롤백을 위한 이전 데이터와 임시 ID 반환
      return { previousIntros, tempIntroId };
    },

    // 성공 시: 서버 응답으로 임시 데이터 교체
    onSuccess: (newIntro, variables, context) => {
      // 서버에서 받은 실제 데이터로 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: INTRO_QUERY_KEYS.lists() },
        (oldData: PagedResponseIntroResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: oldData.content?.map((intro) =>
              intro.introId === context?.tempIntroId ? newIntro : intro
            ) || [newIntro],
          };
        }
      );

      options?.onSuccess?.(newIntro, variables, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, variables, context) => {
      // 백업된 데이터로 롤백
      if (context?.previousIntros) {
        context.previousIntros.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      options?.onError?.(error, variables, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INTRO_QUERY_KEYS.lists() });
    },

    ...options,
  });
}

/**
 * 자기소개 삭제 뮤테이션 (낙관적 업데이트 포함)
 */
export function useDeleteIntro(
  options?: UseMutationOptions<void, Error, number, DeleteIntroContext>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (introId: number) => introService.deleteIntro(introId),

    // 낙관적 업데이트: 서버 응답 전에 UI에서 즉시 제거
    onMutate: async (introId: number): Promise<DeleteIntroContext> => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트와 충돌 방지
      await queryClient.cancelQueries({ queryKey: INTRO_QUERY_KEYS.lists() });

      // 현재 캐시된 데이터를 백업 (롤백용)
      const previousIntros = queryClient.getQueriesData({ queryKey: INTRO_QUERY_KEYS.lists() });

      // 모든 자기소개 목록 쿼리에서 해당 항목 제거
      queryClient.setQueriesData(
        { queryKey: INTRO_QUERY_KEYS.lists() },
        (oldData: PagedResponseIntroResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: oldData.content?.filter((intro) => intro.introId !== introId) || [],
            totalElements: Math.max((oldData.totalElements || 0) - 1, 0),
          };
        }
      );

      // 롤백을 위한 이전 데이터 반환
      return { previousIntros };
    },

    // 성공 시: 추가 작업 없음 (이미 낙관적으로 제거됨)
    onSuccess: (data, introId, context) => {
      options?.onSuccess?.(data, introId, context);
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error, introId, context) => {
      // 백업된 데이터로 롤백
      if (context?.previousIntros) {
        context.previousIntros.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      options?.onError?.(error, introId, context);
    },

    // 완료 시: 관련 쿼리 다시 가져오기 (데이터 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: INTRO_QUERY_KEYS.lists() });
    },

    ...options,
  });
}
