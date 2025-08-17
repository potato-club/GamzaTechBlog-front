import TagBadge from "@/components/ui/TagBadge";
import { PostDetailResponse } from "@/generated/api";
import { isPostAuthor } from "@/lib/auth";
import Image from "next/image";
import { PostActionsDropdown } from "./PostActionsDropdown";

interface PostHeaderProps {
  post: PostDetailResponse;
  postId: number;
}

export default async function PostHeader({ post, postId }: PostHeaderProps) {
  // 현재 로그인한 사용자가 게시글 작성자인지 확인
  const isCurrentUserAuthor = post.githubId ? await isPostAuthor(post.githubId) : false;

  return (
    <header>
      <h1 className="text-[32px] font-extrabold text-[#1C222E]">{post.title}</h1>

      <div className="flex h-12 items-center gap-4 text-[14px]">
        <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-3">
          {post.writerProfileImageUrl ? (
            <Image
              src={post.writerProfileImageUrl}
              alt={`${post.writer}의 프로필 이미지`}
              width={24}
              height={24}
              className="rounded-full"
              priority={true}
              unoptimized={post.writerProfileImageUrl.includes("amazonaws.com")}
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
              <span className="text-xs text-gray-600">
                {post.writer?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <span className="ml-2 font-medium text-[#798191]">{post.writer}</span>
        </div>
        <time
          dateTime={
            post.createdAt ? new Date(post.createdAt).toISOString().split("T")[0] : undefined
          }
          className="text-[#B5BBC7]"
        >
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "날짜 없음"}
        </time>

        {/* 게시글 작성자인 경우에만 액션 드롭다운 표시 */}
        {isCurrentUserAuthor && <PostActionsDropdown postId={postId} />}
      </div>

      <ul className="flex gap-2 text-[14px]" role="list">
        {post.tags?.map((tag, index) => (
          <li key={index}>
            <TagBadge tag={tag} variant="gray" />
          </li>
        ))}
      </ul>
    </header>
  );
}
