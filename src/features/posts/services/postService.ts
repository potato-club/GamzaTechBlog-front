import type { PostResponse } from "@/generated/api";
import { apiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

// `PostResponse`에 `likeId`를 추가한 타입
export type LikedPostResponse = PostResponse & { likeId: number };

/**
 * 클라이언트 컴포넌트용 Post Service
 *
 * - 자동 토큰 재발급
 * - 요청 큐잉
 * - React Query와 함께 사용
 *
 * @example
 * ```tsx
 * 'use client';
 * import { postService } from "@/features/posts";
 *
 * const { data: posts } = useQuery({
 *   queryKey: ['posts'],
 *   queryFn: () => postService.getPosts({ page: 0, size: 10 })
 * });
 * ```
 */
export const postService = createPostService(apiClient);
