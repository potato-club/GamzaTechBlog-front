"use client";

import CommentList from "@/components/features/comments/CommentList";
import { CommentData } from "@/types/comment";
import { useEffect, useState } from "react";
import CommentForm from "../comments/CommentForm";

interface PostCommentsSectionProps {
  postId: number;
  initialComments: CommentData[];
  totalCommentsCount: number;
}

export default function PostCommentsSection({ postId, initialComments, totalCommentsCount }: PostCommentsSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [commentsCount, setCommentsCount] = useState<number>(totalCommentsCount);

  useEffect(() => {
    setComments(initialComments);
    setCommentsCount(totalCommentsCount);
  }, [initialComments, totalCommentsCount]);

  const handleCommentSubmitted = (createdComment: CommentData) => {
    // API 응답에 따라 writer, createdAt 등을 설정해야 합니다.
    // CommentForm에서 이미 처리된 CommentData를 받습니다.
    const newUiComment: CommentData = {
      ...createdComment,
      createdAt: new Date(createdComment.createdAt).toLocaleDateString('ko-KR'), // 날짜 형식화
    };
    setComments((prevComments) => [...prevComments, newUiComment]);
    setCommentsCount(prevCount => prevCount + 1);
  };

  const handleCommentDeleted = (deletedCommentId: number) => {
    setComments((prevComments) => prevComments.filter(comment => comment.commentId !== deletedCommentId));
    setCommentsCount(prevCount => prevCount - 1);
    // 필요하다면 여기에 사용자에게 알림 (예: Toast 메시지)을 표시하는 로직을 추가할 수 있습니다.
  };

  return (
    <section className="mt-12 text-[#353841] text-[17px]" aria-label="댓글 섹션"> {/* mt-40에서 mt-12로 조정 */}
      <h2 className="mt-7 text-lg font-semibold">댓글 {commentsCount}개</h2>
      <CommentForm postId={postId} onCommentSubmitted={handleCommentSubmitted} />
      <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
    </section>
  );
}