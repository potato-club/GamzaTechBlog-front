"use client";

/**
 * 메인 페이지 콘텐츠 컴포넌트
 * 
 * TanStack Query를 사용하여 게시글과 태그 데이터를 효율적으로 관리합니다.
 * 서버 컴포넌트에서 클라이언트 컴포넌트로 변경하여 
 * 실시간 데이터 업데이트와 캐싱의 이점을 활용합니다.
 */

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePosts, useTags } from "@/hooks/queries/usePostQueries";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PostCard from "./features/posts/PostCard";
import MainPageSidebar from "./layout/sidebar/MainPageSidebar";

export default function MainPageContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;

  /**
   * TanStack Query로 게시글 목록을 가져옵니다.
   * 
   * 자동 캐싱: 동일한 요청은 캐시에서 즉시 반환
   * 백그라운드 갱신: 데이터가 오래되면 백그라운드에서 자동 업데이트
   * 로딩/에러 상태: 별도 state 관리 없이 자동 제공
   */
  const {
    data: postResponse,
    isLoading: isLoadingPosts,
    error: postsError
  } = usePosts({
    page: currentPage,
    size: pageSize,
    sort: ["createdAt,desc"], // 최신순 정렬
  });

  /**
   * TanStack Query로 태그 목록을 가져옵니다.
   * 
   * 태그는 자주 변하지 않으므로 긴 캐시 시간으로 설정되어 있습니다.
   */
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError
  } = useTags();

  const posts = postResponse?.content || [];
  const totalPages = postResponse?.totalPages || 0;
  const totalElements = postResponse?.totalElements || 0;
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터 시작, API는 0부터 시작
  };

  // 페이지 번호 배열 생성 (표시할 페이지 번호들)
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const currentPageUI = currentPage + 1; // UI용 페이지 번호 (1부터 시작)

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, currentPageUI - 2);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoadingPosts || isLoadingTags) {
    return (
      <div className="flex flex-col mt-16 gap-30 mx-auto">
        <section className="text-center">
          <Link href="/">
            <Image
              src="/logo2.svg"
              alt="메인페이지 로고"
              width={320}
              height={230}
              className="mx-auto"
            />
          </Link>
        </section>

        <div className="flex pb-10">
          <main className="flex-3">
            <h2 className="text-2xl font-semibold">Posts</h2>
            {/* 게시글 로딩 스켈레톤 */}
            <div className="flex flex-col gap-8 mt-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </main>

          {/* 사이드바 로딩 스켈레톤 */}
          <aside className="flex-1 ml-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (postsError || tagsError) {
    return (
      <div className="flex flex-col mt-16 gap-30 mx-auto">
        <section className="text-center">
          <Link href="/">
            <Image
              src="/logo2.svg"
              alt="메인페이지 로고"
              width={320}
              height={230}
              className="mx-auto"
            />
          </Link>
        </section>

        <div className="flex pb-10 justify-center">
          <div className="text-center text-red-500">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm text-gray-500 mt-2">
              {postsError?.message || tagsError?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-16 gap-30 mx-auto">
      <section className="text-center">
        <Link href="/">
          <Image
            src="/logo2.svg"
            alt="메인페이지 로고"
            width={320}
            height={230}
            className="mx-auto"
          />
        </Link>
      </section>
      <div className="flex pb-10">
        <main className="flex-3"> {/* 주요 콘텐츠 영역 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Posts</h2>
            <p className="text-sm text-gray-500">
              총 {totalElements}개의 게시글 (페이지 {currentPage + 1} / {totalPages})
            </p>
          </div>

          <div className="flex flex-col gap-8 mt-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  showLikeButton={true} // 메인 페이지에서는 좋아요 버튼 표시
                />
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg mb-2">게시글이 없습니다</p>
                <p className="text-sm">첫 번째 게시글을 작성해보세요!</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* 이전 페이지 */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 0 && handlePageChange(currentPage)}
                      className={currentPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* 첫 번째 페이지 */}
                  {getVisiblePages()[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(1)}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {getVisiblePages()[0] > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* 페이지 번호들 */}
                  {getVisiblePages().map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === currentPage + 1}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* 마지막 페이지 */}
                  {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
                    <>
                      {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {/* 다음 페이지 */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 2)}
                      className={currentPage >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>

        {/* 
          사이드바 컴포넌트 - TanStack Query 기반
          사이드바 내부에서 자체적으로 데이터를 관리하므로 props 전달 불필요
        */}
        <MainPageSidebar />
      </div>
    </div>
  );
}