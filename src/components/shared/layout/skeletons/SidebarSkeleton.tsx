/**
 * 사이드바 스켈레톤 컴포넌트
 *
 * @description 메인 페이지와 검색 페이지의 사이드바 로딩 상태를 표시합니다.
 * @returns {JSX.Element} Sidebar Skeleton UI
 *
 * @example
 * ```tsx
 * <SidebarSkeleton />
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <aside className="ml-10 flex-1 border-l border-[#F2F4F6] pl-10">
      <div className="space-y-8">
        {/* 인기 게시글 섹션 */}
        <div>
          <Skeleton className="mb-4 h-6 w-1/2" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* 태그 섹션 */}
        <div>
          <Skeleton className="mb-4 h-6 w-20" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
