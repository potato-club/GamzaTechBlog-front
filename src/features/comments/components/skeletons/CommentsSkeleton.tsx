/**
 * 댓글 섹션 스켈레톤 컴포넌트
 *
 * PostCommentsSection 컴포넌트의 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

interface CommentsSkeletonProps {
  count?: number;
}

export default function CommentsSkeleton({ count = 2 }: CommentsSkeletonProps) {
  return (
    <div className="mt-8">
      <Skeleton className="mb-4 h-6 w-24" />
      <div className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
