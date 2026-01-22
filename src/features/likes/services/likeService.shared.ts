import "server-only";

import { serverApiFetchJson } from "@/lib/serverApiFetch";

/**
 * Like Service 팩토리 함수
 *
 * 서버 환경에서 사용 가능한 공통 로직을 제공합니다.
 *
 * @returns Like Service 객체
 */
export const createLikeService = () => {
  return {
    /**
     * 게시글에 좋아요를 추가합니다.
     *
     * @param postId - 게시글 ID
     */
    async addLike(postId: number): Promise<void> {
      await serverApiFetchJson(`/api/v1/likes/${postId}`, {
        method: "POST",
      });
    },

    /**
     * 게시글의 좋아요를 취소합니다.
     *
     * @param postId - 게시글 ID
     */
    async removeLike(postId: number): Promise<void> {
      await serverApiFetchJson(`/api/v1/likes/${postId}`, {
        method: "DELETE",
      });
    },

    /**
     * 사용자가 특정 게시글에 좋아요를 눌렀는지 확인합니다.
     *
     * @param postId - 게시글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안누름)
     */
    async checkLikeStatus(postId: number, options?: RequestInit): Promise<boolean> {
      const payload = await serverApiFetchJson<{ data?: boolean }>(
        `/api/v1/likes/${postId}/liked`,
        options
      );
      return payload.data ?? false;
    },
  };
};

/**
 * Like Service 타입
 */
export type LikeService = ReturnType<typeof createLikeService>;
