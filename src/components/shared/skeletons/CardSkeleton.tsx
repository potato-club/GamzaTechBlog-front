/**
 * 카드 레이아웃 스켈레톤 컴포넌트
 *
 * @description 게시글 카드, 프로필 카드 등 카드 형태의 로딩 상태를 표시합니다.
 * @param {number} [count=3] - 표시할 카드 개수
 * @param {boolean} [showImage=true] - 이미지 영역 표시 여부
 * @param {boolean} [showMeta=true] - 메타 정보 (날짜, 작성자 등) 표시 여부
 * @returns {JSX.Element} Card Skeleton UI
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <CardSkeleton count={5} />
 *
 * // 이미지 없는 카드
 * <CardSkeleton count={3} showImage={false} />
 *
 * // 메타 정보 없는 카드
 * <CardSkeleton count={4} showMeta={false} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  count?: number;
  showImage?: boolean;
  showMeta?: boolean;
}

export default function CardSkeleton({
  count = 3,
  showImage = true,
  showMeta = true,
}: CardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-lg border p-4">
          {/* 이미지 영역 */}
          {showImage && <Skeleton className="mb-4 h-48 w-full" />}

          {/* 제목 */}
          <Skeleton className="mb-2 h-6 w-3/4" />

          {/* 설명 */}
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-5/6" />

          {/* 메타 정보 */}
          {showMeta && (
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
