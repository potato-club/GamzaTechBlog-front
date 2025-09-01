"use client";

import { MainTabMenu, WelcomeBoardSection } from "@/features/posts";
import { useTab } from "@/hooks/useTab"; // Import the generic useTab hook
import { ReactNode } from "react";

// Define MainTab type locally or import if it's defined elsewhere
type MainTab = "posts" | "welcome";
const VALID_MAIN_TABS: MainTab[] = ["posts", "welcome"];

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
    <main className="flex-3">
      <MainTabMenu tab={currentTab} onTabChange={handleTabChange} />
      <div role="tabpanel" aria-labelledby={`${currentTab}-tab`} key={currentTab} className="mt-6">
        {renderTabContent()}
      </div>
    </main>
  );
}
