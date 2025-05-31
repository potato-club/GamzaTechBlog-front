import Image from "next/image";
import Link from "next/link";
import mainLogo from "../../public/logo2.svg";
import PostList from "../components/mypage/PostList";
import TagBadge from "../components/TagBadge";

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
      <Link href="/">
        <Image
          src={mainLogo}
          alt="메인페이지 로고"
          width={320}
          height={230}
          className="mx-auto"
        />
      </Link>

      <main className="flex pb-10">
        <div className="flex-3">
          <span className="text-2xl font-semibold">Posts</span>
          <PostList posts={posts} />
        </div>
        <div className="flex-1 ml-10 border-l border-[#D5D9E3] pl-10">
          <span className="text-[18px] text-[#838C9D]">인기 게시물</span>
          <div>
            <h3 className="mt-7 font-medium">Next.js로 무한스크롤 구현하기</h3>
            <div className="flex items-center gap-1 text-[#798191] text-[12px] mt-4">
              <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
              {posts[1].author}
            </div>
          </div>
          <div>
            <h3 className="mt-7 font-medium">Next.js로 무한스크롤 구현하기</h3>
            <div className="flex items-center gap-1 text-[#798191] text-[12px] mt-4">
              <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
              {posts[1].author}
            </div>
          </div>

          <div className="mt-20">
            <span className="text-[18px] text-[#838C9D]">Tags</span>
            <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
              {tags.map((tag, idx) => (
                <TagBadge key={idx} tag={tag} variant="outline" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
