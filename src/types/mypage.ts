export type TabType = "posts" | "comments" | "likes";

export interface Post {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
  tags: string[];
}

export interface Comment {
  id: number;
  comment: string;
  author: string;
  date: string;
}

export interface Like {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
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