/**
 * 댓글 섹션 스켈레톤 컴포넌트
 *
 * PostCommentsSection 컴포넌트의 로딩 상태를 표시합니다.
 */

interface CommentsSkeletonProps {
  count?: number;
}

export default function CommentsSkeleton({ count = 2 }: CommentsSkeletonProps) {
  return (
    <div className="mt-8 animate-pulse">
      <div className="mb-4 h-6 w-24 rounded bg-gray-200"></div>
      <div className="space-y-4">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="mb-2 h-4 w-20 rounded bg-gray-200"></div>
              <div className="h-4 w-full rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
