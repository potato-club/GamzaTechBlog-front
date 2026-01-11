"use client";

/**
 * 게시글 댓글 섹션 컴포넌트
 *
 * RSC에서 전달된 초기 댓글을 렌더링하고
 * 댓글 추가/삭제 시 router.refresh로 최신 데이터를 다시 가져옵니다.
 */

import { CommentForm, CommentList } from "@/features/comments";
import type { CommentResponse } from "@/generated/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface PostCommentsSectionProps {
  postId: number;
  initialComments?: CommentResponse[];
}

export default function PostCommentsSection({
  postId,
  initialComments = [],
}: PostCommentsSectionProps) {
  const router = useRouter();
  const { userProfile } = useAuth();
  const comments = initialComments || [];

  const refreshComments = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <section className="my-12 text-[17px] text-[#353841]" aria-label="댓글 섹션">
      {/* TanStack Query가 댓글 추가를 자동으로 처리하므로 onCommentSubmitted는 선택사항 */}
      <CommentForm
        postId={postId}
        userProfile={userProfile}
        onCommentSubmitted={refreshComments}
      />

      {/* TanStack Query가 댓글 삭제를 자동으로 처리하므로 onCommentDeleted는 선택사항 */}
      <CommentList
        comments={comments}
        variant="post"
        postId={postId}
        onCommentDeleted={refreshComments}
      />
    </section>
  );
}
