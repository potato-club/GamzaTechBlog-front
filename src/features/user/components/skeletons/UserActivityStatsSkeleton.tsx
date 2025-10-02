/**
 * 사용자 활동 통계 스켈레톤 컴포넌트
 *
 * @description MyPageSidebar의 사용자 활동 통계 로딩 상태를 표시합니다.
 * @returns {JSX.Element} UserActivityStats Skeleton UI
 *
 * @example
 * ```tsx
 * <UserActivityStatsSkeleton />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function UserActivityStatsSkeleton() {
  return (
    <>
      <Skeleton className="h-12 w-16 rounded-md" />
      <Skeleton className="h-12 w-16 rounded-md" />
      <Skeleton className="h-12 w-16 rounded-md" />
    </>
  );
}
