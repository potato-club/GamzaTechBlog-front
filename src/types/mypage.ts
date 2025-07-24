import { MyCommentData } from "./comment";
import { PostData } from "./post";

export type TabType = "posts" | "comments" | "likes";


export interface Like {
  id: number;
  title: string;
  contentSnippet: string;
  writer: string;
  createdAt: string;
  tags: string[];
}

export interface MyPageData {
  posts: PostData[];
  comments: MyCommentData[];
  likes: Like[];
}

export const VALID_TABS: TabType[] = ["posts", "comments", "likes"];

export const isValidTab = (tab: string): tab is TabType => {
  return VALID_TABS.includes(tab as TabType);
};