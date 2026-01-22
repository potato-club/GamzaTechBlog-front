import "server-only";

import type {
  CommentRequest,
  CommentResponse,
  Pageable,
  PagedResponseCommentListResponse,
} from "@/generated/orval/models";
import { serverApiFetchJson } from "@/lib/serverApiFetch";

/**
 * Comment Service 팩토리 함수
 *
 * 서버 환경에서 사용 가능한 공통 로직을 제공합니다.
 *
 * @returns Comment Service 객체
 */
export const createCommentService = () => {
  return {
    /**
     * 댓글을 등록합니다.
     *
     * @param postId - 게시글 ID
     * @param content - 댓글 내용
     * @returns 생성된 댓글 정보
     */
    async registerComment(postId: number, content: CommentRequest): Promise<CommentResponse> {
      const payload = await serverApiFetchJson<{ data?: CommentResponse }>(
        `/api/v1/comment/${postId}/comments`,
        {
          method: "POST",
          body: JSON.stringify(content),
        }
      );

      if (!payload.data) {
        throw new Error("Comment response data is missing.");
      }

      return payload.data;
    },

    /**
     * 댓글을 삭제합니다.
     *
     * @param commentId - 댓글 ID
     */
    async deleteComment(commentId: number): Promise<void> {
      await serverApiFetchJson(`/api/v1/comment/${commentId}`, {
        method: "DELETE",
      });
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
      const searchParams = new URLSearchParams();

      if (typeof params?.page === "number") {
        searchParams.set("page", params.page.toString());
      }
      if (typeof params?.size === "number") {
        searchParams.set("size", params.size.toString());
      }
      if (params?.sort?.length) {
        params.sort.forEach((sortKey) => {
          searchParams.append("sort", sortKey);
        });
      }

      const query = searchParams.toString();
      const payload = await serverApiFetchJson<{ data?: PagedResponseCommentListResponse }>(
        `/api/v1/comment/me/comments${query ? `?${query}` : ""}`,
        options
      );

      if (!payload.data) {
        throw new Error("Comment list response data is missing.");
      }

      return payload.data;
    },
  };
};

/**
 * Comment Service 타입
 */
export type CommentService = ReturnType<typeof createCommentService>;
