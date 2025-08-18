import InteractivePagination from "@/components/shared/interactive/InteractivePagination";
import { postService } from "@/features/posts";
import InteractivePostList from "./InteractivePostList";

/**
 * 게시글 목록 섹션 서버 컴포넌트
 *
 * 단일 책임: 초기 게시글 데이터 페칭 및 클라이언트 컴포넌트에 전달
 */

interface PostListSectionProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function PostListSection({ searchParams }: PostListSectionProps) {
  const { tag, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  // 서버에서 초기 게시글 데이터 페칭
  const initialData = tag
    ? await postService.getPostsByTag(tag, {
        page: currentPage - 1,
        size: pageSize,
        sort: ["createdAt,desc"],
      })
    : await postService.getPosts({
        page: currentPage - 1,
        size: pageSize,
        sort: ["createdAt,desc"],
      });

  return (
    <main className="flex-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tag ? `#${tag} 태그 게시글` : "Posts"}</h2>
      </div>

      {/* 인터랙티브 게시글 목록 */}
      <InteractivePostList initialData={initialData} initialTag={tag} initialPage={currentPage} />

      {/* 페이지네이션 */}
      {initialData.totalPages && initialData.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <InteractivePagination
            currentPage={currentPage}
            totalPages={initialData.totalPages}
            tag={tag}
          />
        </div>
      )}
    </main>
  );
}
