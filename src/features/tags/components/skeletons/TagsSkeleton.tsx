/**
 * 태그 섹션 스켈레톤 컴포넌트
 *
 * TagsSection의 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

interface TagsSkeletonProps {
  count?: number;
}

export default function TagsSkeleton({ count = 6 }: TagsSkeletonProps) {
  return (
    <section className="mt-10">
      <Skeleton className="mb-7 h-6 w-16" />
      <nav className="flex flex-wrap gap-2">
        {Array.from({ length: count }, (_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-full" />
        ))}
      </nav>
    </section>
  );
}
