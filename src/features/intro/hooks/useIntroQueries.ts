/**
 * TanStack Query를 사용한 자기소개 관련 읽기 전용 훅들
 *
 * 책임: 자기소개 데이터 조회 (읽기 전용)
 * 변경 작업(작성, 삭제)은 useIntroMutations.ts 참조
 */

import type { Pageable, PagedResponseIntroResponse } from "@/generated/api/models";
import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { introService } from "../services/introService";

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
