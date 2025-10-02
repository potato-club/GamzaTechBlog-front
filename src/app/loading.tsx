/**
 * 글로벌 로딩 UI
 *
 * Next.js에서 loading.tsx는 페이지나 레이아웃이 로딩될 때
 * 자동으로 표시되는 UI입니다.
 *
 * Suspense와 함께 사용되어 점진적 렌더링을 제공합니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex flex-col gap-12">
      {/* 로고 영역 스켈레톤 */}
      <section className="mt-5 text-center">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-[230px] w-[255px]" />
          <Skeleton className="mx-auto h-8 w-64" />
        </div>
      </section>

      {/* 콘텐츠 영역 스켈레톤 */}
      <div className="flex pb-10">
        <div className="flex-3">
          <div className="space-y-8">
            <Skeleton className="h-8 w-32" />

            {/* 게시글 카드 스켈레톤 */}
            <div className="space-y-8">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-32 w-44 rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 사이드바 스켈레톤 */}
        <aside className="ml-8 flex-1">
          <div className="space-y-6">
            {/* 인기 게시글 섹션 */}
            <div>
              <Skeleton className="mb-4 h-6 w-24" />
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* 태그 섹션 */}
            <div>
              <Skeleton className="mb-4 h-6 w-16" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
