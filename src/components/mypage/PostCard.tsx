"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PostMeta from "./PostMeta";

export default function PostCard({
  post,
}: {
  post: any;
}) {
  const pathname = usePathname();
  const isMyPage = pathname === "/mypage";

  return (
    <article
      className={`flex items-center gap-6 py-6 bg-white rounded-lg`}
    >
      {/* 썸네일 자리 */}
      <div className="flex-1 w-[500px] h-[140px]">
        <Link href={`/posts/${post.postId}`}>
          <h3 className={`text-xl font-bold truncate`}>
            {post.title}
          </h3>
          <p className="text-[#B5BBC7] text-sm mt-3.5 truncate">{post.contentSnippet}</p>
        </Link>
        <PostMeta author={post.writer} date={post.createdAt.split("T")[0]} tags={post.tags} />
      </div>
      <div className="relative w-44 h-32">
        {isMyPage && (
          <button
            aria-label="게시글 옵션 더보기"
            className="absolute right-3 -top-1 p-1 hover:opacity-80 z-10" // z-10 추가하여 다른 요소 위에 오도록 보장
          >
            <Image
              src="/dot3.svg" // public 폴더 루트에 있다면 / 추가
              alt="" // 버튼에 aria-label이 있으므로 alt는 비워도 무방
              width={18}
              height={4}
            />
          </button>
        )}
        <div className="absolute bottom-0 left-0 w-full h-28 bg-gray-100 rounded-2xl shrink-0" />
      </div>
    </article>
  );
}