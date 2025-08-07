/**
 * 재사용 가능한 커스텀 페이지네이션 컴포넌트
 *
 * shadcn/ui Pagination을 기반으로 한 고도화된 페이지네이션 컴포넌트입니다.
 * 다양한 페이지 수와 현재 페이지에 따라 스마트하게 페이지 번호를 표시합니다.
 */

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출되는 함수 */
  onPageChange: (page: number) => void;
  /** 표시할 최대 페이지 번호 개수 */
  maxVisiblePages?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className = "",
}: CustomPaginationProps) {
  // 1페이지만 있을 때는 숨김
  if (totalPages <= 1) {
    return null;
  }

  // 표시할 페이지 번호 배열 생성
  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    const adjustedStart = Math.max(1, end - maxVisiblePages + 1);

    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className={`flex justify-center ${className}`}>
      <Pagination>
        <PaginationContent>
          {/* 이전 페이지 버튼 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }
            />
          </PaginationItem>

          {/* 첫 번째 페이지 (항상 표시되지 않는 경우에만) */}
          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  isActive={currentPage === 1}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {showStartEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* 현재 범위의 페이지 번호들 */}
          {visiblePages.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => onPageChange(pageNum)}
                isActive={pageNum === currentPage}
                className="cursor-pointer hover:bg-gray-100"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 마지막 페이지 (항상 표시되지 않는 경우에만) */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {showEndEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  isActive={currentPage === totalPages}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* 다음 페이지 버튼 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
