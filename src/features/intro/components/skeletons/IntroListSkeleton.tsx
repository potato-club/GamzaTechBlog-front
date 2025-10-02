/**
 * 자기소개 목록 스켈레톤 컴포넌트
 *
 * IntroList 컴포넌트의 로딩 상태를 표시합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

interface IntroListSkeletonProps {
  count?: number;
}

export default function IntroListSkeleton({ count = 3 }: IntroListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl bg-[#FAFBFF] px-6 py-5">
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="mr-2 h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="mt-2 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
