"use client";

import { useAddLike, useLikeStatus, useRemoveLike } from "@/features/posts";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PostStatsProps {
  postId: number;
  initialLikesCount: number;
  initialIsLiked?: boolean;
  commentsCount: number;
}

export default function PostStats({
  postId,
  initialLikesCount,
  initialIsLiked = false,
  commentsCount = 0,
}: PostStatsProps) {
  const { isLoggedIn } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  // 실제 좋아요 상태를 API에서 가져오기
  const { data: actualLikeStatus, isLoading: isLikeStatusLoading } = useLikeStatus(
    postId,
    isLoggedIn
  );
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // 실제 좋아요 상태가 로드되면 상태 업데이트
  useEffect(() => {
    if (actualLikeStatus !== undefined) {
      setIsLiked(actualLikeStatus);
    }
  }, [actualLikeStatus]);

  const addLikeMutation = useAddLike(postId);
  const removeLikeMutation = useRemoveLike(postId);

  const handleLikeClick = async () => {
    // 로그인하지 않은 경우 알림 표시
    if (!isLoggedIn) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    // 이미 뮤테이션이 진행 중인 경우 중복 요청 방지
    if (addLikeMutation.isPending || removeLikeMutation.isPending) {
      return;
    }

    try {
      if (isLiked) {
        // 좋아요 취소
        await removeLikeMutation.mutateAsync();
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        // 좋아요 추가
        await addLikeMutation.mutateAsync();
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const isLoading =
    addLikeMutation.isPending || removeLikeMutation.isPending || isLikeStatusLoading;

  return (
    <div className="mt-4 flex items-center gap-6">
      {/* 좋아요 버튼 */}
      <button
        type="button"
        className={`flex items-center gap-2 transition-opacity ${
          isLoading ? "cursor-not-allowed opacity-50" : "hover:opacity-80"
        } ${!isLoggedIn ? "opacity-60" : ""}`}
        onClick={handleLikeClick}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
        >
          <path
            d="M8.29 3.55496C6.67 -0.247531 1 0.157469 1 5.01749C1 9.87752 8.29 13.9276 8.29 13.9276C8.29 13.9276 15.58 9.87752 15.58 5.01749C15.58 0.157469 9.91 -0.247531 8.29 3.55496Z"
            stroke="#FF5E5E"
            strokeWidth="1.62"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isLiked ? "#FF5E5E" : "none"}
            className="transition-all duration-200"
          />
        </svg>
        <span className="text-sm text-gray-600">
          {isLoading ? "처리 중..." : `좋아요 ${likesCount}`}
        </span>
      </button>

      {/* 댓글 개수 */}
      <div className="flex items-center gap-2">
        <Image src="/commentIcon.svg" alt="댓글" width={16} height={16} className="opacity-60" />
        <span className="text-sm text-gray-600">댓글 {commentsCount}</span>
      </div>
    </div>
  );
}
