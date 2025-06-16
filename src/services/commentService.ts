import { API_CONFIG } from "../config/api";
import { fetchWithAuth } from "../lib/api";
import { ApiResponse } from "../types/api";
import { CommentData } from "../types/comment";

// --- 커스텀 에러 클래스 ---
export class CommentServiceError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'CommentServiceError';
  }
}

export const commentService = {

  async registerComment(postId: number, content: object): Promise<CommentData> {
    const endpoint = `/api/v1/comment/${postId}/comments`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    }) as Response;

    if (!response.ok) {
      throw new Error('Failed to register comment');
    }

    const apiResponse: ApiResponse<CommentData> = await response.json();

    console.log("apiResponse.data", apiResponse.data);

    return apiResponse.data;
  },

  // // editComment, 댓글 수정 api 작성
  // async editComment(postId: number, content: object): Promise<CommentData> {
  //   const endpoint = `/api/v1/comment/${postId}/comments`;
  //   const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(content),
  //   }) as Response;

  //   if (!response.ok) {
  //     throw new Error('Failed to register comment');
  //   }

  //   const apiResponse: ApiResponse<CommentData> = await response.json();

  //   console.log("apiResponse.data", apiResponse.data);

  //   return apiResponse.data;
  // },

  async deleteComment(commentId: number): Promise<void> {
    const endpoint = `/api/v1/comment/${commentId}`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'DELETE',
    }) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to delete comment ${commentId}` }));
      throw new CommentServiceError(response.status, errorData.message || `Failed to delete comment ${commentId}`, endpoint);
    }
  },
};