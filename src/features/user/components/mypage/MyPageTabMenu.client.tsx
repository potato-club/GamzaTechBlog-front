"use client";

import TabMenu from "@/components/shared/navigation/TabMenu";
import { useMyPageTab } from "@/features/user/hooks/useMyPageTab";
import type { TabType } from "@/types/mypage";

const TAB_LABELS: Record<TabType, string> = {
  posts: "작성 글",
  likes: "좋아요",
  comments: "작성 댓글",
};

export default function MyPageTabMenu() {
  const { currentTab, handleTabChange } = useMyPageTab();

  return <TabMenu tab={currentTab} onTabChange={handleTabChange} labels={TAB_LABELS} />;
}
