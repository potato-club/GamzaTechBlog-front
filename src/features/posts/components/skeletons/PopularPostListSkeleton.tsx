/**
 * 인기 게시글 목록 스켈레톤 컴포넌트
 *
 * @description PopularPostList 컴포넌트의 로딩 상태를 표시합니다.
 * @param {number} [count=3] - 표시할 인기 게시글 skeleton 개수
 * @returns {JSX.Element} PopularPostList Skeleton UI
 *
 * @example
 * ```tsx
 * <PopularPostListSkeleton count={5} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface PopularPostListSkeletonProps {
  count?: number;
}

export default function PopularPostListSkeleton({ count = 3 }: PopularPostListSkeletonProps) {
  return (
    <div className="mt-7 space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
