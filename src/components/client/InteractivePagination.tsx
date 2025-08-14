"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CustomPagination from "../shared/navigation/CustomPagination";

/**
 * 인터랙티브 페이지네이션 클라이언트 컴포넌트
 *
 * 단일 책임: 페이지네이션 상태 관리 및 URL 업데이트
 */

interface InteractivePaginationProps {
  currentPage: number;
  totalPages: number;
  tag?: string;
  className?: string;
}

export default function InteractivePagination({
  currentPage,
  totalPages,
  tag,
  className,
}: InteractivePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    if (tag) {
      params.set("tag", tag);
    }

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";

    router.push(url);
  };

  return (
    <CustomPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className={className}
    />
  );
}
