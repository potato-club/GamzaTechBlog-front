/**
 * 간단한 권한 체크 유틸리티
 *
 * 프로젝트 규모에 적합한 간단한 권한 체크 함수들을 제공합니다.
 */

import type { UserProfileResponse } from "@/generated/api/models";

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
 * 사용자가 특정 게시글을 수정할 수 있는지 확인
 * 관리자이거나 게시글 작성자 본인인 경우
 */
export function canEditPost(
  userProfile: UserProfileResponse | null | undefined,
  postWriter: string
): boolean {
  if (!userProfile) return false;
  return isAdmin(userProfile) || userProfile.nickname === postWriter;
}

/**
 * 사용자가 특정 댓글을 수정/삭제할 수 있는지 확인
 * 관리자이거나 댓글 작성자 본인인 경우
 */
export function canManageComment(
  userProfile: UserProfileResponse | null | undefined,
  commentAuthor: string
): boolean {
  if (!userProfile) return false;
  return isAdmin(userProfile) || userProfile.nickname === commentAuthor;
}

/**
 * 사용자가 게시글을 작성할 수 있는지 확인
 * 인증된 사용자인 경우 (PRE_REGISTER 제외)
 */
export function canCreatePost(userProfile: UserProfileResponse | null | undefined): boolean {
  return isAuthenticated(userProfile) && userProfile?.role !== "PRE_REGISTER";
}