import "server-only";

import { createBackendApiClient } from "@/lib/serverApiClient";
import { unwrapData } from "@/lib/unwrapData";

/**
 * 서버 환경에서 사용할 Like Service 생성
 *
 * Next.js Server Components, Server Actions, Route Handlers에서 사용합니다.
 */
export const createLikeServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async addLike(postId: number): Promise<void> {
      await api.likePost({ postId });
    },

    async removeLike(postId: number): Promise<void> {
      await api.unlikePost({ postId });
    },

    async checkLikeStatus(postId: number, options?: RequestInit): Promise<boolean> {
      const response = await api.isPostLiked({ postId }, options);
      return unwrapData(response);
    },
  };
};

export type LikeService = ReturnType<typeof createLikeServiceServer>;
