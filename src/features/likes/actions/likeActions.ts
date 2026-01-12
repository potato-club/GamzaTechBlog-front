"use server";

import { createLikeServiceServer } from "@/features/likes/services/likeService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";
import { withActionResult } from "@/lib/actionResult";

/**
 * Server Action: add like to a post.
 *
 * @param postId - Target post ID
 */
export const addLikeAction = withActionResult(async (postId: number): Promise<void> => {
  const likeService = createLikeServiceServer();
  await likeService.addLike(postId);
  postCacheInvalidation.invalidateDetail(postId);
});

/**
 * Server Action: remove like from a post.
 *
 * @param postId - Target post ID
 */
export const removeLikeAction = withActionResult(async (postId: number): Promise<void> => {
  const likeService = createLikeServiceServer();
  await likeService.removeLike(postId);
  postCacheInvalidation.invalidateDetail(postId);
});
