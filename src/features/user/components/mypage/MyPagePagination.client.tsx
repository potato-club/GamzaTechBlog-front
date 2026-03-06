"use client";

import CustomPagination from "@/components/shared/navigation/CustomPagination";
import { usePagination } from "@/hooks/usePagination";
import type { TabType } from "@/types/mypage";

interface MyPagePaginationProps {
  totalPages: number;
  currentTab: TabType;
  className?: string;
}

export default function MyPagePagination({
  totalPages,
  currentTab,
  className,
}: MyPagePaginationProps) {
  const { currentPage, setPage } = usePagination({
    scrollToTop: false,
    extraParams: { tab: currentTab },
  });

  if (totalPages <= 1) {
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
