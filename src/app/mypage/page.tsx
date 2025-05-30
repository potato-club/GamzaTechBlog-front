import PostList from "../../components/mypage/PostList";
import Sidebar from "../../components/mypage/Sidebar";
import TabMenu from "../../components/mypage/TabMenu";

export default function MyPage() {

  const posts = [
    {
      id: 1,
      title: "제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다",
      summary:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima aperiam animi libero quae sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!",
      author: "GyeongHwan Lee",
      date: "2025. 04. 28",
      tags: ["# java", "# spring", "# backend"],
    },
    {
      id: 2,
      title: "Next.js로 무한스크롤 구현하기",
      summary:
        "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
      author: "Jinwoo Park",
      date: "2025. 04. 27",
      tags: ["# nextjs", "# react", "# frontend"],
    },
  ];

  return (
    <main className="flex mt-20">
      <Sidebar />
      <section className="flex-1 ml-12">
        <TabMenu />
        <PostList posts={posts} />
      </section>
    </main>
  );
}