import { API_CONFIG } from "../config/api";
import { fetchWithAuth } from "../lib/api";
import { ApiResponse } from "../types/api";
import { CommentData } from "../types/comment";

export const commentService = {

  async registerComment(postId: number, content: object): Promise<CommentData> {
    const endpoint = `/api/v1/comment/${postId}/comments`;
    const response = await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error('Failed to register comment');
    }

    const apiResponse: ApiResponse<CommentData> = await response.json();

    console.log("apiResponse.data", apiResponse.data);

    return apiResponse.data;
  },

  // async addComment(postId: number, content: string): Promise<CommentData> {
  //   const response = await fetch(`/api/posts/${postId}/comments`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ content }),
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to add comment');
  //   }
  //   return response.json();
  // },

  // async deleteComment(postId: number, commentId: number): Promise<void> {
  //   const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
  //     method: 'DELETE',
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to delete comment');
  //   }
  // },
};