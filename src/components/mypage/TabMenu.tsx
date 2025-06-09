import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabType = "posts" | "comments" | "likes";

export default function TabMenu({
  tab,
  setTab,
}: {
  tab: TabType;
  setTab: (value: TabType) => void;
}) {
  return (
    <div className="w-full">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as TabType)}
        className="w-full"
      >
        <TabsList className="flex w-full border-b border-[#F2F4F6] bg-transparent p-0">
          <TabsTrigger value="posts">작성 글</TabsTrigger>
          <TabsTrigger value="comments">작성 댓글</TabsTrigger>
          <TabsTrigger value="likes">좋아요</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}