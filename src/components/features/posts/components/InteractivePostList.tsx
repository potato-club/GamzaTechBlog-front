"use client";

import { PagedResponsePostListResponse } from "@/generated/api";
import { usePosts, usePostsByTag } from "@/hooks/queries/usePostQueries";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import PostCard from "./PostCard";

/**
 * 인터랙티브 게시글 목록 클라이언트 컴포넌트
 *
 * 초기 데이터는 서버에서 받고, 이후 상호작용은 TanStack Query 사용
 */

interface InteractivePostListProps {
  initialData: PagedResponsePostListResponse;
  initialTag?: string;
  initialPage: number;
}

export default function InteractivePostList({
  initialData,
  initialTag,
  initialPage,
}: InteractivePostListProps) {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || undefined;
  const currentPage = Number(searchParams.get("page")) || 1;

  // 초기 로딩인지 확인 (URL 파라미터가 초기값과 같은지)
  const isInitialLoad = currentTag === initialTag && currentPage === initialPage;

  // 쿼리 파라미터
  const queryParams = useMemo(
    () => ({
      page: currentPage - 1,
      size: 10,
      sort: ["createdAt,desc"],
    }),
    [currentPage]
  );

  // TanStack Query 훅들
  const postsQuery = usePosts(queryParams, {
    enabled: !currentTag && !isInitialLoad,
    initialData: !currentTag && isInitialLoad ? initialData : undefined,
  });

  const postsByTagQuery = usePostsByTag(currentTag!, queryParams, {
    enabled: !!currentTag && !isInitialLoad,
    initialData: currentTag === initialTag && isInitialLoad ? initialData : undefined,
  });

  // 현재 사용할 데이터 결정
  const activeQuery = currentTag ? postsByTagQuery : postsQuery;
  const data = isInitialLoad ? initialData : activeQuery.data;
  const isLoading = !isInitialLoad && activeQuery.isLoading;
  const isFetching = activeQuery.isFetching;
  const error = activeQuery.error;

  const posts = data?.content || [];

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
      {/* 백그라운드 페칭 표시 */}
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

      {/* 게시글 목록 */}
      {!isLoading && (
        <div
          className={`mt-8 flex flex-col gap-8 transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}
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
      )}
    </>
  );
}
