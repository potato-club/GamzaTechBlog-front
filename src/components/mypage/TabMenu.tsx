import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabMenu({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (value: string) => void;
}) {
  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex w-full border-b border-[#F2F4F6] bg-transparent p-0">
          <TabsTrigger value="posts">작성 글</TabsTrigger>
          <TabsTrigger value="comments">작성 댓글</TabsTrigger>
          <TabsTrigger value="likes">좋아요</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}