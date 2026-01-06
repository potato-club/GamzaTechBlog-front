"use server";

import type { CommentRequest, CommentResponse } from "@/generated/api";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import { createCommentServiceServer } from "../services/commentService.server";
import { withActionResult } from "@/lib/actionResult";

/**
 * Server Action: create a comment.
 *
 * @param postId - Target post ID
 * @param commentRequest - Comment payload
 * @returns Created comment
 */
export const createCommentAction = withActionResult(
  async (postId: number, commentRequest: CommentRequest): Promise<CommentResponse> => {
    const commentService = createCommentServiceServer();
    const comment = await commentService.registerComment(postId, commentRequest);

    postCacheInvalidation.invalidateDetail(postId);

    return comment;
  }
);

/**
 * Server Action: delete a comment.
 *
 * @param postId - Target post ID
 * @param commentId - Comment ID to delete
 */
export const deleteCommentAction = withActionResult(
  async (postId: number, commentId: number): Promise<void> => {
    const commentService = createCommentServiceServer();
    await commentService.deleteComment(commentId);

    postCacheInvalidation.invalidateDetail(postId);
  }
);
