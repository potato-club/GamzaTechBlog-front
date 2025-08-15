import { postService } from "@/services/postService";
import InteractivePagination from "../../../shared/interactive/InteractivePagination";
import PostCard from "./PostCard";

/**
 * 게시글 목록 섹션 서버 컴포넌트
 *
 * 단일 책임: 게시글 데이터 페칭 및 목록 표시
 */

interface PostListSectionProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function PostListSection({ searchParams }: PostListSectionProps) {
  const { tag, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  // 서버에서 게시글 데이터 페칭
  const postsData = tag
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

  const posts = postsData?.content || [];
  const totalPages = postsData?.totalPages || 0;

  return (
    <main className="flex-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tag ? `#${tag} 태그 게시글` : "Posts"}</h2>
      </div>

      {/* 정적 게시글 목록 */}
      <div className="mt-8 flex flex-col gap-8">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.postId} post={post} />)
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p className="mb-2 text-lg">
              {tag ? `#${tag} 태그의 게시글이 없습니다` : "게시글이 없습니다"}
            </p>
            <p className="text-sm">
              {tag ? "다른 태그를 선택해보세요!" : "첫 번째 게시글을 작성해보세요!"}
            </p>
          </div>
        )}
      </div>

      {/* 인터랙티브 페이지네이션 */}
      <InteractivePagination
        currentPage={currentPage}
        totalPages={totalPages}
        tag={tag}
        className="mt-12"
      />
    </main>
  );
}
