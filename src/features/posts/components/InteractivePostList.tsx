"use client";

import { PostCard, usePosts, usePostsByTag } from "@/features/posts";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PaginationWrapper } from "../../../components/shared";

export default function InteractivePostList() {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || undefined;
  const currentPage = Number(searchParams.get("page")) || 1;

  const queryParams = useMemo(
    () => ({
      page: currentPage - 1,
      size: 10,
      sort: ["createdAt,desc"],
    }),
    [currentPage]
  );

  const postsQuery = usePosts(queryParams, {
    enabled: !currentTag,
  });

  const postsByTagQuery = usePostsByTag(currentTag!, queryParams, {
    enabled: !!currentTag,
  });

  const activeQuery = currentTag ? postsByTagQuery : postsQuery;
  const { data, isLoading, isFetching, error } = activeQuery;

  const posts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  if (error) {
    return (
      <div className="py-16 text-center text-red-500">
        <p className="mb-2 text-lg">게시글을 불러오는 중 오류가 발생했습니다</p>
        <p className="text-sm">{error.message}</p>
        <button
          onClick={() => activeQuery.refetch()}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      {isFetching && !isLoading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            업데이트 중...
          </div>
        </div>
      )}

      {/* 초기 로딩 상태 표시 */}
      {isLoading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">게시글을 불러오는 중...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div
            className={`mt-6 flex flex-col gap-6 transition-opacity duration-200 md:mt-8 md:gap-8 ${isFetching ? "opacity-70" : "opacity-100"}`}
          >
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.postId} post={post} />)
            ) : (
              <div className="py-16 text-center text-gray-500">
                <p className="mb-2 text-lg">
                  {currentTag ? `#${currentTag} 태그의 게시글이 없습니다` : "게시글이 없습니다"}
                </p>
                <p className="text-sm">
                  {currentTag ? "다른 태그를 선택해보세요!" : "첫 번째 게시글을 작성해보세요!"}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center md:mt-12">
              <PaginationWrapper
                totalPages={totalPages}
                scrollToTop={true}
                scrollBehavior="smooth"
                extraParams={{ tag: currentTag }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
