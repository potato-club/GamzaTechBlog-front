/**
 * 사이드바 스켈레톤 컴포넌트
 *
 * 메인 페이지와 검색 페이지의 사이드바 로딩 상태를 표시합니다.
 */

export default function SidebarSkeleton() {
  return (
    <aside className="ml-10 flex-1 border-l border-[#F2F4F6] pl-10">
      <div className="animate-pulse">
        {/* 인기 게시글 섹션 */}
        <div className="mb-8">
          <div className="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <div className="mb-2 h-5 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 태그 섹션 */}
        <div>
          <div className="mb-4 h-6 w-20 rounded bg-gray-200"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-7 w-24 rounded-full bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
