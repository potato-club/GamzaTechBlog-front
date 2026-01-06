import { createServerApiClient } from "@/lib/apiClient";
import { createLikeService } from "./likeService.shared";

/**
 * 서버 환경에서 사용할 Like Service 생성
 *
 * Next.js Server Components, Server Actions, Route Handlers에서 사용합니다.
 * 서버 전용 API 클라이언트를 주입하여 환경에 맞는 Service 인스턴스를 반환합니다.
 *
 * @returns Like Service 인스턴스
 *
 * @example
 * // Server Component에서 사용
 * const likeService = createLikeServiceServer();
 * const isLiked = await likeService.checkLikeStatus(postId);
 */
export const createLikeServiceServer = () => {
  return createLikeService(createServerApiClient());
};
