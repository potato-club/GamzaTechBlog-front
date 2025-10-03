"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface UsePaginationOptions {
  /** 기본 페이지 (기본값: 1) */
  defaultPage?: number;
  /** 페이지 변경 시 스크롤을 상단으로 이동할지 여부 (기본값: false) */
  scrollToTop?: boolean;
  /** 스크롤 애니메이션 방식 (기본값: "smooth") */
  scrollBehavior?: ScrollBehavior;
  /** 추가로 유지할 쿼리 파라미터 (예: { tag: "react" }) */
  extraParams?: Record<string, string | undefined>;
}

/**
 * 통합 페이지네이션 훅
 *
 * URL 쿼리 파라미터 기반으로 페이지 상태를 관리하고 페이지 이동을 처리합니다.
 * 북마크, 뒤로가기, 새로고침을 지원하며 스크롤 제어 및 추가 파라미터 처리가 가능합니다.
 *
 * @example
 * // 스크롤 위치 유지 (검색, 마이페이지)
 * const { currentPage, setPage } = usePagination({ scrollToTop: false });
 *
 * @example
 * // 스크롤 상단 이동 (메인 페이지)
 * const { currentPage, setPage } = usePagination({
 *   scrollToTop: true,
 *   scrollBehavior: "smooth",
 *   extraParams: { tag: "react" }
 * });
 */
export function usePagination(options: UsePaginationOptions = {}) {
  const {
    defaultPage = 1,
    scrollToTop = false,
    scrollBehavior = "smooth",
    extraParams = {},
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 현재 페이지 읽기 (1부터 시작)
  const pageFromUrl = searchParams?.get("page");
  const parsedPage = parseInt(pageFromUrl || "", 10);
  const currentPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : defaultPage;

  // API 호출용 페이지 (0부터 시작)
  const currentPageForAPI = currentPage - 1;

  // 페이지 변경 함수
  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams?.toString() || "");

      // 페이지 파라미터 처리
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      // 추가 파라미터 처리
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;

      // 스크롤 제어
      if (scrollToTop) {
        window.scrollTo({
          top: 0,
          behavior: scrollBehavior,
        });
      }

      router.push(newUrl, { scroll: scrollToTop });
    },
    [router, pathname, searchParams, scrollToTop, scrollBehavior, extraParams]
  );

  return {
    currentPage, // UI용 (1부터 시작)
    currentPageForAPI, // API용 (0부터 시작)
    setPage,
  };
}
