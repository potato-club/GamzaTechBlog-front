/**
 * 마이페이지 댓글 탭 컴포넌트
 *
 * 사용자가 작성한 댓글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import CommentList from "@/components/features/comments/CommentList";
import ErrorDisplay from "@/components/mypage/shared/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentResponse } from "@/generated/api";
import { useMyComments } from "@/hooks/queries/useMyPageQueries";
import { usePagination } from "@/hooks/usePagination";
import CustomPagination from "../../common/CustomPagination";

export default function CommentsTab() {
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 5;

  console.log("CommentsTab render - currentPage:", currentPage, "API page:", currentPageForAPI);

  const {
    data: commentsData,
    isLoading,
    error,
  } = useMyComments({
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  console.log("CommentsTab - commentsData:", commentsData);

  const totalPages = commentsData?.totalPages || 0;

  const handlePageChange = (page: number) => {
    console.log("Page change requested:", page, "Current page:", currentPage);
    setPage(page); // usePagination 훅의 setPage 사용 (1부터 시작하는 페이지)
    console.log("New currentPage will be:", page);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        {/* 댓글 로딩 스켈레톤 */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2 rounded-xl bg-gray-100 px-6 py-5">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }
  // 에러 상태
  if (error) {
    return <ErrorDisplay title="댓글을 불러올 수 없습니다" error={error} />;
  }
  // 데이터 표시
  if (!commentsData || !commentsData.content || commentsData.content.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="mb-4 text-gray-400">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="mb-2 text-lg text-gray-500">작성한 댓글이 없습니다</p>
        <p className="text-sm text-gray-400">다른 사용자의 게시글에 댓글을 달아보세요!</p>
      </div>
    );
  }

  // 새로운 통합 CommentList 사용 - variant='my'로 내 댓글 모드
  return (
    <>
      <CommentList
        comments={commentsData.content as CommentResponse[]}
        variant="my"
        className="mt-6"
      />
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage} // 이미 1부터 시작하는 값
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </>
  );
}
