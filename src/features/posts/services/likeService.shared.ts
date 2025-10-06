import type { DefaultApi } from "@/generated/api";

/**
 * Like Service 팩토리 함수
 *
 * 클라이언트/서버 환경 모두에서 사용 가능한 공통 로직을 제공합니다.
 * API 클라이언트 인스턴스를 주입받아 환경에 독립적으로 동작합니다.
 *
 * @param api - DefaultApi 인스턴스 (클라이언트용 또는 서버용)
 * @returns Like Service 객체
 *
 * @example
 * // 클라이언트 환경
 * const likeService = createLikeService(apiClient);
 *
 * @example
 * // 서버 환경
 * const likeService = createLikeService(createServerApiClient());
 */
export const createLikeService = (api: DefaultApi) => {
  return {
    /**
     * 게시글에 좋아요를 추가합니다.
     *
     * @param postId - 게시글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     */
    async addLike(postId: number, options?: RequestInit): Promise<void> {
      await api.likePost({ postId }, options);
    },

    /**
     * 게시글의 좋아요를 취소합니다.
     *
     * @param postId - 게시글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     */
    async removeLike(postId: number, options?: RequestInit): Promise<void> {
      await api.unlikePost({ postId }, options);
    },

    /**
     * 사용자가 특정 게시글에 좋아요를 눌렀는지 확인합니다.
     *
     * @param postId - 게시글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안누름)
     */
    async checkLikeStatus(postId: number, options?: RequestInit): Promise<boolean> {
      const response = await api.isPostLiked({ postId }, options);
      return response.data as boolean;
    },
  };
};

/**
 * Like Service 타입
 */
export type LikeService = ReturnType<typeof createLikeService>;
