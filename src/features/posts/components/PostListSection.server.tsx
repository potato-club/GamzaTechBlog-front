import { PaginationWrapper } from "@/components/shared";
import type { PostListResponse } from "@/generated/api";
import EmptyState from "@/components/shared/EmptyState";
import PostCard from "./PostCard";

interface PostListSectionProps {
  initialTag?: string;
  posts: PostListResponse[];
  totalPages: number;
}

export default function PostListSection({
  initialTag,
  posts,
  totalPages,
}: PostListSectionProps) {
  return (
    <section className="flex-1 md:flex-3">
      {initialTag && (
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-xl font-semibold md:text-2xl">#{initialTag} 태그 게시글</h2>
        </div>
      )}

      {posts.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title={initialTag ? `#${initialTag} 태그 게시글이 없습니다` : "게시글이 없습니다"}
          description={
            initialTag ? "다른 태그를 선택해보세요!" : "첫 번째 게시글을 작성해보세요!"
          }
        />
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center md:mt-12">
              <PaginationWrapper
                totalPages={totalPages}
                scrollToTop={true}
                scrollBehavior="smooth"
                extraParams={{ tag: initialTag }}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
