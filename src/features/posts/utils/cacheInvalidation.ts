import { revalidatePath, revalidateTag } from "next/cache";

/**
 * 게시글 관련 캐시 무효화 전략
 *
 * 단일 책임: 캐시 무효화 로직만 담당
 * 재사용성: 여러 액션에서 공통 사용
 * 테스트 용이성: 독립적인 유틸 함수
 */
export const postCacheInvalidation = {
  invalidateList() {
    revalidatePath("/");
    revalidatePath("/posts");
    revalidateTag("posts-list");
  },

  /**
   * 특정 게시글 상세 캐시 무효화
   *
   * @param postId - 무효화할 게시글 ID
   */
  invalidateDetail(postId: number) {
    revalidatePath(`/posts/${postId}`);
    revalidateTag(`post-${postId}`);
  },

  /**
   * 모든 게시글 관련 캐시 무효화
   *
   * 전체 게시글 데이터가 영향받는 경우 사용
   */
  invalidateAll() {
    this.invalidateList();
    revalidateTag("posts");
  },

  /**
   * 특정 게시글과 목록 캐시 무효화
   *
   * 게시글 수정/삭제 시 해당 게시글과 목록 모두 무효화
   *
   * @param postId - 무효화할 게시글 ID
   */
  invalidatePostAndList(postId: number) {
    this.invalidateDetail(postId);
    this.invalidateList();
  },
} as const;
