import { API_CONFIG } from "@/config/api";
import { API_PATHS } from "@/constants/apiPaths";
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
    const endpoint = API_PATHS.likes.like(postId);
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
    const endpoint = API_PATHS.likes.like(postId);
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'DELETE'
    }) as Response;

    if (!response.ok) {
      throw new LikeError(response.status, 'Failed to remove like', endpoint);
    }
  },

  /**
   * 사용자가 특정 게시글에 좋아요를 눌렀는지 확인합니다.
   * @param postId - 게시글 ID
   * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안누름)
   */
  async checkLikeStatus(postId: number): Promise<boolean> {
    const endpoint = API_PATHS.likes.status(postId);
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'GET'
    }) as Response;

    if (!response.ok) {
      throw new LikeError(response.status, 'Failed to check like status', endpoint);
    }

    const result = await response.json();
    return result.data; // API 응답의 data 필드에서 true/false 값 반환
  }
} as const;

