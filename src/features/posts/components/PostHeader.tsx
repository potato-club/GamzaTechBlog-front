import { ProfileLink } from "@/components/shared/ProfileLink";
import TagBadge from "@/components/ui/TagBadge";
import { UI_CONSTANTS } from "@/constants/ui";
import { PostDetailResponse } from "@/generated/api";
import Image from "next/image";
import { isValidTagArray } from "../../../lib/typeGuards";
import PostAuthorActions from "./PostAuthorActions";

interface PostHeaderProps {
  post: PostDetailResponse;
  postId: number;
}

export default function PostHeader({ post, postId }: PostHeaderProps) {
  return (
    <header>
      <h1 className="text-[24px] font-extrabold text-[#1C222E] sm:text-[28px] md:text-[32px]">
        {post.title}
      </h1>

      <div className="flex h-12 items-center gap-4 text-[14px]">
        <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-3">
          <ProfileLink nickname={post.writer || ""} showTooltip>
            {post.writerProfileImageUrl ? (
              <Image
                src={post.writerProfileImageUrl}
                alt={UI_CONSTANTS.ACCESSIBILITY.PROFILE_IMAGE_ALT(post.writer || "사용자")}
                width={24}
                height={24}
                className="h-6 w-6 cursor-pointer rounded-full object-cover transition-all hover:ring-2 hover:ring-[#FAA631]"
                priority={true}
                unoptimized={post.writerProfileImageUrl.includes("amazonaws.com")}
              />
            ) : (
              <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-300 transition-all hover:ring-2 hover:ring-[#FAA631]">
                <span className="text-xs text-gray-600">
                  {post.writer?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </ProfileLink>
          <ProfileLink
            nickname={post.writer || ""}
            className="ml-2 font-medium text-[#798191] hover:text-[#FAA631]"
            showTooltip
          >
            {post.writer}
          </ProfileLink>
        </div>
        <time
          dateTime={
            post.createdAt ? new Date(post.createdAt).toISOString().split("T")[0] : undefined
          }
          className="text-[#B5BBC7]"
        >
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "날짜 없음"}
        </time>

        {/* 작성자 판별은 클라이언트에서 (라우트 정적화를 위해 렌더 이후로 분리) */}
        <PostAuthorActions postId={postId} postWriter={post.writer || ""} />
      </div>

      <ul className="flex gap-2 text-[14px]" role="list">
        {isValidTagArray(post.tags) &&
          post.tags.map((tag) => (
            <li key={tag}>
              <TagBadge tag={tag} variant="gray" />
            </li>
          ))}
      </ul>
    </header>
  );
}
