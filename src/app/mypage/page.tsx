"use client";

import CommentList from "@/components/CommentList";
import PostList from "@/components/mypage/PostList";
import Sidebar from "@/components/mypage/Sidebar";
import TabMenu from "@/components/mypage/TabMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import LikeList from "../../components/mypage/LikeList";

type TabType = "posts" | "comments" | "likes";

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = useMemo(() => {
    const tab = searchParams.get('tab') as TabType;
    return ['posts', 'comments', 'likes'].includes(tab) ? tab : 'posts';
  }, [searchParams]);

  const handleTabChange = useCallback((newTab: TabType) => {
    router.push(`/mypage?tab=${newTab}`, { scroll: false });
  }, [router]);

  // Mock data (실제로는 custom hook이나 context에서 관리)
  const { posts, comments, likes } = useMockData();


  return (
    <main className="flex mt-20">
      <Sidebar />
      <section className="flex-1 ml-12" aria-label="마이페이지 콘텐츠">
        <TabMenu
          tab={currentTab}
          setTab={handleTabChange}
          aria-label="마이페이지 탭 메뉴"
        />

        <div role="tabpanel" aria-labelledby={`${currentTab}-tab`}>
          {currentTab === "posts" && <PostList posts={posts} />}
          {currentTab === "comments" && <CommentList comments={comments} />}
          {currentTab === "likes" && <LikeList likes={likes} />}
        </div>
      </section>
    </main>
  );
}

// 데이터 관리를 별도 hook으로 분리
function useMockData() {
  return useMemo(() => ({
    posts: [
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
    ],

    comments: [
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
    ],
    likes: [
      {
        id: 1,
        title: "좋아요 누른 게시글 제목",
        summary:
          "와우 좋아요 누른 게시글 내용이에용용",
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
    ],
  }), []);
}