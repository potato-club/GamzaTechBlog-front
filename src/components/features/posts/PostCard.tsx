"use client";

/**
 * 게시글 카드 컴포넌트
 */

import { markdownToText } from "@/utils/markdown";
import { highlightSearchKeyword } from "@/utils/textHighlight";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PostMeta from "./PostMeta";

export default function PostCard({ post, searchKeyword }: { post: any; searchKeyword?: string }) {
  const pathname = usePathname();
  const isMyPage = pathname === "/mypage";

  return (
    <article className={`flex items-center gap-6 rounded-lg bg-white py-6`}>
      {/* 콘텐츠 영역 */}
      <div className="h-[140px] w-[500px] flex-1">
        <Link href={`/posts/${post.postId}`}>
          <h3 className={`truncate text-xl font-bold`}>
            {searchKeyword ? highlightSearchKeyword(post.title, searchKeyword) : post.title}
          </h3>
          <p className="mt-3.5 truncate text-sm text-[#B5BBC7]">
            {markdownToText(post.contentSnippet, 100)}
          </p>
        </Link>
        <PostMeta
          author={post.writer}
          profileImage={post.writerProfileImageUrl}
          date={post.createdAt.split("T")[0]}
          tags={post.tags}
        />
      </div>

      {/* 썸네일 및 옵션 영역 */}
      <div className="relative h-32 w-44">
        {isMyPage && (
          <button
            aria-label="게시글 옵션 더보기"
            className="absolute -top-1 right-3 z-10 p-1 hover:opacity-80"
          >
            <Image src="/dot3.svg" alt="더보기" width={18} height={4} />
          </button>
        )}
        {post.thumbnailImageUrl ? (
          <Image
            src={post.thumbnailImageUrl}
            alt={`${post.title} 썸네일`}
            fill
            className="rounded-2xl object-cover"
            sizes="(max-width: 768px) 100vw, 176px"
          />
        ) : (
          <div className="absolute bottom-0 left-0 h-28 w-full shrink-0 rounded-2xl bg-white" />
        )}
      </div>
    </article>
  );
}
