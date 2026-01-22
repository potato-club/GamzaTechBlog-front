/**
 * 간단한 권한 체크 유틸리티
 *
 * 프로젝트 규모에 적합한 간단한 권한 체크 함수들을 제공합니다.
 */

import type { UserProfileResponse } from "@/generated/orval/models";

/**
 * 사용자가 관리자인지 확인
 */
export function isAdmin(userProfile: UserProfileResponse | null | undefined): boolean {
  return userProfile?.role === "ADMIN";
}

/**
 * 사용자가 인증된 상태인지 확인
 */
export function isAuthenticated(userProfile: UserProfileResponse | null | undefined): boolean {
  return !!userProfile;
}

/**
 * 사용자가 게시글의 실제 작성자인지 확인 (UI 표시용)
 * 관리자 권한을 무시하고 순수하게 작성자 본인인지만 확인
 */
export function isPostOwner(
  userProfile: UserProfileResponse | null | undefined,
  postWriter: string
): boolean {
  if (!userProfile) return false;
  // postWriter가 빈 문자열인 경우는 유효하지 않은 작성자로 간주
  if (!postWriter || postWriter.trim() === "") return false;
  return userProfile.nickname === postWriter;
}

/**
 * 사용자가 특정 게시글을 수정할 수 있는 권한이 있는지 확인 (API 호출용)
 * 관리자이거나 게시글 작성자 본인인 경우
 *
 * 주의: UI 표시에는 isPostOwner를 사용하세요.
 * 이 함수는 실제 수정/삭제 action 실행 전 권한 검증에 사용됩니다.
 */
export function canEditPost(
  userProfile: UserProfileResponse | null | undefined,
  postWriter: string
): boolean {
  if (!userProfile) return false;
  // postWriter가 빈 문자열인 경우는 유효하지 않은 작성자로 간주
  if (!postWriter || postWriter.trim() === "") return false;
  return isAdmin(userProfile) || userProfile.nickname === postWriter;
}

/**
 * 사용자가 댓글의 실제 작성자인지 확인 (UI 표시용)
 * 관리자 권한을 무시하고 순수하게 작성자 본인인지만 확인
 */
export function isCommentOwner(
  userProfile: UserProfileResponse | null | undefined,
  commentAuthor: string
): boolean {
  if (!userProfile) return false;
  // commentAuthor가 빈 문자열인 경우는 유효하지 않은 작성자로 간주
  if (!commentAuthor || commentAuthor.trim() === "") return false;
  return userProfile.nickname === commentAuthor;
}

/**
 * 사용자가 특정 댓글을 수정/삭제할 수 있는 권한이 있는지 확인 (API 호출용)
 * 관리자이거나 댓글 작성자 본인인 경우
 *
 * 주의: UI 표시에는 isCommentOwner를 사용하세요.
 * 이 함수는 실제 수정/삭제 action 실행 전 권한 검증에 사용됩니다.
 */
export function canManageComment(
  userProfile: UserProfileResponse | null | undefined,
  commentAuthor: string
): boolean {
  if (!userProfile) return false;
  // commentAuthor가 빈 문자열인 경우는 유효하지 않은 작성자로 간주
  if (!commentAuthor || commentAuthor.trim() === "") return false;
  return isAdmin(userProfile) || userProfile.nickname === commentAuthor;
}

/**
 * 사용자가 게시글을 작성할 수 있는지 확인
 * 인증된 사용자인 경우 (PRE_REGISTER 제외)
 */
export function canCreatePost(userProfile: UserProfileResponse | null | undefined): boolean {
  return isAuthenticated(userProfile) && userProfile?.role !== "PRE_REGISTER";
}
