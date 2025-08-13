/**
 * 글로벌 로딩 UI
 *
 * Next.js에서 loading.tsx는 페이지나 레이아웃이 로딩될 때
 * 자동으로 표시되는 UI입니다.
 *
 * Suspense와 함께 사용되어 점진적 렌더링을 제공합니다.
 */
export default function Loading() {
  return (
    <div className="mx-auto flex flex-col gap-12">
      {/* 로고 영역 스켈레톤 */}
      <section className="mt-5 text-center">
        <div className="animate-pulse">
          <div className="mx-auto h-[230px] w-[255px] rounded bg-gray-200"></div>
          <div className="mx-auto mt-2 h-8 w-64 rounded bg-gray-200"></div>
        </div>
      </section>

      {/* 콘텐츠 영역 스켈레톤 */}
      <div className="flex pb-10">
        <main className="flex-3">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-32 rounded bg-gray-200"></div>

            {/* 게시글 카드 스켈레톤 */}
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="mb-3 h-6 rounded bg-gray-200"></div>
                    <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                      <div className="h-4 w-16 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="h-32 w-44 rounded-2xl bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* 사이드바 스켈레톤 */}
        <aside className="ml-8 flex-1">
          <div className="animate-pulse space-y-6">
            {/* 인기 게시글 섹션 */}
            <div>
              <div className="mb-4 h-6 w-24 rounded bg-gray-200"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-4 rounded bg-gray-200"></div>
                ))}
              </div>
            </div>

            {/* 태그 섹션 */}
            <div>
              <div className="mb-4 h-6 w-16 rounded bg-gray-200"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-6 w-16 rounded-full bg-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
