/**
 * 태그 섹션 스켈레톤 컴포넌트
 *
 * TagsSection의 로딩 상태를 표시합니다.
 */

interface TagsSkeletonProps {
  count?: number;
}

export default function TagsSkeleton({ count = 6 }: TagsSkeletonProps) {
  return (
    <section className="mt-10">
      <div className="mb-7 h-6 w-16 animate-pulse rounded bg-gray-200"></div>
      <nav className="flex flex-wrap gap-2">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-7 w-20 rounded-full bg-gray-200"></div>
          </div>
        ))}
      </nav>
    </section>
  );
}
