"use client";

import { PostActionsDropdown } from "@/components/features/posts/PostActionsDropdown";
import { Button } from "@/components/ui/button";
import TagBadge from '@/components/ui/TagBadge';
import { useAuth } from "@/hooks/queries/useUserQueries";
import { cn } from "@/lib/utils";
import { PostDetailData } from "@/types/comment";
import Image from 'next/image';

interface PostHeaderProps {
  post: PostDetailData;
  postId: number;
}

export default function PostHeader({ post, postId }: PostHeaderProps) {
  const { userProfile, isLoggedIn } = useAuth();

  // 현재 로그인한 사용자가 게시글 작성자인지 확인
  const isCurrentUserAuthor = isLoggedIn && userProfile && userProfile.nickname === post.writer;

  const headerTriggerElement = (
    <Button
      variant="ghost"
      className={cn("relative h-8 w-8 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer ml-auto")}
    >
      <Image
        src="/dot3.svg"
        alt="더보기"
        width={18}
        height={4}
      />
    </Button>
  );

  return (
    <header>
      <h1 className="text-[32px] font-extrabold text-[#1C222E]">
        {post.title}
      </h1>

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
              unoptimized={post.writerProfileImageUrl.includes('amazonaws.com')}
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">
                {post.writer?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <span className="ml-2 font-medium text-[#798191]">
            {post.writer}
          </span>
        </div>
        <time dateTime={new Date(post.createdAt).toISOString().split("T")[0]} className="text-[#B5BBC7]">
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </time>

        {/* 게시글 작성자인 경우에만 액션 드롭다운 표시 */}
        {isCurrentUserAuthor && (
          <PostActionsDropdown
            postId={postId}
            triggerElement={headerTriggerElement}
          />
        )}
      </div>

      <ul className="flex gap-2 text-[14px]" role="list">
        {post.tags.map((tag, index) => (
          <li key={index}>
            <TagBadge tag={tag} variant="gray" />
          </li>
        ))}
      </ul>
    </header>
  );
}
