"use client";

/**
 * 마이페이지 탭 콘텐츠 컴포넌트
 *
 * 탭별 컴포넌트로 분리하여 단일 책임 원칙을 준수하고,
 * 유지보수성과 테스트 용이성을 향상시켰습니다.
 * 인증은 상위 서버 컴포넌트에서 처리되므로 탭 상호작용에만 집중합니다.
 */

import { CommentsTab, LikesTab, PostsTab, TabMenu, useMyPageTab } from "@/features/user";

export default function MyPageTabContent() {
  const { currentTab, handleTabChange } = useMyPageTab();

  /**
   * 현재 활성 탭에 따라 해당 탭 컴포넌트를 렌더링합니다.
   * 각 탭 컴포넌트는 독립적으로 데이터 fetching과 상태 관리를 담당합니다.
   */
  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return <PostsTab />;
      case "comments":
        return <CommentsTab />;
      case "likes":
        return <LikesTab />;
      default:
        return <PostsTab />;
    }
  };

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
