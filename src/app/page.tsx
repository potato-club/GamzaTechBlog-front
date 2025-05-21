import Image from "next/image";
import Link from "next/link";
import mainLogo from "../../public/logo2.png";
import profileImg from "../../public/profileEX.png";

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
      title:
        "제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima aperiam animi libero quae sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!",
      author: "GyeongHwan Lee",
      date: "2025. 04. 28",
      tags: ["# java", "# spring", "# backend"],
    },
    {
      title: "Next.js로 무한스크롤 구현하기",
      description:
        "Next.js에서 Intersection Observer API를 사용해 무한스크롤을 구현하는 방법을 정리합니다.",
      author: "Jinwoo Park",
      date: "2025. 04. 27",
      tags: ["# nextjs", "# react", "# frontend"],
    },
  ];

  return (
    <div className="mt-16 flex w-full flex-col gap-20">
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

      {/* Tags */}
      <div>
        {/* <span className="text-2xl text-[#FAA631]">Tags</span> */}
        <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="w-fit rounded-3xl px-2 py-1.5 text-[#FAA631] border border-[#FAA631]"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-8">
        <span className="text-2xl text-[#FAA631]">Posts</span>
        <div>
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="flex justify-between gap-[20%] py-8 first:pt-0"
            >
              <div className="max-w-[1000px]">
                <div className="text-2xl font-extrabold text-[#1C222E]">
                  {post.title}
                </div>
                <div className="my-6 text-[#B5BBC7]">{post.description}</div>
                <div className="flex h-12 items-center gap-4 text-[14px]">
                  <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
                    <Image
                      src={profileImg}
                      alt="사용자 이미지"
                      width={35}
                      height={35}
                      className="m-2"
                    />
                    <span className="m-2 font-medium text-[#798191]">
                      {post.author}
                    </span>
                  </div>
                  <div className="text-[#B5BBC7]">{post.date}</div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="w-fit rounded-3xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[150px] w-[200px] shrink-0 rounded-3xl bg-[#D9D9D9]">
                {/* <Image src={mainLogo} alt="임시" width={200} height={150} /> */}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
