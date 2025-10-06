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
  /**
   * 댓글을 등록합니다.
   *
   * @param postId - 게시글 ID
   * @param content - 댓글 내용
   * @returns 생성된 댓글 정보
   */
  async registerComment(postId: number, content: CommentRequest): Promise<CommentResponse> {
    const response = await apiClient.addComment({
      postId,
      commentRequest: content,
    });
    return response.data as CommentResponse;
  },

  /**
   * 댓글을 삭제합니다.
   *
   * @param commentId - 댓글 ID
   */
  async deleteComment(commentId: number): Promise<void> {
    await apiClient.deleteComment({ commentId });
  },

  /**
   * 사용자가 작성한 댓글 목록을 조회합니다.
   *
   * @param params - 페이지네이션 파라미터
   * @param options - fetch 옵션 (캐싱, revalidate 등)
   * @returns 페이지네이션된 댓글 목록
   */
  async getUserComments(
    params?: Pageable,
    options?: RequestInit
  ): Promise<PagedResponseCommentListResponse> {
    const response = await apiClient.getMyComments(params, options);
    return response.data as PagedResponseCommentListResponse;
  },
};
