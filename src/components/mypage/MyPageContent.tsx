"use client";

import CommentList from "@/components/CommentList";
import { useMyPageData } from "@/hooks/useMyPageData";
import { useMyPageTab } from "@/hooks/useMyPageTab";
import LikeList from "./LikeList";
import PostList from "./PostList";
import Sidebar from "./Sidebar";
import TabMenu from "./TabMenu";

export default function MyPageContent() {
  const { currentTab, handleTabChange } = useMyPageTab();
  const { posts, comments, likes } = useMyPageData();

  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return <PostList posts={posts} />;
      case "comments":
        return <CommentList comments={comments} />;
      case "likes":
        return <LikeList likes={likes} />;
      default:
        return <PostList posts={posts} />;
    }
  };

  return (
    <main className="flex mt-20">
      <Sidebar />
      <section className="flex-1 ml-12" aria-label="마이페이지 콘텐츠">
        <TabMenu
          tab={currentTab}
          onTabChange={handleTabChange}
          aria-label="마이페이지 탭 메뉴"
        />

        <div
          role="tabpanel"
          aria-labelledby={`${currentTab}-tab`}
          key={currentTab} // 탭 변경 시 리렌더링 최적화
        >
          {renderTabContent()}
        </div>
      </section>
    </main>
  );
}