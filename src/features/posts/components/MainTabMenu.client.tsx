"use client";

import TabMenu from "@/components/shared/navigation/TabMenu";
import { useSearchParams, useRouter } from "next/navigation";

type MainTab = "posts" | "welcome";

const MAIN_TAB_LABELS: Record<MainTab, string> = {
  posts: "모내기",
  welcome: "텃밭인사",
};

interface MainTabMenuProps {
  currentTab: MainTab;
}

export default function MainTabMenu({ currentTab }: MainTabMenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (newTab: MainTab) => {
    const params = new URLSearchParams();
    params.set("tab", newTab);

    const tag = searchParams.get("tag");
    if (tag) {
      params.set("tag", tag);
    }

    const query = params.toString();
    router.push(query ? `?${query}` : "/", { scroll: false });
  };

  return <TabMenu tab={currentTab} onTabChange={handleTabChange} labels={MAIN_TAB_LABELS} />;
}
