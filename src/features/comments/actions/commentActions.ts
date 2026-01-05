"use server";

import type { CommentRequest, CommentResponse } from "@/generated/api";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import { createCommentServiceServer } from "../services/commentService.server";

/**
 * Server Action: create a comment.
 *
 * @param postId - Target post ID
 * @param commentRequest - Comment payload
 * @returns Created comment
 */
export async function createCommentAction(
  postId: number,
  commentRequest: CommentRequest
): Promise<CommentResponse> {
  const commentService = createCommentServiceServer();
  const comment = await commentService.registerComment(postId, commentRequest);

  postCacheInvalidation.invalidateDetail(postId);

  return comment;
}

/**
 * Server Action: delete a comment.
 *
 * @param postId - Target post ID
 * @param commentId - Comment ID to delete
 */
export async function deleteCommentAction(postId: number, commentId: number): Promise<void> {
  const commentService = createCommentServiceServer();
  await commentService.deleteComment(commentId);

  postCacheInvalidation.invalidateDetail(postId);
}
