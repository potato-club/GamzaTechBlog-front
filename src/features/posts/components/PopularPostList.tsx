"use client";

/**
 * 인기 게시글 목록 컴포넌트
 *
 * TanStack Query를 사용하여 인기 게시글 데이터를
 * 자동으로 관리하고 로딩/에러 상태를 처리합니다.
 */

import { PopularPost, PopularPostListSkeleton, usePopularPosts } from "@/features/posts";
import { PostPopularResponse } from "@/generated/api/models";

interface PopularPostListProps {
  initialData?: PostPopularResponse[] | null;
}

export default function PopularPostList({ initialData = null }: PopularPostListProps) {
  /**
   * TanStack Query를 사용하여 인기 게시글 목록을 가져옵니다.
   *
   * 이 훅의 장점:
   * - 자동 캐싱: 동일한 데이터를 여러 컴포넌트에서 공유
   * - 백그라운드 갱신: 데이터가 오래되면 자동으로 업데이트
   * - 로딩/에러 상태: 별도 state 관리 없이 자동 제공
   * - 재시도 로직: 네트워크 오류 시 자동 재시도
   */
  const {
    data: posts,
    isLoading,
    error,
  } = usePopularPosts({
    initialData: initialData || undefined,
  });

  return (
    <section>
      <h3 className="mb-7 text-[18px] text-[#838C9D]">주간 인기 게시물</h3>

      {/* 로딩 상태 처리 */}
      {isLoading && <PopularPostListSkeleton count={3} />}

      {/* 에러 상태 처리 */}
      {error && (
        <div className="mt-7 text-sm text-red-500">
          <p>인기 게시글을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      )}

      {/* 성공 상태: 인기 게시글 목록 표시 */}
      {posts && !isLoading && !error && (
        <>
          {posts
            .filter((post) => post.postId && post.title && post.writer) // 필수 데이터가 있는 게시글만 필터링
            .map((post) => (
              <PopularPost
                key={post.postId}
                postId={post.postId!}
                title={post.title!}
                author={post.writer!}
                profileImage={post.writerProfileImageUrl}
              />
            ))}
        </>
      )}

      {/* 데이터가 없는 경우 */}
      {posts && posts.length === 0 && !isLoading && !error && (
        <div className="mt-7 text-sm text-gray-500">
          <p>인기 게시글이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
