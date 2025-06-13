"use client";

import CommentList from "@/components/features/comments/CommentList";
import LikeList from "@/components/features/posts/LikeList";
import PostList from "@/components/features/posts/PostList";
import TabMenu from "@/components/TabMenu";
import { useMyPageData } from "@/hooks/useMyPageData"; // 이 훅에서 실제 userProfile을 가져올 수 있습니다.
import { useMyPageTab } from "@/hooks/useMyPageTab";

export default function MyPage() {
  const { currentTab, handleTabChange } = useMyPageTab();
  // 실제 데이터는 useMyPageData 또는 다른 훅/API 호출을 통해 가져와야 합니다.
  const { posts, comments, likes /*, userProfile: actualUserProfile */ } = useMyPageData();

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
    <>
      {/* 
          실제 구현 시에는 useMyPageData 훅 또는 다른 방법을 통해 
          동적으로 userProfile 데이터를 가져와서 전달해야 합니다.
          예: <Sidebar userProfile={actualUserProfile} onProfileUpdate={handleActualProfileUpdate} /> 
        */}

      <section className="ml-12 flex-1" aria-label="마이페이지 콘텐츠"> {/* flex-1 추가하여 남은 공간 채우도록 */}
        <TabMenu
          tab={currentTab}
          onTabChange={handleTabChange}
          aria-label="마이페이지 탭 메뉴"
        />

        <div
          role="tabpanel"
          aria-labelledby={`${currentTab}-tab`}
          key={currentTab} // 탭 변경 시 리렌더링 최적화
          className="mt-6" // 탭 콘텐츠와 탭 메뉴 사이 간격
        >
          {renderTabContent()}
        </div>
      </section>
    </>
  );
}