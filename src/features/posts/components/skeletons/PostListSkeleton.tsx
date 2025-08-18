/**
 * 게시글 목록 스켈레톤 컴포넌트
 *
 * PostList 컴포넌트의 로딩 상태를 표시합니다.
 */

interface PostListSkeletonProps {
  count?: number;
}

export default function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <main className="flex-3">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
      <div className="mt-8 flex flex-col gap-8">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
