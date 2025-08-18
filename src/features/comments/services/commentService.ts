import {
  CommentRequest,
  CommentResponse,
  Pageable,
  PagedResponseCommentListResponse,
} from "@/generated/api/models";
import { apiClient } from "@/lib/apiClient";

export const commentService = {
  async registerComment(postId: number, content: CommentRequest): Promise<CommentResponse> {
    const response = await apiClient.addComment({
      postId,
      commentRequest: content,
    });
    return response.data as CommentResponse;
  },

  async deleteComment(commentId: number): Promise<void> {
    await apiClient.deleteComment({ commentId });
  },

  async getUserComments(params?: Pageable): Promise<PagedResponseCommentListResponse> {
    const response = await apiClient.getMyComments(params);
    return response.data as PagedResponseCommentListResponse;
  },
};
