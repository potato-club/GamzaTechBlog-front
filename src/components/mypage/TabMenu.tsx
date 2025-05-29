import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabMenu() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList>
        <TabsTrigger value="posts">작성 글</TabsTrigger>
        <TabsTrigger value="comments">작성 댓글</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}