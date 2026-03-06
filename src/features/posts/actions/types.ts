import type { PostRequest } from "@/generated/api";
export type { ActionResult } from "@/lib/actionResult";

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
