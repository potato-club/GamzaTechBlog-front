/**
 * 대시보드 전용 로딩 UI
 *
 * 마이페이지, 관리자 페이지 등 대시보드 그룹의 페이지들이 로딩될 때
 * 표시되는 스켈레톤 UI입니다.
 *
 * Next.js App Router의 계층적 로딩 시스템에 의해
 * (dashboard) 그룹 내의 모든 페이지에서 사용됩니다.
 */

import MyPageSkeleton from "@/components/shared/skeletons/MyPageSkeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* 대시보드 레이아웃과 동일한 컨테이너 */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 마이페이지용 스켈레톤 UI 사용 */}
        <div className="flex gap-4">
          <MyPageSkeleton />

          {/* 탭 영역 스켈레톤 */}
          <div className="flex-1">
            <div className="animate-pulse">
              {/* 탭 메뉴 스켈레톤 */}
              <div className="mb-6 flex gap-4">
                <div className="h-8 w-16 rounded !bg-gray-200"></div>
                <div className="h-8 w-16 rounded !bg-gray-200"></div>
                <div className="h-8 w-16 rounded !bg-gray-200"></div>
              </div>

              {/* 탭 콘텐츠 스켈레톤 */}
              <div className="space-y-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="mb-2 h-6 w-3/4 rounded !bg-gray-200"></div>
                    <div className="mb-2 h-4 w-1/2 rounded !bg-gray-200"></div>
                    <div className="h-4 w-full rounded !bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
