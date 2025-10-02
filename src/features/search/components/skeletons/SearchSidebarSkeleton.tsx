/**
 * 검색 사이드바 스켈레톤 컴포넌트
 *
 * SearchPageContent의 사이드바 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
