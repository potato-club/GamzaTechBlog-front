/**
 * 좋아요 Optimistic Mutation 훅
 *
 * Orval 생성 훅(useLikePost, useUnlikePost)을 래핑하여
 * RQ onMutate 기반의 Optimistic Update를 제공합니다.
 */

import { useLikePost, useUnlikePost } from "@/generated/orval/api";
import { useState } from "react";

interface UseLikeOptimisticOptions {
  initialIsLiked: boolean;
  initialLikesCount: number;
}

interface LikeState {
  isLiked: boolean;
  likesCount: number;
}

export function useLikeOptimistic({ initialIsLiked, initialLikesCount }: UseLikeOptimisticOptions) {
  // 서버와 동기화된 상태
  const [likeState, setLikeState] = useState<LikeState>({
    isLiked: initialIsLiked,
    likesCount: initialLikesCount,
  });

  // Orval 생성 Mutation 훅 - RQ onMutate 기반 Optimistic Update
  const likeMutation = useLikePost({
    mutation: {
      onMutate: async () => {
        // 이전 상태 저장 (롤백용)
        const previousState = { ...likeState };

        // Optimistic Update: 즉시 UI 반영
        setLikeState((prev) => ({
          isLiked: true,
          likesCount: prev.likesCount + 1,
        }));

        return { previousState };
      },
      onError: (error, _variables, context) => {
        console.error("좋아요 추가 실패:", error);
        // 롤백: 이전 상태로 복원
        if (context?.previousState) {
          setLikeState(context.previousState);
        }
        alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      },
      // onSuccess는 필요 없음 - onMutate에서 이미 상태 변경됨
    },
  });

  const unlikeMutation = useUnlikePost({
    mutation: {
      onMutate: async () => {
        // 이전 상태 저장 (롤백용)
        const previousState = { ...likeState };

        // Optimistic Update: 즉시 UI 반영
        setLikeState((prev) => ({
          isLiked: false,
          likesCount: prev.likesCount - 1,
        }));

        return { previousState };
      },
      onError: (error, _variables, context) => {
        console.error("좋아요 취소 실패:", error);
        // 롤백: 이전 상태로 복원
        if (context?.previousState) {
          setLikeState(context.previousState);
        }
        alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      },
    },
  });

  const toggleLike = (postId: number) => {
    if (likeMutation.isPending || unlikeMutation.isPending) {
      return;
    }

    if (likeState.isLiked) {
      unlikeMutation.mutate({ postId });
    } else {
      likeMutation.mutate({ postId });
    }
  };

  return {
    isLiked: likeState.isLiked,
    likesCount: likeState.likesCount,
    isPending: likeMutation.isPending || unlikeMutation.isPending,
    toggleLike,
  };
}
