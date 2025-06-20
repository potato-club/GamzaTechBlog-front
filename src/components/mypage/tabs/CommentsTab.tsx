/**
 * 마이페이지 댓글 탭 컴포넌트
 * 
 * 사용자가 작성한 댓글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import CommentList from "@/components/features/comments/CommentList";
import ErrorDisplay from "@/components/mypage/shared/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComments } from "@/hooks/queries/useMyPageQueries";
import { CommentData } from "@/types/comment";

export default function CommentsTab() {
  const { data: comments = [], isLoading, error } = useMyComments();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        {/* 댓글 로딩 스켈레톤 */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-xl px-6 py-5 space-y-2">
            <Skeleton className="h-4 w-1/4" />
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
        title="댓글을 불러올 수 없습니다"
        error={error}
      />
    );
  }

  // 데이터 표시
  if (comments.length === 0) {
    return (
      <div className="text-center mt-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">작성한 댓글이 없습니다</p>
        <p className="text-gray-400 text-sm">다른 사용자의 게시글에 댓글을 달아보세요!</p>
      </div>
    );
  }

  // 마이페이지 댓글 목록은 특정 postId가 없으므로 임시로 0을 전달
  // TODO: 댓글 목록 컴포넌트를 마이페이지용으로 별도 생성하거나 
  //       postId를 옵셔널로 변경하는 것을 고려
  return <CommentList comments={comments as CommentData[]} postId={0} />;
}
