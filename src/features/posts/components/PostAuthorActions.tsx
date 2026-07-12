"use client";

import { useAuth } from "@/hooks/useAuth";
import { canEditPost } from "@/lib/auth";
import { PostActionsDropdown } from "./PostActionsDropdown";

interface PostAuthorActionsProps {
  postId: number;
  postWriter: string;
}

/**
 * 게시글 수정/삭제 액션의 클라이언트 게이팅
 *
 * 작성자 판별은 요청자별(개인화) 로직이라 서버 렌더에서 계산하면 상세 라우트가 정적화되지 못한다.
 * 그래서 판별을 렌더 이후 클라이언트로 분리하고, 인증 상태는 AuthProvider 부트스트랩 값을 재사용한다
 * (별도 네트워크 조회 불필요).
 *
 * 판별 전에는 버튼과 동일 크기의 invisible placeholder로 자리를 예약해 CLS를 방지한다.
 */
export default function PostAuthorActions({ postId, postWriter }: PostAuthorActionsProps) {
  const { userProfile, isLoading } = useAuth();

  if (isLoading) {
    return <div data-testid="post-actions-placeholder" aria-hidden className="ml-auto h-8 w-8" />;
  }

  if (!canEditPost(userProfile, postWriter)) {
    return null;
  }

  return <PostActionsDropdown postId={postId} />;
}
