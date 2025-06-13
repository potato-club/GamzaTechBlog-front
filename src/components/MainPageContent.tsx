import { postService } from "@/services/postService";
import Image from "next/image";
import Link from "next/link";
import PostList from "./features/posts/PostList";
import MainPageSidebar from "./layout/sidebar/MainPageSidebar";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function MainPageContent() {
  // await delay(2000); // 2000ms = 2초

  const postResponse = await postService.getPosts({
    sort: [
      "createdAt",
    ]
  });
  const tags = await postService.getTags();

  console.log("postResponse", postResponse);

  const posts = postResponse.content;
  // const tags = tagResponse.;


  console.log("posts", posts);


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

      {/* 게시물 목록과 사이드바를 감싸는 flex 컨테이너 */}
      <div className="flex pb-10">
        <main className="flex-3"> {/* 주요 콘텐츠 영역 */}
          <h2 className="text-2xl font-semibold">Posts</h2>
          <PostList posts={posts} />
        </main>
        <MainPageSidebar posts={posts} tags={tags} />
      </div>
    </div>
  );
}