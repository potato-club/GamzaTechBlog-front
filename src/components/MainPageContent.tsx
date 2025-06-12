import Image from "next/image";
import Link from "next/link";
import { postService } from "../services/postService";
import PostList from "./mypage/PostList";
import Sidebar from "./Sidebar";

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
    <>
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
    </>
  );
}