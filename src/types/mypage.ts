import type { CommentResponse, PostResponse } from "@/generated/api";

export type TabType = "posts" | "comments" | "likes";

/**
 * 사용자가 좋아요 한 게시글의 타입
 * PostResponse에 좋아요 ID(likeId)가 추가된 형태입니다.
 */
export type LikedPost = PostResponse & { likeId: number };

/**
 * 마이페이지에서 사용하는 데이터 타입 모음
 */
export interface MyPageData {
  posts: PostResponse[];
  comments: CommentResponse[];
  likes: LikedPost[];
}

export const VALID_TABS: TabType[] = ["posts", "comments", "likes"];

export const isValidTab = (tab: string): tab is TabType => {
  return VALID_TABS.includes(tab as TabType);
};