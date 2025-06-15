"use client";

import { Button } from "@/components/ui/button";
import { commentService } from "@/services/commentService";
import { CommentData } from "@/types/comment";
import Image from 'next/image';
import { FormEvent, useState } from "react";

interface CommentFormProps {
  postId: number;
  onCommentSubmitted: (newComment: CommentData) => void;
  // 현재 사용자 프로필 이미지 URL을 prop으로 받을 수 있습니다.
  // currentUserProfileImageUrl?: string; 
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onCommentSubmitted(createdComment); // 부모에게 생성된 댓글 전달
      setNewComment(""); // 입력 필드 초기화
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="댓글 작성">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          {/* 실제 사용자 프로필 이미지로 교체 필요 */}
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
  );
}