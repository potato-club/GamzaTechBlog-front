/**
 * 마이페이지 게시글 탭 컴포넌트
 *
 * 사용자가 작성한 게시글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import CustomPagination from "@/components/shared/navigation/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "@/features/posts";
import { useMyPosts } from "@/features/user";
import { PostDetailResponse } from "@/generated/api";
import { usePagination } from "@/hooks/usePagination";
import ErrorDisplay from "../shared/ErrorDisplay";

export default function PostsTab() {
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 5;

  const {
    data: postsData,
    isLoading,
    error,
  } = useMyPosts({
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  const posts = (postsData?.content as PostDetailResponse[]) || [];
  const totalPages = postsData?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col gap-8">
        {/* 게시글 로딩 스켈레톤 */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }
  // 에러 상태
  if (error) {
    return <ErrorDisplay title="게시글을 불러올 수 없습니다" error={error} />;
  }
  // 빈 상태
  if (posts.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="mb-4 text-gray-400">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="mb-2 text-lg text-gray-500">작성한 게시글이 없습니다</p>
        <p className="text-sm text-gray-400">첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  // 게시글 목록 표시
  return (
    <div className="mt-8 flex flex-col gap-8">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage} // 이미 1부터 시작하는 값
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </div>
  );
}
