"use client";

import MarkdownViewer from "@/components/features/posts/MarkdownViewer";
import PostCommentsSection from "@/components/features/posts/PostCommentsSection";
import PostHeader from "@/components/features/posts/PostHeader";
import PostStats from "@/components/features/posts/PostStats";
import { usePost } from "@/hooks/queries/usePostQueries";
import { CommentData } from "@/types/comment";
import { notFound, useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function PostPage() {
  const params = useParams();
  const postId = Number(params.id);

  // URL 파라미터 유효성 검사
  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  // usePost 훅을 사용하여 데이터 가져오기
  const {
    data: post,
    isLoading,
    error,
    isFetching
  } = usePost(postId);

  console.log('Post data:', post);
  console.log('Loading states:', { isLoading, isFetching });

  // 댓글 데이터 변환 (메모이제이션으로 최적화)
  const initialUiComments: CommentData[] = useMemo(() => {
    if (!post?.comments || !Array.isArray(post.comments)) return [];

    return post.comments.map(comment => ({
      commentId: comment.commentId,
      writer: comment.writer,
      writerProfileImageUrl: comment.writerProfileImageUrl,
      content: comment.content,
      createdAt: new Date(comment.createdAt).toLocaleDateString('ko-KR'),
      replies: comment.replies || [],
    }));
  }, [post?.comments]);

  // 로딩 상태 (초기 로딩만 체크)
  if (isLoading) {
    return (
      <main className="mx-16 my-16">
        <div className="flex justify-center items-center py-20">
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
          <div className="text-gray-500 mt-2">{error.message}</div>
        </div>
      </main>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-16 my-16">
      <article className="border-b border-[#D5D9E3] py-8">
        <PostHeader post={post} postId={postId} />
        <MarkdownViewer content={post.content} />
        {/* 게시글 좋아요 버튼 및 댓글 개수 노출 */}
        <PostStats
          postId={postId}
          initialLikesCount={post.likesCount || 0} // 실제 좋아요 개수 사용
          initialIsLiked={false} // TODO: 실제 사용자의 좋아요 상태로 변경
          commentsCount={post.comments?.length || 0} // 댓글 개수 (안전한 접근)
        />
      </article>

      <PostCommentsSection
        postId={postId}
        initialComments={initialUiComments}
      />
    </main>
  );
}