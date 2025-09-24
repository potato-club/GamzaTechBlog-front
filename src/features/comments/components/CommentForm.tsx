"use client";

/**
 * 댓글 작성 폼 컴포넌트
 *
 * TanStack Query의 useMutation을 사용하여 댓글 등록을 처리합니다.
 * Optimistic Update를 통해 서버 응답 전에 UI를 먼저 업데이트하여
 * 더 빠른 사용자 경험을 제공합니다.
 */

import { Button } from "@/components/ui/button";
import { UI_CONSTANTS } from "@/constants/ui";
import { useCreateComment } from "@/features/comments";
import { CommentResponse, UserProfileResponse } from "@/generated/api";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { FormEvent, useCallback, useState } from "react";

interface CommentFormProps {
  postId: number;
  onCommentSubmitted?: (newComment: CommentResponse) => void; // 이제 선택사항 (TanStack Query가 자동 처리)
  userProfile?: UserProfileResponse | null | undefined; // 선택적 prop으로 변경 (하위 호환성)
}

export default function CommentForm({ postId, onCommentSubmitted, userProfile }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");
  // Zustand 로직 제거됨 - const { user, isAuthenticated } = useAuth();
  // const isLoggedIn = isAuthenticated && !!user;
  // const user = null; // 임시로 null로 설정
  // const isAuthenticated = false; // 임시로 false로 설정

  const { isLoggedIn } = useAuth();

  // userProfile prop이 제공되지 않으면 Zustand 스토어에서 가져옴 - Zustand 로직 제거됨
  // const currentUserProfile = userProfile ?? user;
  const currentUserProfile = userProfile ?? null; // 임시로 null로 설정

  // 이미지 URL 가져오기 함수 - 메모이제이션 적용
  const getUserImageUrl = useCallback(() => {
    if (!currentUserProfile) return "/profileSVG.svg";
    // UserProfileResponse 타입인 경우
    if ("profileImageUrl" in currentUserProfile) {
      return currentUserProfile.profileImageUrl || "/profileSVG.svg";
    }
    return "/profileSVG.svg";
  }, [currentUserProfile]);

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

    // 인증되지 않은 사용자 체크
    if (!isLoggedIn) {
      alert(UI_CONSTANTS.FORMS.VALIDATION_MESSAGES.REQUIRED_LOGIN);
      return;
    }

    if (!newComment.trim()) {
      alert(UI_CONSTANTS.FORMS.VALIDATION_MESSAGES.REQUIRED_COMMENT);
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
      console.error("댓글 등록 중 오류:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로그인하지 않은 사용자를 위한 UI
  if (!isLoggedIn) {
    return (
      <div className="mt-4 rounded-xl border border-[#E7EEFE] px-6 py-8 text-center">
        <p className="text-sm text-gray-600">댓글을 작성하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="댓글 작성">
      <div className="flex flex-col items-start gap-3 md:flex-row">
        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={getUserImageUrl()}
              alt={UI_CONSTANTS.ACCESSIBILITY.CURRENT_USER_PROFILE_ALT}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-[14px] font-medium text-[#1C222E] md:hidden">
            {currentUserProfile?.nickname || "사용자"}
          </span>
        </div>
        <textarea
          id="comment-input"
          placeholder={UI_CONSTANTS.FORMS.PLACEHOLDERS.COMMENT}
          className="min-h-[80px] w-full resize-none rounded-xl border border-[#E7EEFE] px-5 py-3.5 text-sm text-gray-800 transition focus:ring-2 focus:ring-[#FAA631]/50 focus:outline-none"
          aria-required="true"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={createCommentMutation.isPending} // TanStack Query 로딩 상태 사용
        />
      </div>
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          className="w-full rounded-[63px] bg-[#20242B] px-3 py-1.5 text-[12px] text-white hover:bg-[#1C222E] md:w-auto"
          disabled={createCommentMutation.isPending || !newComment.trim()}
        >
          {createCommentMutation.isPending
            ? UI_CONSTANTS.FORMS.BUTTONS.COMMENT_LOADING
            : UI_CONSTANTS.FORMS.BUTTONS.COMMENT_SUBMIT}
        </Button>
      </div>
    </form>
  );
}
