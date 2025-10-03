import PaginationWrapper from "@/components/shared/pagination/PaginationWrapper";
import { PagedResponsePostListResponse } from "@/generated/api";
import InteractivePostList from "./InteractivePostList";

/**
 * 게시글 목록 섹션 컴포넌트
 *
 * 단일 책임: 게시글 데이터 표시 (데이터는 props로 받음)
 */

interface PostListSectionProps {
  initialData?: PagedResponsePostListResponse;
  initialTag?: string;
  initialPage: number;
}

export default function PostListSection({
  initialData,
  initialTag,
  initialPage,
}: PostListSectionProps) {
  // 데이터가 없으면 로딩 상태 표시
  if (!initialData) {
    return (
      <section className="flex-1 md:flex-3">
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">게시글을 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 md:flex-3">
      {initialTag && ( // Conditionally render the h2 tag
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-xl font-semibold md:text-2xl">#{initialTag} 태그 게시글</h2>
        </div>
      )}

      {/* 인터랙티브 게시글 목록 */}
      <InteractivePostList
        initialData={initialData}
        initialTag={initialTag}
        initialPage={initialPage}
      />

      {/* 페이지네이션 - 스크롤 상단 이동 */}
      {initialData.totalPages && initialData.totalPages > 1 && (
        <div className="mt-8 flex justify-center md:mt-12">
          <PaginationWrapper
            totalPages={initialData.totalPages}
            scrollToTop={true}
            scrollBehavior="smooth"
            extraParams={{ tag: initialTag }}
          />
        </div>
      )}
    </section>
  );
}
