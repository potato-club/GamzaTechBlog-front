"use client";

/**
 * 메인 페이지 콘텐츠 컴포넌트
 *
 * TanStack Query를 사용하여 게시글과 태그 데이터를 효율적으로 관리합니다.
 * 서버 컴포넌트에서 클라이언트 컴포넌트로 변경하여
 * 실시간 데이터 업데이트와 캐싱의 이점을 활용합니다.
 */

import {
  PagedResponsePostListResponse,
  PostListResponse,
  PostPopularResponse,
} from "@/generated/api/models";
import { usePosts, usePostsByTag } from "@/hooks/queries/usePostQueries";
import { usePagination } from "@/hooks/usePagination";
import { useTagStore } from "@/store/tagStore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomPagination from "../../shared/navigation/CustomPagination";
import MainPageSidebar from "./MainPageSidebar";

import { BLOG_DESCRIPTIONS as blogDescriptions } from "@/constants/textConstants";
import PostList from "../../features/posts/components/PostList";
import PostListSkeleton from "../../features/posts/skeletons/PostListSkeleton";
import LogoSkeleton from "../../skeletons/LogoSkeleton";
import SidebarSkeleton from "../../skeletons/SidebarSkeleton";

interface MainPageContentProps {
  initialPosts?: PagedResponsePostListResponse | null;
  initialPopularPosts?: PostPopularResponse[] | null;
  initialTags?: string[] | null;
  searchParams?: { tag?: string; page?: string };
}

export default function MainPageContent({
  initialPosts = null,
  initialPopularPosts = null,
  initialTags = null,
  searchParams,
}: MainPageContentProps) {
  // 랜덤 문장 상태
  const [currentDescription, setCurrentDescription] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // 로고 클릭 핸들러
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      // 메인 페이지에서 클릭 시 새로고침
      window.location.reload();
    } else {
      // 다른 페이지에서 클릭 시 메인 페이지로 이동
      router.push("/");
    }
  };

  // 컴포넌트 마운트 시 랜덤 문장 설정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * blogDescriptions.length);
    setCurrentDescription(blogDescriptions[randomIndex]);
  }, []); // 의존성 배열 수정

  const { selectedTag } = useTagStore();
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 10;

  /**
   * TanStack Query로 게시글 목록을 가져옵니다.
   * 서버에서 제공된 초기 데이터를 활용하여 빠른 초기 로딩을 제공합니다.
   */
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = usePosts(
    {
      page: currentPageForAPI,
      size: pageSize,
      sort: ["createdAt,desc"],
    },
    {
      enabled: !selectedTag, // 태그가 없을 때만 실행
      initialData: !selectedTag && currentPage === 1 && initialPosts ? initialPosts : undefined, // 첫 페이지는 서버 데이터 사용
    }
  );

  const {
    data: postsByTagData,
    isLoading: isLoadingPostsByTag,
    error: postsByTagError,
  } = usePostsByTag(
    selectedTag!,
    {
      page: currentPageForAPI,
      size: pageSize,
      sort: ["createdAt,desc"],
    },
    {
      enabled: !!selectedTag, // 태그가 있을 때만 실행
      initialData:
        selectedTag && currentPage === 1 && searchParams?.tag === selectedTag && initialPosts
          ? initialPosts
          : undefined,
    }
  );

  // 현재 조건에 맞는 데이터와 상태를 선택
  const postResponse: PagedResponsePostListResponse | undefined = selectedTag
    ? postsByTagData
    : postsData;
  const isLoading = selectedTag ? isLoadingPostsByTag : isLoadingPosts;
  const error = selectedTag ? postsByTagError : postsError;

  const posts: PostListResponse[] = postResponse?.content || [];
  const totalPages = postResponse?.totalPages || 0;

  // 페이지 변경 핸들러 (URL 기반)
  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용
  };

  // 초기 로딩 중일 때만 전체 스켈레톤 표시 (initialData가 없고 첫 로딩인 경우)
  const showFullPageLoading = isLoading && !initialPosts && !initialPopularPosts && !initialTags;

  if (showFullPageLoading) {
    return (
      <div className="mx-auto flex flex-col gap-12">
        <LogoSkeleton />
        <div className="flex pb-10">
          <main className="flex-3">
            <div className="mb-6 h-8 w-32 rounded bg-gray-200"></div>
            <PostListSkeleton count={3} />
          </main>
          <SidebarSkeleton />
        </div>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <div className="mx-auto flex flex-col gap-30">
        <section className="text-center">
          <div onClick={handleLogoClick} className="inline-block cursor-pointer">
            <Image
              src="/logo2.svg"
              alt="메인페이지 로고"
              width={255}
              height={230}
              className="mx-auto"
              priority // 메인 로고는 우선 로딩
            />
          </div>
        </section>

        <div className="flex justify-center pb-10">
          <div className="text-center text-red-500">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm text-gray-500">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-12">
      <section className="mt-5 text-center">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <Image
            src="/logo2.svg"
            alt="메인페이지 로고"
            width={255}
            height={230}
            className="mx-auto"
            priority // 메인 로고는 우선 로딩 (LCP 개선)
          />
          <p className="mt-2 text-2xl font-light">{currentDescription}</p>
        </div>
      </section>
      <div className="flex pb-10">
        <main className="flex-3">
          {" "}
          {/* 주요 콘텐츠 영역 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {selectedTag ? `#${selectedTag} 태그 게시글` : "Posts"}
            </h2>
          </div>
          <PostList
            posts={posts}
            isLoading={isLoading}
            emptyMessage={
              selectedTag ? `#${selectedTag} 태그의 게시글이 없습니다` : "게시글이 없습니다"
            }
            emptyDescription={
              selectedTag ? "다른 태그를 선택해보세요!" : "첫 번째 게시글을 작성해보세요!"
            }
          />
          <CustomPagination
            currentPage={currentPage} // 이미 1부터 시작하는 값
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        </main>
        <MainPageSidebar initialPopularPosts={initialPopularPosts} initialTags={initialTags} />
      </div>
    </div>
  );
}
