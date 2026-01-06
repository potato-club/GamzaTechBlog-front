import { createServerApiClient } from "@/lib/apiClient";
import { createCommentService } from "./commentService.shared";

/**
 * 서버 환경에서 사용할 Comment Service 생성
 *
 * Next.js Server Components, Server Actions, Route Handlers에서 사용합니다.
 * 서버 전용 API 클라이언트를 주입하여 환경에 맞는 Service 인스턴스를 반환합니다.
 *
 * @returns Comment Service 인스턴스
 *
 * @example
 * // Server Component에서 사용
 * const commentService = createCommentServiceServer();
 * const comments = await commentService.getUserComments();
 */
export const createCommentServiceServer = () => {
  return createCommentService(createServerApiClient());
};
