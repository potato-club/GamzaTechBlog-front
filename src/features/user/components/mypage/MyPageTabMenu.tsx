import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabType } from "@/types/mypage";

interface TabMenuProps {
  tab: TabType;
  onTabChange: (value: TabType) => void;
}

const TAB_LABELS = {
  posts: "작성 글",
  likes: "좋아요",
  comments: "작성 댓글",
} as const;

export default function MyPageTabMenu({ tab, onTabChange }: TabMenuProps) {
  const handleValueChange = (value: string) => {
    onTabChange(value as TabType);
  };

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={handleValueChange} className="w-full">
        <TabsList className="flex w-full border-b border-[#F2F4F6] bg-transparent p-0">
          {Object.entries(TAB_LABELS).map(([value, label]) => (
            <TabsTrigger key={value} value={value} id={`${value}-tab`}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
