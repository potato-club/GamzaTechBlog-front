import { ReactNode } from "react";
import MainTabMenu from "./MainTabMenu.client";

type MainTab = "posts" | "welcome";

interface MainContentProps {
  currentTab: MainTab;
  postsTabContent?: ReactNode;
  welcomeTabContent?: ReactNode;
}

export default function MainContent({
  currentTab,
  postsTabContent,
  welcomeTabContent,
}: MainContentProps) {
  const resolvedTab: MainTab = currentTab === "welcome" ? "welcome" : "posts";
  const resolvedContent =
    resolvedTab === "welcome" ? welcomeTabContent : (postsTabContent ?? welcomeTabContent);

  return (
    <div className="flex-1 md:flex-3">
      <MainTabMenu currentTab={resolvedTab} />
      <div
        role="tabpanel"
        aria-labelledby={`${resolvedTab}-tab`}
        key={resolvedTab}
        className="mt-6"
      >
        {resolvedContent}
      </div>
    </div>
  );
}
