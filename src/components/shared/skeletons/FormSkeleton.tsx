/**
 * 폼 레이아웃 스켈레톤 컴포넌트
 *
 * @description 프로필 수정, 게시글 작성 등 폼 형태의 로딩 상태를 표시합니다.
 * @param {number} [fields=4] - 표시할 폼 필드 개수
 * @param {boolean} [showButtons=true] - 버튼 영역 표시 여부
 * @param {boolean} [showTitle=true] - 제목 영역 표시 여부
 * @returns {JSX.Element} Form Skeleton UI
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <FormSkeleton fields={5} />
 *
 * // 버튼 없는 폼
 * <FormSkeleton fields={3} showButtons={false} />
 *
 * // 제목 없는 폼
 * <FormSkeleton fields={4} showTitle={false} />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
  showButtons?: boolean;
  showTitle?: boolean;
}

export default function FormSkeleton({
  fields = 4,
  showButtons = true,
  showTitle = true,
}: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* 제목 */}
      {showTitle && <Skeleton className="h-8 w-1/3" />}

      {/* 폼 필드 */}
      <div className="space-y-4">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* 버튼 영역 */}
      {showButtons && (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  );
}
