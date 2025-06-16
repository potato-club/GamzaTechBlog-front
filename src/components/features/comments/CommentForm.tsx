"use client";

/**
 * 댓글 작성 폼 컴포넌트
 * 
 * TanStack Query의 useMutation을 사용하여 댓글 등록을 처리합니다.
 * Optimistic Update를 통해 서버 응답 전에 UI를 먼저 업데이트하여 
 * 더 빠른 사용자 경험을 제공합니다.
 */

import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/hooks/queries/useCommentQueries";
import { CommentData } from "@/types/comment";
import Image from 'next/image';
import { FormEvent, useState } from "react";

interface CommentFormProps {
  postId: number;
  onCommentSubmitted?: (newComment: CommentData) => void; // 이제 선택사항 (TanStack Query가 자동 처리)
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");

  /**
   * TanStack Query 뮤테이션을 사용한 댓글 등록
   * 
   * 이 훅은 다음 기능들을 자동으로 제공합니다:
   * - Optimistic Update: 서버 응답 전에 UI 즉시 업데이트
   * - 에러 처리: 실패 시 이전 상태로 자동 롤백
   * - 로딩 상태: isLoading을 통한 버튼 비활성화
   * - 캐시 갱신: 성공 시 관련 쿼리 자동 무효화
   */
  const createCommentMutation = useCreateComment(postId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    // TanStack Query 뮤테이션 실행
    try {
      const result = await createCommentMutation.mutateAsync({
        content: newComment.trim(),
        parentCommentId: undefined, // 현재는 최상위 댓글만 지원
      });

      // 성공 시 폼 초기화
      setNewComment("");

      // 기존 prop 콜백이 있다면 호출 (하위 호환성)
      if (onCommentSubmitted) {
        onCommentSubmitted(result);
      }

    } catch (error) {
      // 에러는 TanStack Query의 onError에서 이미 처리됨
      // 추가 사용자 피드백이 필요하면 여기에 추가
      console.error('댓글 등록 중 오류:', error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
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
          disabled={createCommentMutation.isPending} // TanStack Query 로딩 상태 사용
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] text-[12px]"
          disabled={createCommentMutation.isPending} // TanStack Query 로딩 상태 사용
        >
          {createCommentMutation.isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}