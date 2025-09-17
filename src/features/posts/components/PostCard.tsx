/**
 *
 * 게시글 카드 컴포넌트
 */

import { PostLink } from "@/components/shared/navigation/OptimizedLink";
import { PostListResponse } from "@/generated/api";
import { markdownToText } from "@/lib/markdown";
import { highlightSearchKeyword } from "@/lib/textHighlight";
import Image from "next/image";
import PostMeta from "./PostMeta";

export default function PostCard({
  post,
  searchKeyword,
}: {
  post: PostListResponse;
  searchKeyword?: string;
}) {
  return (
    <article className="flex flex-row items-start gap-3 rounded-lg bg-white py-4 md:items-center md:gap-6 md:py-6">
      {/* 콘텐츠 영역 */}
      <div className="flex-1 md:h-[140px] md:w-[500px]">
        <PostLink
          postId={post.postId!}
          href={`/posts/${post.postId}`}
          className="block transition-colors hover:text-[#FAA631]"
        >
          <h3 className="line-clamp-2 text-lg font-bold md:truncate md:text-xl">
            {searchKeyword ? highlightSearchKeyword(post.title ?? "", searchKeyword) : post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-[#B5BBC7] md:mt-3.5 md:truncate">
            {markdownToText(post.contentSnippet ?? "", 100)}
          </p>
        </PostLink>
        <PostMeta
          author={post.writer ?? ""}
          profileImage={post.writerProfileImageUrl ?? ""}
          date={post.createdAt ? new Date(post.createdAt).toISOString().split("T")[0] : ""}
          tags={post.tags ?? []}
        />
      </div>

      {/* 썸네일 영역 - 모바일과 데스크톱 모두 우측에 표시 */}
      <div className="relative h-20 w-28 shrink-0 md:h-32 md:w-44">
        {post.thumbnailImageUrl ? (
          <Image
            src={post.thumbnailImageUrl}
            alt={`${post.title} 썸네일`}
            fill
            className="rounded-lg object-cover md:rounded-2xl"
            sizes="(max-width: 768px) 80px, 176px"
            quality={75}
            loading="lazy"
            unoptimized={post.thumbnailImageUrl.includes(".svg")}
          />
        ) : (
          <div className="h-full w-full shrink-0 rounded-lg bg-gray-100 md:rounded-2xl" />
        )}
      </div>
    </article>
  );
}
