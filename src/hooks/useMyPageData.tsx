import type { MyPageData } from "@/types/mypage";
import { useMemo } from "react";

export function useMyPageData(): MyPageData {
  return useMemo(() => ({
    posts: [
      {
        postId: 1,
        title: "제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다",
        contentSnippet: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima aperiam animi libero quae sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!",
        writer: "GyeongHwan Lee",
        createdAt: "2025-06-12T03:34:18.808237",
        tags: ["# java", "# spring", "# backend"],
      },
      {
        postId: 2,
        title: "Next.js로 무한스크롤 구현하기",
        contentSnippet: "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
        writer: "Jinwoo Park",
        createdAt: "2025-04-27T00:00:00.000Z",
        tags: ["# nextjs", "# react", "# frontend"],
      },
    ],
    comments: [
      {
        commentId: 1,
        writer: "GyeongHwan Lee",
        content: "첫 댓글 달아봤습니다 하하.",
        createdAt: "2025-04-28T00:00:00.000Z",
        replies: ["첫 번째 답글입니다!", "두 번째 답글입니다!"],
      },
      {
        commentId: 2,
        writer: "Jinwoo Park",
        content: "좋은 글 감사합니다! Next.js에 대해 더 배우고 싶어요.",
        createdAt: "2025-04-27T00:00:00.000Z",
        replies: ["세 번째 답글입니다!", "네 번째 답글입니다!"],
      },
    ],
    likes: [
      {
        id: 1,
        title: "좋아요 누른 게시글 제목",
        contentSnippet: "와우 좋아요 누른 게시글 내용이에용용",
        writer: "GyeongHwan Lee",
        createdAt: "2025-04-27T00:00:00.000Z",
        tags: ["# java", "# spring", "# backend"],
      },
      {
        id: 2,
        title: "Next.js로 무한스크롤 구현하기",
        contentSnippet: "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
        writer: "Jinwoo Park",
        createdAt: "2025-04-27T00:00:00.000Z",
        tags: ["# nextjs", "# react", "# frontend"],
      },
    ],
  }), []);
}