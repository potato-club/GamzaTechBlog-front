"use client";

/**
 * 검색 페이지 콘텐츠 컴포넌트
 *
 * 메인 페이지와 동일한 구조를 사용하되 로고 섹션은 제외하고
 * 검색 기능을 추가합니다.
 */

import CustomPagination from "@/components/shared/navigation/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PostList, useSearchPosts } from "@/features/posts";
import { PostListResponse } from "@/generated/api/models";
import { usePagination } from "@/hooks/usePagination";
import { useSearchParams } from "next/navigation";
import SearchPageSidebar from "./SearchPageSidebar";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("q") || "";

  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 10;

  /**
   * 검색 결과를 가져옵니다.
   */
  const {
    data: postResponse,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useSearchPosts(keyword, {
    page: currentPageForAPI,
    size: pageSize,
    sort: ["createdAt,desc"],
  });

  const posts: PostListResponse[] = postResponse?.content || [];
  const totalPages = postResponse?.totalPages || 0;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoadingPosts) {
    return (
      <div className="mx-auto flex flex-col gap-3">
        {/* 메인 페이지 로고 영역만큼의 간격 추가 */}
        <section className="flex h-[120px] items-center text-[24px] md:h-[262px] md:text-[34px]">
          {/* 모바일: 축소된 높이와 폰트, 데스크톱: 기존 유지 */}
          {keyword && (
            <p className="mt-2 text-[#20242B]">
              <span className="text-[#ABB5BD]">Results for</span>{" "}
              <span className="font-semibold">{keyword}</span>
            </p>
          )}
        </section>

        <div className="flex flex-col pb-6 md:flex-row md:pb-10">
          <section className="w-full md:flex-3">
            <h2 className="text-xl font-semibold md:text-2xl">검색 결과</h2>
            {keyword && (
              <p className="mt-2 mb-4 text-sm text-gray-600 md:mb-6 md:text-base">
                &quot;{keyword}&quot;에 대한 검색 결과
              </p>
            )}
            {/* 게시글 로딩 스켈레톤 */}
            <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-3/4 md:h-6" />
                  <Skeleton className="h-3 w-1/2 md:h-4" />
                  <Skeleton className="h-3 w-full md:h-4" />
                </div>
              ))}
            </div>
          </section>

          {/* 사이드바 로딩 스켈레톤 - 모바일에서는 숨김, 데스크톱에서만 표시 */}
          <aside className="ml-10 hidden flex-1 border-l border-[#D5D9E3] pl-10 md:block">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (postsError) {
    return (
      <div className="mx-auto flex flex-col gap-3">
        {/* 메인 페이지 로고 영역만큼의 간격 추가 */}
        <section className="flex h-[120px] items-center text-[24px] md:h-[262px] md:text-[34px]">
          {/* 모바일: 축소된 높이와 폰트, 데스크톱: 기존 유지 */}
          {keyword && (
            <p className="mt-2 text-[#20242B]">
              <span className="text-[#ABB5BD]">Results for</span>{" "}
              <span className="font-semibold">{keyword}</span>
            </p>
          )}
        </section>

        <div className="flex justify-center pb-6 md:pb-10">
          <div className="text-center text-red-500">
            <p className="text-base md:text-lg">검색 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm text-gray-500 md:text-base">
              {postsError?.message || "알 수 없는 오류가 발생했습니다."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-3">
      {/* 메인 페이지 로고 영역만큼의 간격 추가 */}
      <section className="flex h-[120px] items-center text-[24px] md:h-[262px] md:text-[34px]">
        {/* 모바일: 축소된 높이와 폰트, 데스크톱: 기존 유지 */}
        {keyword && (
          <p className="mt-2 text-[#20242B]">
            <span className="text-[#ABB5BD]">Results for</span>{" "}
            <span className="font-semibold">{keyword}</span>
          </p>
        )}
      </section>
      <div className="flex flex-col pb-6 md:flex-row md:pb-10">
        <section className="w-full md:flex-3">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <div>
              <h2 className="text-xl font-semibold md:text-2xl">Posts</h2>
            </div>
          </div>

          <PostList
            posts={posts}
            isLoading={isLoadingPosts}
            searchKeyword={keyword}
            emptyMessage={
              keyword ? `"${keyword}"에 대한 검색 결과가 없습니다` : "검색어를 입력해주세요"
            }
            emptyDescription={
              keyword ? "다른 키워드로 검색해보세요." : "원하는 게시글을 찾아보세요!"
            }
          />

          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8 md:mt-12"
            />
          )}
        </section>

        <SearchPageSidebar />
      </div>
    </div>
  );
}
