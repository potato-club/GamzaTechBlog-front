/**
 * 게시글 댓글 섹션 스켈레톤 컴포넌트
 *
 * @description PostCommentsSection 컴포넌트의 로딩 상태를 표시합니다.
 * @param {number} [count=3] - 표시할 댓글 skeleton 개수
 * @returns {JSX.Element} PostCommentsSection Skeleton UI
 *
 * @example
 * ```tsx
 * <PostCommentsSectionSkeleton count={5} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface PostCommentsSectionSkeletonProps {
  count?: number;
}

export default function PostCommentsSectionSkeleton({
  count = 3,
}: PostCommentsSectionSkeletonProps) {
  return (
    <section className="my-12 text-[17px] text-[#353841]" aria-label="댓글 섹션">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="rounded-xl bg-gray-100 px-6 py-5">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
