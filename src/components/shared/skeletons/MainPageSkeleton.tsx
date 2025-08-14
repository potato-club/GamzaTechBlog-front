import { Skeleton } from "@/components/ui/skeleton";

export default function MainPageSkeleton() {
  return (
    <div className="mx-auto mt-16 flex flex-col gap-30" role="status" aria-label="페이지 로딩중">
      {/* 로고 스켈레톤 */}
      <section className="text-center">
        <Skeleton className="mx-auto h-[230px] w-[320px] rounded-lg" />
      </section>

      <main className="flex pb-10">
        {/* 게시물 목록 섹션 스켈레톤 */}
        <section className="flex-3">
          <Skeleton className="mb-6 h-8 w-32 rounded-md" /> {/* "Posts" 제목 스켈레톤 */}
          {/* PostList 스켈레톤 (여러 개의 게시물 아이템) */}
          <div className="">
            {Array.from(
              { length: 3 },
              (
                _,
                i // 예시로 3개의 게시물 스켈레톤
              ) => (
                <div key={i} className="flex items-center gap-50 rounded-lg bg-white py-6">
                  {" "}
                  {/* PostCard의 최상위 div 스타일 일부 적용 */}
                  {/* 텍스트 정보 영역 스켈레톤 (기존과 유사) */}
                  <div className="flex h-[140px] flex-1 flex-col justify-between">
                    {" "}
                    {/* PostCard의 텍스트 영역 높이와 유사하게 */}
                    <Skeleton className="mb-3.5 h-6 w-3/4 rounded-md" />{" "}
                    {/* 게시물 제목 스켈레톤 */}
                    <Skeleton className="mb-1 h-4 w-full rounded-md" />{" "}
                    {/* 게시물 요약 스켈레톤 (첫 줄) */}
                    <Skeleton className="h-4 w-5/6 rounded-md" />{" "}
                    {/* 게시물 요약 스켈레톤 (둘째 줄) */}
                    <div className="mt-auto">
                      {" "}
                      {/* PostMeta 영역을 아래로 밀기 위해 */}
                      <Skeleton className="mb-2 h-4 w-1/2 rounded-md" />{" "}
                      {/* 작성자/날짜 스켈레톤 */}
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" /> {/* 태그 스켈레톤 */}
                        <Skeleton className="h-5 w-20 rounded-full" /> {/* 태그 스켈레톤 */}
                      </div>
                    </div>
                  </div>
                  {/* 썸네일 영역 스켈레톤 (PostCard.tsx의 우측 영역과 유사하게) */}
                  <div className="relative h-32 w-44 shrink-0">
                    {" "}
                    {/* PostCard의 썸네일 영역 크기 적용, shrink-0 추가 */}
                    <Skeleton className="h-28 w-full rounded-2xl" />{" "}
                    {/* PostCard의 실제 썸네일 박스 크기(h-28)와 유사하게 */}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* 사이드바 섹션 스켈레톤 (기존과 동일) */}
        <aside className="ml-10 hidden flex-1 md:block">
          <div className="mb-10">
            <Skeleton className="mb-4 h-6 w-28 rounded-md" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={`popular-${i}`} className="h-5 w-full rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="mb-4 h-6 w-20 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={`tag-${i}`} className="h-7 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
