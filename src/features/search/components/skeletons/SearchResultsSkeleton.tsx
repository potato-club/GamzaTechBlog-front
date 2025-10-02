/**
 * 검색 결과 스켈레톤 컴포넌트
 *
 * @description SearchPageContent 컴포넌트의 검색 결과 로딩 상태를 표시합니다.
 * @param {number} [count=3] - 표시할 검색 결과 skeleton 개수
 * @returns {JSX.Element} SearchResults Skeleton UI
 *
 * @example
 * ```tsx
 * <SearchResultsSkeleton count={5} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsSkeletonProps {
  count?: number;
}

export default function SearchResultsSkeleton({ count = 3 }: SearchResultsSkeletonProps) {
  return (
    <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-5 w-3/4 md:h-6" />
          <Skeleton className="h-3 w-1/2 md:h-4" />
          <Skeleton className="h-3 w-full md:h-4" />
        </div>
      ))}
    </div>
  );
}
