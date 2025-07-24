import { API_CONFIG } from "@/config/api";
import { fetchWithAuth } from '@/lib/api';

export class LikeError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'LikeError';
  }
}

export const likeService = {
  /**
   * 게시글에 좋아요를 추가합니다.
   * @param postId - 게시글 ID
   */
  async addLike(postId: number): Promise<void> {
    const endpoint = `/api/v1/likes/${postId}`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST'
    }) as Response;

    if (!response.ok) {
      throw new LikeError(response.status, 'Failed to add like', endpoint);
    }
  },

  /**
   * 게시글의 좋아요를 취소합니다.
   * @param postId - 게시글 ID
   */
  async removeLike(postId: number): Promise<void> {
    const endpoint = `/api/v1/likes/${postId}`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'DELETE'
    }) as Response;

    if (!response.ok) {
      throw new LikeError(response.status, 'Failed to remove like', endpoint);
    }
  }
} as const;
