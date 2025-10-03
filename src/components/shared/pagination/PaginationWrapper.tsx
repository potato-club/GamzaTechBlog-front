"use client";

import { usePagination } from "@/hooks/usePagination";
import CustomPagination from "../navigation/CustomPagination";

/**
 * 페이지네이션 래퍼 컴포넌트
 *
 * usePagination 훅을 사용하여 페이지네이션 UI를 렌더링합니다.
 * 서버 컴포넌트에서 페이지네이션을 사용할 수 있도록 클라이언트 컴포넌트로 분리했습니다.
 */

interface PaginationWrapperProps {
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 스크롤을 상단으로 이동할지 여부 (기본값: false) */
  scrollToTop?: boolean;
  /** 스크롤 애니메이션 방식 (기본값: "smooth") */
  scrollBehavior?: ScrollBehavior;
  /** 추가로 유지할 쿼리 파라미터 (빈 문자열은 제외됨) */
  extraParams?: Record<string, string | null | undefined>;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function PaginationWrapper({
  totalPages,
  scrollToTop = false,
  scrollBehavior = "smooth",
  extraParams,
  className,
}: PaginationWrapperProps) {
  const { currentPage, setPage } = usePagination({
    scrollToTop,
    scrollBehavior,
    extraParams,
  });

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <CustomPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setPage}
      className={className}
    />
  );
}
