export type TabType = "posts" | "comments" | "likes";

export interface Post {
  postId: number;
  title: string;
  contentSnippet: string;
  writer: string;
  createdAt: string;
  tags: string[];
}

export interface Comment {
  commentId: number;
  writer: string;
  content: string;
  createdAt: string;
  replies?: string[]; // 댓글에 대한 답글이 있을 수 있음
}

export interface Like {
  id: number;
  title: string;
  summary: string;
  author: string;
  createdAt: string;
  tags: string[];
}

export interface MyPageData {
  posts: Post[];
  comments: Comment[];
  likes: Like[];
}

export const VALID_TABS: TabType[] = ["posts", "comments", "likes"];

export const isValidTab = (tab: string): tab is TabType => {
  return VALID_TABS.includes(tab as TabType);
};