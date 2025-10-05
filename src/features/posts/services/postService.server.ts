import { createServerApiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

/**
 * 서버 컴포넌트용 Post Service 팩토리
 *
 * - 각 요청마다 새로운 API 클라이언트 생성 (요청별 쿠키 컨텍스트)
 * - ISR/SSG와 호환
 * - 서버 환경에서만 동작
 *
 * @returns Post Service 인스턴스
 *
 * @example
 * ```tsx
 * // 서버 컴포넌트
 * import { createPostServiceServer } from "@/features/posts/services/postService.server";
 *
 * export default async function PostPage() {
 *   const postService = createPostServiceServer();
 *   const posts = await postService.getPosts({ page: 0, size: 10 });
 *
 *   return <div>{...}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // ISR 적용
 * const postService = createPostServiceServer();
 * const post = await postService.getPostById(
 *   postId,
 *   { next: { revalidate: 3600 } } // 1시간마다 재검증
 * );
 * ```
 */
export const createPostServiceServer = () => {
  return createPostService(createServerApiClient());
};
