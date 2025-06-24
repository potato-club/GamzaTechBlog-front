import { API_CONFIG } from "../config/api";
import { fetchWithAuth } from "../lib/api";
import { ApiResponse, ApiResponseWrapper, PageableContent, PaginationParams } from "../types/api";
import { CommentData, MyCommentData } from "../types/comment";


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

  async getUserComments(params?: PaginationParams): Promise<PageableContent<MyCommentData>> {
    const endpoint = `/api/v1/comment/me/comments`;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append('page', String(params.page));
    if (params?.size !== undefined) url.searchParams.append('size', String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append('sort', sort));

    try {
      const response = await fetchWithAuth(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user comments' }));
        throw new CommentServiceError(response.status, errorData.message || 'Failed to fetch user comments', endpoint);
      }

      const apiResponse: ApiResponseWrapper<PageableContent<MyCommentData>> = await response.json();
      return apiResponse.data;
    } catch (error) {
      if (error instanceof CommentServiceError) {
        throw error;
      }
      throw new CommentServiceError(500, (error as Error).message || 'An unexpected error occurred while fetching user comments', endpoint);
    }
  }
};