/**
* 마이페이지 좋아요 탭 컴포넌트
* 
* 사용자가 좋아요한 게시글 목록을 표시하며,
* 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
*/

import CustomPagination from "@/components/common/CustomPagination";
import PostCard from "@/components/features/posts/PostCard";
import ErrorDisplay from "@/components/mypage/shared/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyLikes } from "@/hooks/queries/useMyPageQueries";
import { usePagination } from "@/hooks/usePagination";

export default function LikesTab() {
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 2;

  const { data: likes, isLoading, error } = useMyLikes({
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  const likedPosts = likes?.content || [];
  const totalPages = likes?.totalPages || 0;
  const totalElements = likes?.totalElements || 0;

  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용
  };


  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 mt-8">
        {/* 좋아요 목록 로딩 스켈레톤 */}
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
    return (
      <ErrorDisplay
        title="좋아요 목록을 불러올 수 없습니다"
        error={error}
      />
    );
  }

  // 빈 상태
  if (likedPosts.length === 0) {
    return (
      <div className="text-center mt-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">좋아요한 게시글이 없습니다</p>
        <p className="text-gray-400 text-sm">마음에 드는 게시글에 좋아요를 눌러보세요!</p>
      </div>
    );
  }
  // 좋아요 목록 표시
  return (
    <div className="flex flex-col gap-8 mt-8">
      {likedPosts.map((like: any) => (
        <PostCard
          key={like.id}
          post={{
            ...like,
            postId: like.id // id를 postId로 매핑
          }}
          showLikeButton={false} // 마이페이지에서는 좋아요 버튼 숨김
        />
      ))}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-12"
      />
    </div>
  );
}
