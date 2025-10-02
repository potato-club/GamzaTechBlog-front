/**
 * 게시글 목록 스켈레톤 컴포넌트
 *
 * PostList 컴포넌트의 로딩 상태를 표시합니다.
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
