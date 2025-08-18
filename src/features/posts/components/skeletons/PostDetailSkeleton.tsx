import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailSkeleton() {
  return (
    <main className="mx-16 my-16" role="status" aria-label="게시글 로딩중">
      <article className="border-b border-[#D5D9E3] py-8">
        <header className="mb-8">
          {/* 게시글 제목 스켈레톤 */}
          <Skeleton className="mb-6 h-10 w-3/4 rounded-md" />

          {/* 메타 정보 (작성자, 날짜, 더보기 버튼) 스켈레톤 */}
          <div className="mb-4 flex h-12 items-center gap-4 text-[14px]">
            <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
              <Skeleton className="h-6 w-6 rounded-full" /> {/* 프로필 이미지 */}
              <Skeleton className="ml-2 h-4 w-16 rounded-md" /> {/* 작성자명 */}
            </div>
            <Skeleton className="h-4 w-20 rounded-md" /> {/* 날짜 */}
            <Skeleton className="ml-auto h-8 w-8 rounded-full" /> {/* 더보기 버튼 */}
          </div>

          {/* 태그 스켈레톤 */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </header>

        {/* 게시글 본문 스켈레톤 */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />

          {/* 이미지 영역 스켈레톤 (마크다운에 이미지가 있을 수 있음) */}
          <div className="my-6">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>

          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </article>

      {/* 댓글 섹션 스켈레톤 */}
      <section className="py-8">
        {/* 댓글 수 헤더 스켈레톤 */}
        <div className="mb-6">
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>

        {/* 댓글 작성 폼 스켈레톤 */}
        <div className="mb-8 rounded-lg border p-4">
          <Skeleton className="mb-4 h-24 w-full rounded-md" /> {/* 댓글 입력창 */}
          <div className="flex justify-end">
            <Skeleton className="h-8 w-16 rounded-md" /> {/* 댓글 작성 버튼 */}
          </div>
        </div>

        {/* 댓글 목록 스켈레톤 */}
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              {/* 댓글 헤더 (작성자, 날짜) */}
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" /> {/* 프로필 이미지 */}
                <div>
                  <Skeleton className="mb-1 h-4 w-16 rounded-md" /> {/* 작성자명 */}
                  <Skeleton className="h-3 w-20 rounded-md" /> {/* 작성일 */}
                </div>
                <Skeleton className="ml-auto h-6 w-6 rounded-full" /> {/* 더보기 버튼 */}
              </div>

              {/* 댓글 내용 */}
              <div className="ml-11 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              {/* 댓글 액션 (좋아요, 답글) */}
              <div className="mt-3 ml-11 flex gap-4">
                <Skeleton className="h-6 w-12 rounded-md" />
                <Skeleton className="h-6 w-12 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
