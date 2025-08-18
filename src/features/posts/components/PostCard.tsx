/**
 *
 * 게시글 카드 컴포넌트
 */

import { PostLink } from "@/components/shared/navigation/OptimizedLink";
import { PostListResponse } from "@/generated/api";
import { markdownToText } from "@/utils/markdown";
import { highlightSearchKeyword } from "@/utils/textHighlight";
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
    <article className="flex items-center gap-6 rounded-lg bg-white py-6">
      {/* 콘텐츠 영역 */}
      <div className="h-[140px] w-[500px] flex-1">
        <PostLink
          postId={post.postId!}
          href={`/posts/${post.postId}`}
          className="block transition-colors hover:text-[#FAA631]"
        >
          <h3 className={`truncate text-xl font-bold`}>
            {searchKeyword ? highlightSearchKeyword(post.title ?? "", searchKeyword) : post.title}
          </h3>
          <p className="mt-3.5 truncate text-sm text-[#B5BBC7]">
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

      {/* 썸네일 및 옵션 영역 */}
      <div className="relative h-32 w-44">
        {post.thumbnailImageUrl ? (
          <Image
            src={post.thumbnailImageUrl}
            alt={`${post.title} 썸네일`}
            fill
            className="rounded-2xl object-cover"
            sizes="176px"
            quality={75}
            loading="lazy"
            unoptimized={post.thumbnailImageUrl.includes(".svg")}
          />
        ) : (
          <div className="absolute bottom-0 left-0 h-28 w-full shrink-0 rounded-2xl bg-white" />
        )}
      </div>
    </article>
  );
}
