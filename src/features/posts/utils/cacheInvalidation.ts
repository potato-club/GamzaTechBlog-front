import { revalidateTag } from "next/cache";

/**
 * 게시글 관련 캐시 무효화 전략 (Tag 기반 통일)
 *
 * 태그 설계:
 * - posts-list: 게시글 목록 (홈, 태그별 목록)
 * - post-${id}: 개별 게시글 상세
 * - posts-popular: 인기 게시글
 * - tags: 태그 목록
 *
 * Next.js 16 변경사항:
 * - revalidateTag는 두 번째 인자 필요 (profile)
 * - "max" 프로필 사용: stale-while-revalidate (SWR) 방식
 */
export const postCacheInvalidation = {
  invalidateList() {
    revalidateTag("posts-list", "max");
  },

  invalidateDetail(postId: number) {
    revalidateTag(`post-${postId}`, "max");
  },

  invalidatePopular() {
    revalidateTag("posts-popular", "max");
  },

  invalidateTags() {
    revalidateTag("tags", "max");
  },

  invalidateSidebar() {
    this.invalidatePopular();
    this.invalidateTags();
  },

  invalidateAll() {
    this.invalidateList();
    this.invalidateSidebar();
    revalidateTag("posts", "max");
  },

  invalidatePostAndList(postId: number) {
    this.invalidateDetail(postId);
    this.invalidateList();
    this.invalidateSidebar();
  },
} as const;
