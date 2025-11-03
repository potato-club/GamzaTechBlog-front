import type { PostRequest } from "@/generated/api";

/**
 * Server Action 결과 타입
 *
 * 성공/실패를 명확히 구분하여 타입 안전성 확보
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * 게시글 생성 입력
 */
export interface CreatePostInput {
  postData: PostRequest;
}

/**
 * 게시글 수정 입력
 */
export interface UpdatePostInput {
  postId: number;
  postData: PostRequest;
}

/**
 * 게시글 삭제 입력
 */
export interface DeletePostInput {
  postId: number;
}
