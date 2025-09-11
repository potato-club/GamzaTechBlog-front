import InteractivePagination from "@/components/shared/interactive/InteractivePagination";
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
      <section className="flex-3">
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">게시글을 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-3">
      {initialTag && ( // Conditionally render the h2 tag
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">#{initialTag} 태그 게시글</h2>
        </div>
      )}

      {/* 인터랙티브 게시글 목록 */}
      <InteractivePostList
        initialData={initialData}
        initialTag={initialTag}
        initialPage={initialPage}
      />

      {/* 페이지네이션 */}
      {initialData.totalPages && initialData.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <InteractivePagination
            currentPage={initialPage}
            totalPages={initialData.totalPages}
            tag={initialTag}
          />
        </div>
      )}
    </section>
  );
}
