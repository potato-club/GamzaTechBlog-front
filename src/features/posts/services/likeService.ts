import { apiClient } from "@/lib/apiClient";

/**
 * 클라이언트 환경에서 사용하는 Like Service
 * 브라우저에서 좋아요 관련 작업을 수행합니다.
 *
 * Note: apiClient를 모듈 레벨에서 import하지만,
 * 실제 사용은 함수 내부에서만 이루어지므로 순환 참조가 발생하지 않습니다.
 */
export const likeService = {
  /**
   * 게시글에 좋아요를 추가합니다.
   *
   * @param postId - 게시글 ID
   */
  async addLike(postId: number): Promise<void> {
    await apiClient.likePost({ postId });
  },

  /**
   * 게시글의 좋아요를 취소합니다.
   *
   * @param postId - 게시글 ID
   */
  async removeLike(postId: number): Promise<void> {
    await apiClient.unlikePost({ postId });
  },

  /**
   * 사용자가 특정 게시글에 좋아요를 눌렀는지 확인합니다.
   *
   * @param postId - 게시글 ID
   * @param options - fetch 옵션 (캐싱, revalidate 등)
   * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안누름)
   */
  async checkLikeStatus(postId: number, options?: RequestInit): Promise<boolean> {
    const response = await apiClient.isPostLiked({ postId }, options);
    return response.data as boolean;
  },
} as const;
