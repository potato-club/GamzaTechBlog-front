"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type MainTab = "posts" | "welcome";

interface TabMenuProps {
  tab: MainTab;
  onTabChange: (value: MainTab) => void;
}

const TAB_LABELS: { [key in MainTab]: string } = {
  posts: "모내기",
  welcome: "텃밭인사",
};

export default function MainTabMenu({ tab, onTabChange }: TabMenuProps) {
  const handleValueChange = (value: string) => {
    onTabChange(value as MainTab);
  };

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={handleValueChange} className="w-full">
        <TabsList className="flex w-full border-b border-[#F2F4F6] bg-transparent px-0 pb-4">
          {Object.entries(TAB_LABELS).map(([value, label]) => (
            <TabsTrigger key={value} value={value} id={`${value}-tab`} className="text-xl">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
