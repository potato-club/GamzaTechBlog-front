/**
 * 리스트 레이아웃 스켈레톤 컴포넌트
 *
 * @description 댓글 목록, 사용자 목록 등 리스트 형태의 로딩 상태를 표시합니다.
 * @param {number} [items=5] - 표시할 리스트 아이템 개수
 * @param {boolean} [showAvatar=true] - 아바타 영역 표시 여부
 * @param {"sm" | "md" | "lg"} [avatarSize="md"] - 아바타 크기 ("sm": 8, "md": 10, "lg": 12)
 * @returns {JSX.Element} List Skeleton UI
 *
 * @example
 * ```tsx
 * // 기본 사용 (아바타 포함)
 * <ListSkeleton items={5} />
 *
 * // 아바타 없는 리스트
 * <ListSkeleton items={3} showAvatar={false} />
 *
 * // 큰 아바타 리스트
 * <ListSkeleton items={4} avatarSize="lg" />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  avatarSize?: "sm" | "md" | "lg";
}

const avatarSizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export default function ListSkeleton({
  items = 5,
  showAvatar = true,
  avatarSize = "md",
}: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          {/* 아바타 */}
          {showAvatar && <Skeleton className={`${avatarSizeMap[avatarSize]} rounded-full`} />}

          {/* 컨텐츠 */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
