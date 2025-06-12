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
    <div
      className={`flex items-center gap-6 py-6 bg-white rounded-lg`}
    >
      {/* 썸네일 자리 */}
      <div className="flex-1 w-[500px] h-[140px]">
        <Link href={`/posts/${post.postId}`}>
          <h2 className={`text-xl font-bold truncate`}>
            {post.title}
          </h2>
          <p className="text-[#B5BBC7] text-sm mt-3.5 truncate">{post.contentSnippet}</p>
        </Link>
        <PostMeta author={post.writer} date={post.createdAt.split("T")[0]} tags={post.tags} />
      </div>
      <div className="relative w-44 h-32">
        {isMyPage && (
          <Image
            src="dot3.svg"
            alt="더보기"
            width={18}
            height={4}
            className="absolute right-3 hover:cursor-pointer hover:opacity-80"
          />
        )}
        <div className="absolute bottom-0 left-0 w-full h-28 bg-gray-100 rounded-2xl shrink-0" />
      </div>
    </div>
  );
}