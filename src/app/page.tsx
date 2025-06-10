import PostList from "@/components/mypage/PostList";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {



  const tags = [
    "# java",
    "# javascript",
    "# react",
    "# nextjs",
    "# javajavajavajava",
    "# spring",
    "# typescript",
    "# nodejs",
  ];

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
    <div className="flex flex-col mt-16 gap-30 mx-auto">
      {/* 로고 */}
      <section className="text-center">
        <Link href="/">
          <Image
            src="/logo2.svg"
            alt="메인페이지 로고"
            width={320}
            height={230}
            className="mx-auto"
          />
        </Link>
      </section>

      <main className="flex pb-10">
        <section className="flex-3">
          <h2 className="text-2xl font-semibold">Posts</h2>
          <PostList posts={posts} />
        </section>
        <Sidebar posts={posts} tags={tags} />
      </main>
    </div>
  );
}
