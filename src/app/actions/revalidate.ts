"use server";

import { revalidatePath } from "next/cache";

/**
 * 특정 게시글 페이지의 ISR 캐시를 무효화합니다.
 *
 * 사용 시점:
 * - 좋아요 추가/삭제
 * - 댓글 추가/삭제
 * - 게시글 수정
 *
 * Server Action이므로 클라이언트에서 호출해도 서버에서 실행됩니다.
 *
 * @param postId - 캐시를 무효화할 게시글 ID
 * @returns 성공 여부를 포함한 응답 객체
 */
export async function revalidatePostAction(postId: number) {
  try {
    revalidatePath(`/posts/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Revalidation error:", error);
    return { success: false, error };
  }
}
