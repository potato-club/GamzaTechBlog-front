import type {
  CommentRequest,
  CommentResponse,
  DefaultApi,
  Pageable,
  PagedResponseCommentListResponse,
} from "@/generated/api";

/**
 * Comment Service 팩토리 함수
 *
 * 클라이언트/서버 환경 모두에서 사용 가능한 공통 로직을 제공합니다.
 * API 클라이언트 인스턴스를 주입받아 환경에 독립적으로 동작합니다.
 *
 * @param api - DefaultApi 인스턴스 (클라이언트용 또는 서버용)
 * @returns Comment Service 객체
 *
 * @example
 * // 클라이언트 환경
 * const commentService = createCommentService(apiClient);
 *
 * @example
 * // 서버 환경
 * const commentService = createCommentService(createServerApiClient());
 */
export const createCommentService = (api: DefaultApi) => {
  return {
    /**
     * 댓글을 등록합니다.
     *
     * @param postId - 게시글 ID
     * @param content - 댓글 내용
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 생성된 댓글 정보
     */
    async registerComment(
      postId: number,
      content: CommentRequest,
      options?: RequestInit
    ): Promise<CommentResponse> {
      const response = await api.addComment(
        {
          postId,
          commentRequest: content,
        },
        options
      );
      return response.data as CommentResponse;
    },

    /**
     * 댓글을 삭제합니다.
     *
     * @param commentId - 댓글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     */
    async deleteComment(commentId: number, options?: RequestInit): Promise<void> {
      await api.deleteComment({ commentId }, options);
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
      const response = await api.getMyComments(params, options);
      return response.data as PagedResponseCommentListResponse;
    },
  };
};

/**
 * Comment Service 타입
 */
export type CommentService = ReturnType<typeof createCommentService>;
