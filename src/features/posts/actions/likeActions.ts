"use server";

import { createLikeServiceServer } from "@/features/posts/services/likeService.server";
import { postCacheInvalidation } from "@/features/posts/utils/cacheInvalidation";

/**
 * Server Action: add like to a post.
 *
 * @param postId - Target post ID
 */
export async function addLikeAction(postId: number): Promise<void> {
  const likeService = createLikeServiceServer();
  await likeService.addLike(postId);
  postCacheInvalidation.invalidateDetail(postId);
}

/**
 * Server Action: remove like from a post.
 *
 * @param postId - Target post ID
 */
export async function removeLikeAction(postId: number): Promise<void> {
  const likeService = createLikeServiceServer();
  await likeService.removeLike(postId);
  postCacheInvalidation.invalidateDetail(postId);
}
