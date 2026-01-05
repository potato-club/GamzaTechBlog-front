import type { PostResponse } from "@/generated/api";
import { apiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

// `PostResponse`에 `likeId`를 추가한 타입
export type LikedPostResponse = PostResponse & { likeId: number };

/**
 * 클라이언트 컴포넌트용 Post Service (read-only)
 *
 * - 공통 Post Service에서 읽기 메서드만 노출
 * - 쓰기 작업은 Server Action으로 제한
 */
const postServiceReadOnly = createPostService(apiClient);
const {
  getPosts,
  getPopularPosts,
  getPostsByTag,
  getTags,
  getPostById,
  getUserPosts,
  getUserLikes,
  searchPosts,
  getHomeFeed,
  getSidebarData,
} = postServiceReadOnly;

export const postService = {
  getPosts,
  getPopularPosts,
  getPostsByTag,
  getTags,
  getPostById,
  getUserPosts,
  getUserLikes,
  searchPosts,
  getHomeFeed,
  getSidebarData,
} as const;
