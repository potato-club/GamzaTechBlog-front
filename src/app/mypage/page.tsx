"use client";

import { useState } from "react";
import CommentList from "../../components/CommentList";
import PostList from "../../components/mypage/PostList";
import Sidebar from "../../components/mypage/Sidebar";
import TabMenu from "../../components/mypage/TabMenu";

export default function MyPage() {
  const [tab, setTab] = useState("posts");

  const posts = [
    {
      id: 1,
      title: "제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다",
      summary:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima aperiam animi libero quae sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!",
      author: "GyeongHwan Lee",
      date: "2025. 04. 28",
      tags: ["# java", "# spring", "# backend"],
    },
    {
      id: 2,
      title: "Next.js로 무한스크롤 구현하기",
      summary:
        "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
      author: "Jinwoo Park",
      date: "2025. 04. 27",
      tags: ["# nextjs", "# react", "# frontend"],
    },
  ];

  const comments = [
    {
      id: 1,
      comment:
        "첫 댓글 달아봤습니다 하하.",
      author: "GyeongHwan Lee",
      date: "2025. 04. 28",
    },
    {
      id: 2,
      comment:
        "좋은 글 감사합니다! Next.js에 대해 더 배우고 싶어요.",
      author: "Jinwoo Park",
      date: "2025. 04. 27",
    },
  ];

  return (
    <main className="flex mt-20">
      <Sidebar />
      <section className="flex-1 ml-12">
        <TabMenu tab={tab} setTab={setTab} />
        {tab === "posts" ? (
          <PostList posts={posts} />
        ) : (
          <CommentList comments={comments} />
        )}
      </section>
    </main>
  );
}