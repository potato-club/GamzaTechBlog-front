"use client";

/**
 * 게시글 댓글 섹션 컴포넌트
 *
 * TanStack Query를 사용하여 댓글 데이터를 효율적으로 관리합니다.
 * usePost 훅을 통해 게시글 상세 정보 (댓글 포함)를 가져오고,
 * 댓글 추가/삭제는 자동으로 캐시가 업데이트됩니다.
 */

import CommentList from "@/components/features/comments/CommentList";
import { CommentResponse } from "@/generated/api";
import { usePost } from "@/hooks/queries/usePostQueries";
import CommentForm from "../comments/CommentForm";

interface PostCommentsSectionProps {
  postId: number;
  initialComments?: CommentResponse[]; // 이제 선택사항 (TanStack Query가 관리)
}

export default function PostCommentsSection({
  postId,
  initialComments = [],
}: PostCommentsSectionProps) {
  /**
   * TanStack Query를 사용하여 게시글 상세 정보를 가져옵니다.
   *
   * 이 훅의 장점:
   * - 자동 캐싱: 동일한 게시글을 여러 컴포넌트에서 공유
   * - 백그라운드 갱신: 댓글 변경 시 자동으로 최신 데이터 동기화
   * - Optimistic Update: 댓글 추가/삭제 시 즉시 UI 반영
   * - 에러 처리: 네트워크 오류 시 자동 재시도
   */
  const { data: post, isLoading, error } = usePost(postId);

  // TanStack Query에서 가져온 데이터 우선 사용, 없으면 fallback 데이터 사용
  const comments = post?.comments || initialComments;

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <section className="mt-12 text-[17px] text-[#353841]" aria-label="댓글 섹션">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-xl bg-gray-100 px-6 py-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                </div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <section className="mt-12 text-[17px] text-[#353841]" aria-label="댓글 섹션">
        <h2 className="mt-7 text-lg font-semibold">댓글</h2>
        <div className="mt-4 text-center text-red-500">
          <p>댓글을 불러오는 중 오류가 발생했습니다.</p>
          <p className="mt-2 text-sm text-gray-500">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-4 mt-12 text-[17px] text-[#353841]" aria-label="댓글 섹션">
      {/* TanStack Query가 댓글 추가를 자동으로 처리하므로 onCommentSubmitted는 선택사항 */}
      <CommentForm postId={postId} />

      {/* TanStack Query가 댓글 삭제를 자동으로 처리하므로 onCommentDeleted는 선택사항 */}
      <CommentList comments={comments} variant="post" postId={postId} />
    </section>
  );
}
