/**
 * 인기 게시글 목록 스켈레톤 컴포넌트
 *
 * PopularPostList 컴포넌트의 로딩 상태를 표시합니다.
 */

interface PopularPostListSkeletonProps {
  count?: number;
}

export default function PopularPostListSkeleton({ count = 3 }: PopularPostListSkeletonProps) {
  return (
    <div className="mt-7 space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="mb-2 h-5 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
