import { apiClient } from "@/lib/apiClient";

export const likeService = {
  /**
   * 게시글에 좋아요를 추가합니다.
   * @param postId - 게시글 ID
   */
  async addLike(postId: number): Promise<void> {
    await apiClient.likePost({ postId });
  },

  /**
   * 게시글의 좋아요를 취소합니다.
   * @param postId - 게시글 ID
   */
  async removeLike(postId: number): Promise<void> {
    await apiClient.unlikePost({ postId });
  },

  /**
   * 사용자가 특정 게시글에 좋아요를 눌렀는지 확인합니다.
   * @param postId - 게시글 ID
   * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안누름)
   */
  async checkLikeStatus(postId: number): Promise<boolean> {
    const response = await apiClient.isPostLiked({ postId });
    return response.data as boolean;
  },
} as const;
