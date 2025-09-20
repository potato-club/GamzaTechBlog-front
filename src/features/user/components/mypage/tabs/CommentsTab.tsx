/**
 * 댓글 탭 컴포넌트
 *
 * 사용자가 작성한 댓글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 * 마이페이지와 공개 프로필 페이지에서 공유하여 사용됩니다.
 *
 * @param isOwner - 현재 사용자가 프로필 소유자인지 여부
 * @param username - 조회할 사용자명 (공개 프로필용)
 */

import EmptyState from "@/components/shared/EmptyState";
import CustomPagination from "@/components/shared/navigation/CustomPagination";
import TabContentSkeleton from "@/components/shared/skeletons/TabContentSkeleton";
import { CommentList } from "@/features/comments";
import { useMyComments } from "@/features/user";
import { CommentResponse } from "@/generated/api";
import { usePagination } from "@/hooks/usePagination";
import ErrorDisplay from "../shared/ErrorDisplay";

interface CommentsTabProps {
  isOwner?: boolean;
  username?: string;
}

export default function CommentsTab({
  isOwner = true,
  username: _username, // eslint-disable-line @typescript-eslint/no-unused-vars
}: CommentsTabProps = {}) {
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 5;

  const {
    data: commentsData,
    isLoading,
    error,
  } = useMyComments({
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  const totalPages = commentsData?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용 (1부터 시작하는 페이지)
  };

  // 로딩 상태
  if (isLoading) {
    return <TabContentSkeleton count={3} variant="comment" />;
  }
  // 에러 상태
  if (error) {
    return (
      <ErrorDisplay
        title={isOwner ? "댓글을 불러올 수 없습니다" : "프로필 댓글을 불러올 수 없습니다"}
        error={error}
      />
    );
  }
  // 데이터 표시
  if (!commentsData || !commentsData.content || commentsData.content.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        }
        title={isOwner ? "작성한 댓글이 없습니다" : "공개된 댓글이 없습니다"}
        description={
          isOwner ? "다른 사용자의 게시글에 댓글을 달아보세요!" : "아직 공개된 댓글이 없습니다."
        }
      />
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
