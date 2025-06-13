import { Skeleton } from "@/components/ui/skeleton";

export default function MainPageSkeleton() {
  return (
    <div className="flex flex-col mt-16 gap-30 mx-auto" role="status" aria-label="페이지 로딩중">
      {/* 로고 스켈레톤 */}
      <section className="text-center">
        <Skeleton className="w-[320px] h-[230px] rounded-lg mx-auto" />
      </section>

      <main className="flex pb-10">
        {/* 게시물 목록 섹션 스켈레톤 */}
        <section className="flex-3">
          <Skeleton className="w-32 h-8 rounded-md mb-6" /> {/* "Posts" 제목 스켈레톤 */}
          {/* PostList 스켈레톤 (여러 개의 게시물 아이템) */}
          <div className="">
            {Array.from({ length: 3 }, (_, i) => ( // 예시로 3개의 게시물 스켈레톤
              <div key={i} className="flex items-center gap-50 py-6 bg-white rounded-lg"> {/* PostCard의 최상위 div 스타일 일부 적용 */}
                {/* 텍스트 정보 영역 스켈레톤 (기존과 유사) */}
                <div className="flex-1 h-[140px] flex flex-col justify-between"> {/* PostCard의 텍스트 영역 높이와 유사하게 */}
                  <Skeleton className="w-3/4 h-6 rounded-md mb-3.5" /> {/* 게시물 제목 스켈레톤 */}
                  <Skeleton className="w-full h-4 rounded-md mb-1" /> {/* 게시물 요약 스켈레톤 (첫 줄) */}
                  <Skeleton className="w-5/6 h-4 rounded-md" /> {/* 게시물 요약 스켈레톤 (둘째 줄) */}
                  <div className="mt-auto"> {/* PostMeta 영역을 아래로 밀기 위해 */}
                    <Skeleton className="w-1/2 h-4 rounded-md mb-2" /> {/* 작성자/날짜 스켈레톤 */}
                    <div className="flex gap-2">
                      <Skeleton className="w-16 h-5 rounded-full" /> {/* 태그 스켈레톤 */}
                      <Skeleton className="w-20 h-5 rounded-full" /> {/* 태그 스켈레톤 */}
                    </div>
                  </div>
                </div>
                {/* 썸네일 영역 스켈레톤 (PostCard.tsx의 우측 영역과 유사하게) */}
                <div className="relative w-44 h-32 shrink-0"> {/* PostCard의 썸네일 영역 크기 적용, shrink-0 추가 */}
                  <Skeleton className="w-full h-28 rounded-2xl" /> {/* PostCard의 실제 썸네일 박스 크기(h-28)와 유사하게 */}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 사이드바 섹션 스켈레톤 (기존과 동일) */}
        <aside className="flex-1 ml-10 hidden md:block">
          <div className="mb-10">
            <Skeleton className="w-28 h-6 rounded-md mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={`popular-${i}`} className="w-full h-5 rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="w-20 h-6 rounded-md mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={`tag-${i}`} className="w-24 h-7 rounded-full" />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}