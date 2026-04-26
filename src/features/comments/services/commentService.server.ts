import "server-only";

import type { CommentRequest, CommentResponse, Pageable } from "@/generated/api";
import type { PagedResponseCommentListResponse } from "@/generated/api/models";
import { createBackendApiClient } from "@/lib/serverApiClient";
import { unwrapData } from "@/lib/unwrapData";

/**
 * 서버 환경에서 사용할 Comment Service 생성
 *
 * Next.js Server Components, Server Actions, Route Handlers에서 사용합니다.
 */
export const createCommentServiceServer = () => {
  const api = createBackendApiClient();

  return {
    async registerComment(postId: number, content: CommentRequest): Promise<CommentResponse> {
      const response = await api.addComment({
        postId,
        commentRequest: content,
      });
      return unwrapData(response);
    },

    async deleteComment(commentId: number): Promise<void> {
      await api.deleteComment({ commentId });
    },

    async getUserComments(
      params?: Pageable,
      options?: RequestInit
    ): Promise<PagedResponseCommentListResponse> {
      const response = await api.getMyComments(params, options);
      return unwrapData(response);
    },
  };
};

export type CommentService = ReturnType<typeof createCommentServiceServer>;
