"use client";

import PostHeader from "@/components/features/posts/PostHeader";
import PostStats from "@/components/features/posts/PostStats";
import { CommentResponse } from "@/generated/api/models";
import { usePost } from "@/hooks/queries/usePostQueries";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { DynamicMarkdownViewer, DynamicPostCommentsSection } from "../../dynamic/DynamicComponents";

/**
 * 게시글 상세 페이지 클라이언트 컴포넌트
 *
 * 인터랙티브 기능들을 담당합니다:
 * - 좋아요 버튼 클릭
 * - 댓글 작성/수정/삭제
 * - 실시간 데이터 업데이트
 */
interface PostPageClientProps {
  postId: number;
}

export default function PostPageClient({ postId }: PostPageClientProps) {
  // usePost 훅을 사용하여 데이터 가져오기
  const { data: post, isLoading, error, isFetching } = usePost(postId);

  console.log("Post data:", post);
  console.log("Loading states:", { isLoading, isFetching });

  // 댓글 데이터 변환 (메모이제이션으로 최적화)
  const initialUiComments: CommentResponse[] = useMemo(() => {
    if (!post?.comments || !Array.isArray(post.comments)) return [];

    return post.comments.map((comment) => ({
      ...comment,
      commentId: comment.commentId ?? 0,
      writer: comment.writer ?? "",
      writerProfileImageUrl: comment.writerProfileImageUrl ?? "",
      content: comment.content ?? "",
      createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
    }));
  }, [post?.comments]);

  // 로딩 상태 (초기 로딩만 체크)
  if (isLoading) {
    return (
      <main className="mx-16 my-16">
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
        </div>
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main className="mx-16 my-16">
        <div className="container mx-auto py-10 text-center">
          <div className="text-red-600">게시물을 불러오는 중 오류가 발생했습니다.</div>
          <div className="mt-2 text-gray-500">{error.message}</div>
        </div>
      </main>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-16 my-16 max-w-full overflow-hidden">
      <article className="max-w-full border-b border-[#D5D9E3] py-8">
        <PostHeader post={post} postId={postId} />
        <DynamicMarkdownViewer content={post.content || ""} />
        {/* 게시글 좋아요 버튼 및 댓글 개수 노출 */}
        <PostStats
          postId={postId}
          initialLikesCount={post.likesCount || 0} // 실제 좋아요 개수 사용
          commentsCount={post.comments?.length || 0} // 댓글 개수 (안전한 접근)
        />
      </article>

      <DynamicPostCommentsSection postId={postId} initialComments={initialUiComments} />
    </main>
  );
}
