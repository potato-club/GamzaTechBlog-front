import { revalidateTag } from "next/cache";

/**
 * 텃밭인사(Intro) 관련 캐시 무효화 전략 (Tag 기반)
 *
 * 태그 설계:
 * - intros-list: 텃밭인사 목록
 */
export const introCacheInvalidation = {
  invalidateList() {
    revalidateTag("intros-list", "max");
  },
} as const;
