"use client";

/**
 * 게시글 카드 컴포넌트
 * 
 * TanStack Query의 useLikePost 뮤테이션을 사용하여
 * 좋아요 기능을 구현하고 Optimistic Update를 제공합니다.
 */

import { useLikePost } from "@/hooks/queries/usePostQueries";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import PostMeta from "./PostMeta";

export default function PostCard({
  post,
  showLikeButton = true, // 기본적으로 좋아요 버튼 표시
}: {
  post: any;
  showLikeButton?: boolean;
}) {
  const pathname = usePathname();
  const isMyPage = pathname === "/mypage";
  // 좋아요 상태 관리 (실제로는 post 객체에서 가져와야 함)
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked || false);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount || 0);

  /**
   * TanStack Query 뮤테이션을 사용한 좋아요 토글
   * 
   * 이 훅의 장점:
   * - Optimistic Update: 서버 응답 전에 즉시 UI 업데이트
   * - 자동 롤백: 실패 시 이전 상태로 자동 복원
   * - 로딩 상태: isPending을 통한 중복 클릭 방지
   * - 캐시 갱신: 성공 시 관련 쿼리 자동 무효화
   */
  const likePostMutation = useLikePost(post.postId);

  const handleLikeToggle = async () => {
    if (likePostMutation.isPending) return; // 요청 중 중복 클릭 방지

    try {      // Optimistic Update를 위해 로컬 상태 먼저 업데이트
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount((prev: number) => newIsLiked ? prev + 1 : prev - 1);

      // 서버에 요청 (TanStack Query가 Optimistic Update 처리)
      await likePostMutation.mutateAsync(isLiked);

    } catch (error) {
      // 에러 발생 시 로컬 상태 롤백 (TanStack Query도 자동 롤백함)
      setIsLiked(!isLiked);
      setLikeCount((prev: number) => isLiked ? prev + 1 : prev - 1);
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  return (
    <article
      className={`flex items-center gap-6 py-6 bg-white rounded-lg`}
    >
      {/* 콘텐츠 영역 */}
      <div className="flex-1 w-[500px] h-[140px]">
        <Link href={`/posts/${post.postId}`}>
          <h3 className={`text-xl font-bold truncate`}>
            {post.title}
          </h3>
          <p className="text-[#B5BBC7] text-sm mt-3.5 truncate">{post.contentSnippet}</p>
        </Link>        <div className="flex justify-between items-center">
          <PostMeta author={post.writer} date={post.createdAt.split("T")[0]} tags={post.tags} />

          {/* 좋아요 버튼 - showLikeButton prop으로 제어 */}
          {showLikeButton && (
            <button
              onClick={handleLikeToggle}
              disabled={likePostMutation.isPending}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${isLiked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                } ${likePostMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            >
              <Image
                src="/likeIcon.svg"
                alt=""
                width={16}
                height={16}
                className={isLiked ? 'text-red-600' : 'text-gray-600'}
              />
              <span>{likeCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* 썸네일 및 옵션 영역 */}
      <div className="relative w-44 h-32">
        {isMyPage && (
          <button
            aria-label="게시글 옵션 더보기"
            className="absolute right-3 -top-1 p-1 hover:opacity-80 z-10"
          >
            <Image
              src="/dot3.svg"
              alt="더보기"
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