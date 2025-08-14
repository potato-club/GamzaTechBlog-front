"use client";

/**
 * 검색 페이지 콘텐츠 컴포넌트
 *
 * 메인 페이지와 동일한 구조를 사용하되 로고 섹션은 제외하고
 * 검색 기능을 추가합니다.
 */

import { PostListResponse } from "@/generated/api/models";
import { useSearchPosts } from "@/hooks/queries/usePostQueries";
import { usePagination } from "@/hooks/usePagination";
import { useSearchParams } from "next/navigation";
import PostList from "../../features/posts/components/PostList";
import CustomPagination from "../../shared/navigation/CustomPagination";
import SearchPageSidebar from "./SearchPageSidebar";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

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
      <div className="mx-auto flex flex-col gap-30">
        {/* 메인 페이지 로고 영역만큼의 간격 추가 */}
        <section className="text-center" style={{ height: "262px" }}>
          {/* 로고 이미지(230px) + 텍스트 간격(mt-2) + 텍스트 높이 ≈ 262px */}
        </section>
        <div className="flex pb-10">
          <main className="flex-3">
            <h2 className="text-2xl font-semibold">검색 결과</h2>
            {keyword && (
              <p className="mt-2 mb-6 text-gray-600">&quot;{keyword}&quot;에 대한 검색 결과</p>
            )}
            {/* 게시글 로딩 스켈레톤 */}
            <div className="mt-8 flex flex-col gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </main>

          {/* 사이드바 로딩 스켈레톤 */}
          <aside className="ml-8 flex-1">
            <div className="animate-pulse">
              <div className="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 rounded bg-gray-200"></div>
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
      <div className="mx-auto flex flex-col gap-30">
        {/* 메인 페이지 로고 영역만큼의 간격 추가 */}
        <section className="text-center" style={{ height: "262px" }}>
          {/* 로고 이미지(230px) + 텍스트 간격(mt-2) + 텍스트 높이 ≈ 262px */}
        </section>
        <div className="flex justify-center pb-10">
          <div className="text-center text-red-500">
            <p>검색 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm text-gray-500">
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
      <section className="flex items-center text-[34px]" style={{ height: "262px" }}>
        {/* 로고 이미지(230px) + 텍스트 간격(mt-2) + 텍스트 높이 ≈ 262px */}
        {keyword && (
          <p className="mt-2 text-[#20242B]">
            <span className="text-[#ABB5BD]">Results for</span>{" "}
            <span className="font-semibold">{keyword}</span>
          </p>
        )}
      </section>
      <div className="flex pb-10">
        <main className="flex-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Posts</h2>
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
              className="mt-12"
            />
          )}
        </main>
        <SearchPageSidebar />
      </div>
    </div>
  );
}
