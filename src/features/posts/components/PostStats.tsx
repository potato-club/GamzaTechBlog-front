"use client";

/**
 * 좋아요 버튼 및 댓글 개수 표시 컴포넌트 (RQ Hydration 버전)
 *
 * RQ 캐시에서 게시글 데이터를 읽어 좋아요 상태와 개수를 표시합니다.
 * Optimistic Update로 즉각적인 UI 반응을 제공합니다.
 */

import {
  getGetPostDetailQueryOptions,
  getIsPostLikedQueryOptions,
} from "@/generated/orval/api";
import { useAddLike, useRemoveLike } from "@/features/likes/hooks/useLikeMutations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef } from "react";

interface PostStatsProps {
  postId: number;
  isLoggedIn: boolean;
}

export default function PostStats({ postId, isLoggedIn }: PostStatsProps) {
  const queryClient = useQueryClient();

  // RQ 캐시에서 게시글 상세 데이터 읽기 (Hydration된 데이터)
  const { data: postData } = useQuery({
    ...getGetPostDetailQueryOptions(postId),
    staleTime: Infinity, // 캐시된 데이터 사용
  });

  // RQ 캐시에서 좋아요 상태 읽기 (로그인한 경우에만)
  const { data: likedData } = useQuery({
    ...getIsPostLikedQueryOptions(postId),
    enabled: isLoggedIn,
    staleTime: Infinity,
  });

  const post = postData?.data;
  const isLiked = likedData?.data ?? false;
  const likesCount = post?.likesCount ?? 0;
  const commentsCount = post?.comments?.length ?? 0;

  const likeRollbackRef = useRef<{
    previousPostData?: typeof postData;
    previousLikedData?: typeof likedData;
  } | null>(null);
  const unlikeRollbackRef = useRef<{
    previousPostData?: typeof postData;
    previousLikedData?: typeof likedData;
  } | null>(null);

  const likeMutation = useAddLike(postId, {
    onError: (error) => {
      console.error("좋아요 추가 실패:", error);

      if (likeRollbackRef.current?.previousPostData) {
        queryClient.setQueryData(
          getGetPostDetailQueryOptions(postId).queryKey,
          likeRollbackRef.current.previousPostData
        );
      }

      queryClient.setQueryData(
        getIsPostLikedQueryOptions(postId).queryKey,
        likeRollbackRef.current?.previousLikedData ?? { data: false }
      );

      alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const unlikeMutation = useRemoveLike(postId, {
    onError: (error) => {
      console.error("좋아요 취소 실패:", error);

      if (unlikeRollbackRef.current?.previousPostData) {
        queryClient.setQueryData(
          getGetPostDetailQueryOptions(postId).queryKey,
          unlikeRollbackRef.current.previousPostData
        );
      }

      queryClient.setQueryData(
        getIsPostLikedQueryOptions(postId).queryKey,
        unlikeRollbackRef.current?.previousLikedData ?? { data: true }
      );

      alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    if (likeMutation.isPending || unlikeMutation.isPending) {
      return;
    }

    if (isLiked) {
      unlikeRollbackRef.current = {
        previousPostData: queryClient.getQueryData(getGetPostDetailQueryOptions(postId).queryKey),
        previousLikedData: queryClient.getQueryData(getIsPostLikedQueryOptions(postId).queryKey),
      };

      queryClient.setQueryData(
        getGetPostDetailQueryOptions(postId).queryKey,
        (old: typeof postData) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              likesCount: Math.max((old.data.likesCount ?? 0) - 1, 0),
            },
          };
        }
      );

      queryClient.setQueryData(
        getIsPostLikedQueryOptions(postId).queryKey,
        (old: typeof likedData) => (old ? { ...old, data: false } : { data: false })
      );

      unlikeMutation.mutate();
    } else {
      likeRollbackRef.current = {
        previousPostData: queryClient.getQueryData(getGetPostDetailQueryOptions(postId).queryKey),
        previousLikedData: queryClient.getQueryData(getIsPostLikedQueryOptions(postId).queryKey),
      };

      queryClient.setQueryData(
        getGetPostDetailQueryOptions(postId).queryKey,
        (old: typeof postData) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              likesCount: (old.data.likesCount ?? 0) + 1,
            },
          };
        }
      );

      queryClient.setQueryData(
        getIsPostLikedQueryOptions(postId).queryKey,
        (old: typeof likedData) => (old ? { ...old, data: true } : { data: true })
      );

      likeMutation.mutate();
    }
  };

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  return (
    <div className="mt-4 flex items-center gap-6">
      {/* 좋아요 버튼 */}
      <button
        type="button"
        className={`flex items-center gap-2 transition-opacity ${
          isPending ? "cursor-not-allowed opacity-50" : "hover:opacity-80"
        } ${!isLoggedIn ? "opacity-60" : ""}`}
        onClick={handleLikeClick}
        disabled={isPending}
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
        <span className="text-sm text-gray-600">좋아요 {likesCount}</span>
      </button>

      {/* 댓글 개수 */}
      <div className="flex items-center gap-2">
        <Image src="/commentIcon.svg" alt="댓글" width={16} height={16} className="opacity-60" />
        <span className="text-sm text-gray-600">댓글 {commentsCount}</span>
      </div>
    </div>
  );
}
