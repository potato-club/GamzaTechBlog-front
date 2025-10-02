/**
 * 게시글 목록 스켈레톤 컴포넌트
 *
 * @description PostList 컴포넌트의 로딩 상태를 표시합니다.
 * @param {number} [count=3] - 표시할 게시글 skeleton 개수
 * @returns {JSX.Element} PostList Skeleton UI
 *
 * @example
 * ```tsx
 * <PostListSkeleton count={5} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface PostListSkeletonProps {
  count?: number;
}

export default function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <div className="flex-3">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="mt-8 flex flex-col gap-8">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
