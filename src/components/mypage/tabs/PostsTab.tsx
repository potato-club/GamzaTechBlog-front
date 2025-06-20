/**
 * 마이페이지 게시글 탭 컴포넌트
 * 
 * 사용자가 작성한 게시글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import PostList from "@/components/features/posts/PostList";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPosts } from "@/hooks/queries/useMyPageQueries";

export default function PostsTab() {
  const { data: posts = [], isLoading, error } = useMyPosts();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 mt-8">
        {/* 게시글 로딩 스켈레톤 */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-2">
            게시글을 불러올 수 없습니다
          </p>
          <p className="text-red-600 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  // 데이터 표시
  if (posts.length === 0) {
    return (
      <div className="text-center mt-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">작성한 게시글이 없습니다</p>
        <p className="text-gray-400 text-sm">첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  return <PostList posts={posts} />;
}
