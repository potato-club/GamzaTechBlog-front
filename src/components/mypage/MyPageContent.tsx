"use client";

import CommentList from "@/components/CommentList";
import { useMyPageTab } from "@/hooks/useMyPageTab";
import { useMyPageData } from "../../hooks/useMyPageData"; // 이 훅에서 실제 userProfile을 가져올 수 있습니다.
import LikeList from "./LikeList";
import PostList from "./PostList";
import Sidebar from "./Sidebar";
import TabMenu from "./TabMenu";

// Sidebar에서 사용하는 UserProfileData 타입 (실제 타입 정의와 일치해야 함)
interface UserProfileData {
  profileImageUrl?: string;
  nickname: string;
  job?: string;
  generation?: string;
  postsCount?: number;
  commentsCount?: number;
  likesCount?: number;
}

export default function MyPageContent() {
  const { currentTab, handleTabChange } = useMyPageTab();
  // 실제 데이터는 useMyPageData 또는 다른 훅/API 호출을 통해 가져와야 합니다.
  const { posts, comments, likes /*, userProfile: actualUserProfile */ } = useMyPageData();


  // 임시 정적 사용자 프로필 데이터
  const tempUserProfile: UserProfileData = {
    profileImageUrl: "", // 임시 이미지 URL
    nickname: "임시 사용자",
    job: "임시 직군",
    generation: "X기",
    postsCount: 10,
    commentsCount: 5,
    likesCount: 20,
  };

  // 임시 프로필 업데이트 핸들러
  const handleTempProfileUpdate = (updatedProfile: Partial<UserProfileData>) => {
    console.log("임시 프로필 업데이트 요청:", updatedProfile);
    // 실제로는 여기서 API를 호출하고 상태를 업데이트해야 합니다.
    // 예: setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    alert(`프로필 업데이트: ${JSON.stringify(updatedProfile)} (실제 API 호출 필요)`);
  };


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
      {/* 
        실제 구현 시에는 useMyPageData 훅 또는 다른 방법을 통해 
        동적으로 userProfile 데이터를 가져와서 전달해야 합니다.
        예: <Sidebar userProfile={actualUserProfile} onProfileUpdate={handleActualProfileUpdate} /> 
      */}
      <Sidebar userProfile={tempUserProfile} onProfileUpdate={handleTempProfileUpdate} />
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
    </main>
  );
}