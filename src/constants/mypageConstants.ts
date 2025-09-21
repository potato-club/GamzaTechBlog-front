// src/constants/mypageConstants.ts

import { UserActivityResponse } from "../generated/api";

// 각 스탯 아이템의 정적 정보를 정의합니다.
export const MY_PAGE_STATS_DEFINITIONS = [
  {
    key: "writtenPostCount",
    icon: "/postIcon.svg",
    alt: "작성 글 아이콘",
    label: "작성 글",
  },
  {
    key: "writtenCommentCount",
    icon: "/commentIcon.svg",
    alt: "작성 댓글 아이콘",
    label: "작성 댓글",
  },
  {
    key: "likedPostCount",
    icon: "/likeIcon.svg",
    alt: "좋아요 아이콘",
    label: "좋아요",
  },
] as const; // as const로 타입 추론을 더 정확하게 만듭니다.

// StatItem 타입을 여기서 정의하거나, src/types/mypage.ts 등에서 가져올 수 있습니다.
export interface StatItem {
  icon: string;
  alt: string;
  label: string;
  count: number;
}

// 정적 정의와 동적 데이터를 조합해 최종 stats 배열을 만드는 생성 함수
export const createMyPageStats = (activityStats: UserActivityResponse | null): StatItem[] => {
  return MY_PAGE_STATS_DEFINITIONS.map((def) => ({
    ...def,
    // activityStats가 존재하고, 해당 키의 값이 있으면 그 값을 사용, 없으면 0
    count: activityStats?.[def.key as keyof UserActivityResponse] ?? 0,
  }));
};
