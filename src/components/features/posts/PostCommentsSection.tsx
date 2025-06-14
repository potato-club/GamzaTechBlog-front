"use client";

import CommentList from "@/components/features/comments/CommentList";
import { Button } from "@/components/ui/button";
import { commentService } from "@/services/commentService";
import { CommentData } from "@/types/comment";
import Image from 'next/image';
import { FormEvent, useEffect, useState } from "react";

interface PostCommentsSectionProps {
  postId: number;
  initialComments: CommentData[];
  totalCommentsCount: number;
}

export default function PostCommentsSection({ postId, initialComments, totalCommentsCount }: PostCommentsSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [commentsCount, setCommentsCount] = useState<number>(totalCommentsCount);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
    setCommentsCount(totalCommentsCount);
  }, [initialComments, totalCommentsCount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    const newCommentPayload = {
      content: newComment.trim(),
      parentCommentId: null, // 현재는 최상위 댓글만 지원
    };

    try {
      const createdComment: CommentData = await commentService.registerComment(postId, newCommentPayload);
      // API 응답에 따라 writer, createdAt 등을 설정해야 합니다.
      // 여기서는 임시로 클라이언트에서 생성합니다. 실제로는 서버 응답을 사용해야 합니다.
      const newUiComment: CommentData = {
        commentId: createdComment.commentId,
        writer: createdComment.writer || "작성자 정보 필요", // 실제 사용자 정보로 대체
        content: createdComment.content,
        createdAt: new Date(createdComment.createdAt).toLocaleDateString('ko-KR'),
        replies: createdComment.replies || [],
      };
      setComments((prevComments) => [...prevComments, newUiComment]);
      setCommentsCount(prevCount => prevCount + 1);
      setNewComment(""); // 입력 필드 초기화
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDeleted = (deletedCommentId: number) => {
    setComments((prevComments) => prevComments.filter(comment => comment.commentId !== deletedCommentId));
    setCommentsCount(prevCount => prevCount - 1);
    // 필요하다면 여기에 사용자에게 알림 (예: Toast 메시지)을 표시하는 로직을 추가할 수 있습니다.
  };

  return (
    <section className="mt-12 text-[#353841] text-[17px]" aria-label="댓글 섹션"> {/* mt-40에서 mt-12로 조정 */}
      <h2 className="mt-7 text-lg font-semibold">댓글 {commentsCount}개</h2>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="댓글 작성">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <Image src="/profileSVG.svg" alt="현재 사용자의 프로필 이미지" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <textarea
            id="comment-input"
            placeholder="댓글을 남겨주세요."
            className="border border-[#E7EEFE] rounded-xl w-full px-5 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FAA631]/50 transition resize-none min-h-[80px]"
            aria-required="true"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] text-[12px]" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "등록"}
          </Button>
        </div>
      </form>

      <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
    </section>
  );
}