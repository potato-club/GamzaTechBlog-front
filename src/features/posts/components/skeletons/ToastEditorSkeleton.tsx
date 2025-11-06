/**
 * Toast 에디터 스켈레톤 컴포넌트
 *
 * ToastEditor 컴포넌트의 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function ToastEditorSkeleton() {
  return (
    <div className="h-64 rounded border p-4">
      <Skeleton className="mb-4 h-8 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
