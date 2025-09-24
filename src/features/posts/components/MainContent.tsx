"use client";

import TabMenu from "@/components/shared/navigation/TabMenu";
import { WelcomeBoardSection } from "@/features/posts";
import { useTab } from "@/hooks/useTab"; // Import the generic useTab hook
import { ReactNode } from "react";

// Define MainTab type locally or import if it's defined elsewhere
type MainTab = "posts" | "welcome";
const VALID_MAIN_TABS: MainTab[] = ["posts", "welcome"];

const MAIN_TAB_LABELS: Record<MainTab, string> = {
  posts: "모내기",
  welcome: "텃밭인사",
};

export default function MainContent({ postsTabContent }: { postsTabContent: ReactNode }) {
  const { currentTab, handleTabChange } = useTab<MainTab>({
    defaultTab: "posts",
    validTabs: VALID_MAIN_TABS,
  });

  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return postsTabContent;
      case "welcome":
        return <WelcomeBoardSection />;
      default:
        return postsTabContent;
    }
  };

  return (
    <div className="flex-1 md:flex-3">
      <TabMenu tab={currentTab} onTabChange={handleTabChange} labels={MAIN_TAB_LABELS} />
      <div role="tabpanel" aria-labelledby={`${currentTab}-tab`} key={currentTab} className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
