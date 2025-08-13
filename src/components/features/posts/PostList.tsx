"use client";

/**
 * 게시글 목록 컴포넌트
 *
 * 게시글 목록 표시와 관련된 모든 로직을 담당합니다:
 * - 게시글 목록 렌더링
 * - 로딩 상태 처리
 * - 빈 상태 처리
 * - 검색 키워드 하이라이트
 */

import { PostListResponse } from "@/generated/api/models";
import PostListSkeleton from "../../skeletons/PostListSkeleton";
import PostCard from "./PostCard";

interface PostListProps {
  posts: PostListResponse[];
  isLoading?: boolean;
  searchKeyword?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

export default function PostList({
  posts,
  isLoading = false,
  searchKeyword,
  emptyMessage = "게시글이 없습니다",
  emptyDescription = "첫 번째 게시글을 작성해보세요!",
}: PostListProps) {
  // 로딩 상태 처리
  if (isLoading) {
    return <PostListSkeleton count={3} />;
  }

  // 빈 상태 처리
  if (posts.length === 0) {
    return (
      <div className="mt-8 py-16 text-center text-gray-500">
        <p className="mb-2 text-lg">{emptyMessage}</p>
        <p className="text-sm">{emptyDescription}</p>
      </div>
    );
  }

  // 게시글 목록 렌더링
  return (
    <div className="mt-8 flex flex-col gap-8">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} searchKeyword={searchKeyword} />
      ))}
    </div>
  );
}
