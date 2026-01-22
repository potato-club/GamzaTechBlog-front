/**
 * 검색 페이지 콘텐츠 컴포넌트
 *
 * 메인 페이지와 동일한 구조를 사용하되 로고 섹션은 제외하고
 * 검색 기능을 추가합니다.
 */

import PaginationWrapper from "@/components/shared/pagination/PaginationWrapper";
import PostList from "@/features/posts/components/PostList";
import { createPostServiceServer } from "@/features/posts/services/postService.server";
import type { Pageable, PostListResponse, PostPopularResponse } from "@/generated/orval/models";
import SearchPageSidebar from "./SearchPageSidebar";

interface SearchPageContentProps {
  searchParams: {
    q?: string | string[];
    page?: string | string[];
  };
}

export default async function SearchPageContent({ searchParams }: SearchPageContentProps) {
  const resolveParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[value.length - 1] : value;
  const keyword = resolveParam(searchParams.q)?.trim() || "";
  const currentPage = Number(resolveParam(searchParams.page)) || 1;
  const pageSize = 10;

  const queryParams: Pageable = {
    page: currentPage - 1,
    size: pageSize,
    sort: ["createdAt,desc"],
  };

  const postService = createPostServiceServer();
  let posts: PostListResponse[] = [];
  let totalPages = 0;
  let postsError: string | null = null;
  let popularPosts: PostPopularResponse[] = [];

  try {
    if (keyword) {
      const postResponse = await postService.searchPosts(keyword, queryParams, {
        cache: "no-store",
      });
      posts = postResponse.content || [];
      totalPages = postResponse.totalPages || 0;
    }
  } catch (error) {
    postsError = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  }

  try {
    popularPosts = await postService.getPopularPosts({ next: { revalidate: 600 } });
  } catch (error) {
    console.warn(
      "Failed to fetch popular posts:",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    );
  }

  if (postsError) {
    return (
      <div className="mx-auto flex flex-col gap-3">
        <section className="flex h-[120px] items-center text-[24px] md:h-[262px] md:text-[34px]">
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
            <p className="mt-2 text-sm text-gray-500 md:text-base">{postsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-3">
      <section className="flex h-[120px] items-center text-[24px] md:h-[262px] md:text-[34px]">
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
            searchKeyword={keyword}
            emptyMessage={
              keyword ? `"${keyword}"에 대한 검색 결과가 없습니다` : "검색어를 입력해주세요"
            }
            emptyDescription={
              keyword ? "다른 키워드로 검색해보세요." : "원하는 게시글을 찾아보세요!"
            }
          />

          {totalPages > 1 && (
            <PaginationWrapper
              totalPages={totalPages}
              scrollToTop={false}
              extraParams={{ q: keyword }}
              className="mt-8 md:mt-12"
            />
          )}
        </section>

        <SearchPageSidebar popularPosts={popularPosts} />
      </div>
    </div>
  );
}
