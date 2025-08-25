/**
 * 마이페이지 좋아요 탭 컴포넌트
 *
 * 사용자가 좋아요한 게시글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import EmptyState from "@/components/shared/EmptyState";
import CustomPagination from "@/components/shared/navigation/CustomPagination";
import TabContentSkeleton from "@/components/shared/skeletons/TabContentSkeleton";
import { PostCard } from "@/features/posts";
import { useMyLikes } from "@/features/user";
import { PostDetailResponse } from "@/generated/api";
import { usePagination } from "@/hooks/usePagination";
import ErrorDisplay from "../shared/ErrorDisplay";

export default function LikesTab() {
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 5;

  const {
    data: likes,
    isLoading,
    error,
  } = useMyLikes({
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  const likedPosts = (likes?.content as PostDetailResponse[]) || [];
  const totalPages = likes?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용
  };

  // 로딩 상태
  if (isLoading) {
    return <TabContentSkeleton count={3} variant="post" />;
  }

  // 에러 상태
  if (error) {
    return <ErrorDisplay title="좋아요 목록을 불러올 수 없습니다" error={error} />;
  }

  // 빈 상태
  if (likedPosts.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        }
        title="좋아요한 게시글이 없습니다"
        description="마음에 드는 게시글에 좋아요를 눌러보세요!"
      />
    );
  }
  // 좋아요 목록 표시
  return (
    <div className="mt-8 flex flex-col gap-8">
      {likedPosts.map((post: PostDetailResponse) => (
        <PostCard key={post.postId} post={post} />
      ))}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </div>
  );
}
