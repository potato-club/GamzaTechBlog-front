"use client";

/**
 * 마이페이지 탭 콘텐츠 컴포넌트
 *
 * 탭별 컴포넌트로 분리하여 단일 책임 원칙을 준수하고,
 * 유지보수성과 테스트 용이성을 향상시켰습니다.
 * 마이페이지와 공개 프로필 페이지에서 공유하여 사용됩니다.
 *
 * @param isOwner - 현재 사용자가 프로필 소유자인지 여부
 * @param username - 조회할 사용자명 (공개 프로필용)
 */

import { CommentsTab, LikesTab, PostsTab, TabMenu, useMyPageTab } from "@/features/user";

interface MyPageTabContentProps {
  isOwner?: boolean;
  username?: string;
}

export default function MyPageTabContent({ isOwner = true, username }: MyPageTabContentProps = {}) {
  const { currentTab, handleTabChange } = useMyPageTab();

  // 공개 프로필인 경우 탭 없이 PostsTab만 렌더링
  if (!isOwner) {
    return (
      <section className="flex-1" aria-label="프로필 콘텐츠">
        <div className="px-10">
          <div className="mx-auto min-w-[700px]">
            <PostsTab isOwner={isOwner} username={username} />
          </div>
        </div>
      </section>
    );
  }

  /**
   * 현재 활성 탭에 따라 해당 탭 컴포넌트를 렌더링합니다.
   * 각 탭 컴포넌트는 독립적으로 데이터 fetching과 상태 관리를 담당합니다.
   */
  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return <PostsTab isOwner={isOwner} username={username} />;
      case "comments":
        return <CommentsTab isOwner={isOwner} username={username} />;
      case "likes":
        return <LikesTab isOwner={isOwner} username={username} />;
      default:
        return <PostsTab isOwner={isOwner} username={username} />;
    }
  };

  // 마이페이지인 경우 탭 메뉴와 함께 렌더링
  return (
    <section className="flex-1" aria-label="마이페이지 콘텐츠">
      <TabMenu tab={currentTab} onTabChange={handleTabChange} aria-label="마이페이지 탭 메뉴" />
      <div
        role="tabpanel"
        aria-labelledby={`${currentTab}-tab`}
        className="mt-6" // 탭 콘텐츠와 탭 메뉴 사이 간격
      >
        <div className="px-10">
          <div className="mx-auto min-w-[700px]">{renderTabContent()}</div>
        </div>
      </div>
    </section>
  );
}
