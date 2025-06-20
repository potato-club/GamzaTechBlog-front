/**
 * 마이페이지 좋아요 탭 컴포넌트
 * 
 * 사용자가 좋아요한 게시글 목록을 표시하며,
 * 로딩, 에러, 빈 상태를 독립적으로 관리합니다.
 */

import LikeList from "@/components/features/posts/LikeList";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyLikes } from "@/hooks/queries/useMyPageQueries";

export default function LikesTab() {
  const { data: likes = [], isLoading, error } = useMyLikes();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 mt-8">
        {/* 좋아요 목록 로딩 스켈레톤 */}
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
            좋아요 목록을 불러올 수 없습니다
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
  if (likes.length === 0) {
    return (
      <div className="text-center mt-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">좋아요한 게시글이 없습니다</p>
        <p className="text-gray-400 text-sm">마음에 드는 게시글에 좋아요를 눌러보세요!</p>
      </div>
    );
  }

  return <LikeList likes={likes} />;
}
