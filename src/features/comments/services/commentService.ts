import {
  CommentRequest,
  CommentResponse,
  Pageable,
  PagedResponseCommentListResponse,
} from "@/generated/api/models";
import { apiClient } from "@/lib/apiClient";

/**
 * 클라이언트 환경에서 사용하는 Comment Service
 * 브라우저에서 댓글 관련 작업을 수행합니다.
 *
 * Note: apiClient를 모듈 레벨에서 import하지만,
 * 실제 사용은 함수 내부에서만 이루어지므로 순환 참조가 발생하지 않습니다.
 */
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
