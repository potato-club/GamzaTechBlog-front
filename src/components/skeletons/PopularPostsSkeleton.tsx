/**
 * 인기 게시글 섹션 스켈레톤 컴포넌트
 *
 * PopularPostsSection의 로딩 상태를 표시합니다.
 */

interface PopularPostsSkeletonProps {
  count?: number;
}

export default function PopularPostsSkeleton({ count = 3 }: PopularPostsSkeletonProps) {
  return (
    <section>
      <div className="mb-7 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
      <div className="space-y-4">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="mb-2 h-5 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
