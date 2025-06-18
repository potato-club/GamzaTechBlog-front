"use client";

/**
 * 마이페이지 메인 컴포넌트
 * 
 * TanStack Query를 사용하여 사용자의 게시글, 댓글, 좋아요 데이터를 
 * 효율적으로 관리하고 탭별로 분기하여 표시합니다.
 */

import CommentList from "@/components/features/comments/CommentList";
import LikeList from "@/components/features/posts/LikeList";
import PostList from "@/components/features/posts/PostList";
import TabMenu from "@/components/TabMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPageData } from "@/hooks/queries/useMyPageQueries"; // TanStack Query 기반 훅으로 교체
import { useMyPageTab } from "@/hooks/useMyPageTab";

export default function MyPage() {
  const { currentTab, handleTabChange } = useMyPageTab();

  /**
   * TanStack Query를 사용하여 마이페이지 데이터를 가져옵니다.
   * 
   * 기존의 정적 데이터 대신 실제 서버 데이터를 사용하며:
   * - 자동 캐싱: 탭 전환 시에도 데이터를 다시 로드하지 않음
   * - 백그라운드 갱신: 데이터가 오래되면 자동으로 업데이트
   * - 로딩/에러 상태: 각 섹션별로 개별 관리
   * - 최적화된 UX: 로딩 중에도 다른 탭으로 전환 가능
   */
  const {
    posts,
    comments,
    likes,
    isLoadingPosts,
    isLoadingComments,
    isLoadingLikes,
    postsError,
    commentsError,
    likesError
  } = useMyPageData();
  /**
   * 각 탭별 콘텐츠를 렌더링합니다.
   * 
   * 로딩/에러 상태를 개별적으로 처리하여 
   * 사용자에게 적절한 피드백을 제공합니다.
   */
  const renderTabContent = () => {
    switch (currentTab) {
      case "posts": if (isLoadingPosts) {
        return (
          <div className="flex flex-col gap-8 mt-8">
            {/* 게시글 로딩 스켈레톤 - shadcn/ui Skeleton 사용 */}
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
        if (postsError) {
          return (
            <div className="mt-8 text-center text-red-500">
              <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-sm text-gray-500 mt-2">{postsError.message}</p>
            </div>
          );
        }
        return <PostList posts={posts} />;

      case "comments": if (isLoadingComments) {
        return (
          <div className="flex flex-col gap-4 mt-8">
            {/* 댓글 로딩 스켈레톤 - shadcn/ui Skeleton 사용 */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl px-6 py-5 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        );
      }
        if (commentsError) {
          return (
            <div className="mt-8 text-center text-red-500">
              <p>댓글을 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-sm text-gray-500 mt-2">{commentsError.message}</p>
            </div>
          );
        }
        // 마이페이지 댓글 목록은 특정 postId가 없으므로 임시로 0을 전달
        // TODO: 댓글 목록 컴포넌트를 마이페이지용으로 별도 생성하거나 
        //       postId를 옵셔널로 변경하는 것을 고려
        return <CommentList comments={comments} postId={0} />;

      case "likes": if (isLoadingLikes) {
        return (
          <div className="flex flex-col gap-8 mt-8">
            {/* 좋아요 목록 로딩 스켈레톤 - shadcn/ui Skeleton 사용 */}
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
        if (likesError) {
          return (
            <div className="mt-8 text-center text-red-500">
              <p>좋아요 목록을 불러오는 중 오류가 발생했습니다.</p>
              <p className="text-sm text-gray-500 mt-2">{likesError.message}</p>
            </div>
          );
        }
        return <LikeList likes={likes} />;

      default:
        return <PostList posts={posts} />;
    }
  };
  return (
    <>
      {/* 
          실제 구현 시에는 useMyPageData 훅 또는 다른 방법을 통해 
          동적으로 userProfile 데이터를 가져와서 전달해야 합니다.
          예: <Sidebar userProfile={actualUserProfile} onProfileUpdate={handleActualProfileUpdate} /> 
        */}

      <section className="flex-1" aria-label="마이페이지 콘텐츠"> {/* flex-1 추가하여 남은 공간 채우도록 */}
        <TabMenu
          tab={currentTab}
          onTabChange={handleTabChange}
          aria-label="마이페이지 탭 메뉴"
        />

        <div
          role="tabpanel"
          aria-labelledby={`${currentTab}-tab`}
          key={currentTab} // 탭 변경 시 리렌더링 최적화
          className="mt-6" // 탭 콘텐츠와 탭 메뉴 사이 간격
        >
          <div className="px-10">
            <div className="min-w-[700px] mx-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}