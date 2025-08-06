"use client";

/**
 * 메인 페이지 콘텐츠 컴포넌트
 *
 * TanStack Query를 사용하여 게시글과 태그 데이터를 효율적으로 관리합니다.
 * 서버 컴포넌트에서 클라이언트 컴포넌트로 변경하여
 * 실시간 데이터 업데이트와 캐싱의 이점을 활용합니다.
 */

import { PostResponse } from "@/generated/api";
import { useTagStore } from "@/store/tagStore";
import { usePosts, usePostsByTag } from "@/hooks/queries/usePostQueries";
import { usePagination } from "@/hooks/usePagination";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomPagination from "./common/CustomPagination";
import PostCard from "./features/posts/PostCard";
import MainPageSidebar from "./layout/sidebar/MainPageSidebar";

export default function MainPageContent() {
  // 랜덤 문장 배열
  const blogDescriptions = [
    "감자에서 시작되는 진짜 개발 이야기",
    "뿌리부터 단단한 기술, 감자밭에서 캔 인사이트",
    "우리 코드는 감자처럼 생겼지만... 돌아갑니다.",
    "우리 얼굴은 감자처럼 생겼지만... 돌아갑니다.",
  ];

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
  }, []);
  const { selectedTag } = useTagStore();
  const { currentPage, currentPageForAPI, setPage } = usePagination();
  const pageSize = 10;

  /**
   * TanStack Query로 게시글 목록을 가져옵니다.
   * 선택된 태그가 있으면 태그별 게시물을, 없으면 전체 게시물을 조회합니다.
   */
  const {
    data: postResponse,
    isLoading: isLoadingPosts,
    error: postsError,
  } = selectedTag
    ? usePostsByTag(selectedTag, {
        page: currentPageForAPI,
        size: pageSize,
        sort: ["createdAt,desc"],
      })
    : usePosts({
        page: currentPageForAPI,
        size: pageSize,
        sort: ["createdAt,desc"],
      });

  const posts = (postResponse?.content as PostResponse[]) || [];
  const totalPages = postResponse?.totalPages || 0;
  const totalElements = postResponse?.totalElements || 0;
  // 페이지 변경 핸들러 (URL 기반)
  const handlePageChange = (page: number) => {
    setPage(page); // usePagination 훅의 setPage 사용
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoadingPosts) {
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
            />
          </div>
        </section>

        <div className="flex pb-10">
          <main className="flex-3">
            <h2 className="text-2xl font-semibold">Posts</h2>
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
        <section className="text-center">
          <div onClick={handleLogoClick} className="inline-block cursor-pointer">
            <Image
              src="/logo2.svg"
              alt="메인페이지 로고"
              width={255}
              height={230}
              className="mx-auto"
            />
          </div>
        </section>

        <div className="flex justify-center pb-10">
          <div className="text-center text-red-500">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm text-gray-500">{postsError?.message}</p>
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
            {/* <p className="text-sm text-gray-500">
              총 {totalElements}개의 게시글 (페이지 {currentPage} / {totalPages})
            </p> */}
          </div>
          <div className="mt-8 flex flex-col gap-8">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.postId} post={post} />)
            ) : (
              <div className="py-16 text-center text-gray-500">
                <p className="mb-2 text-lg">게시글이 없습니다</p>
                <p className="text-sm">첫 번째 게시글을 작성해보세요!</p>
              </div>
            )}
          </div>
          <CustomPagination
            currentPage={currentPage} // 이미 1부터 시작하는 값
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        </main>
        <MainPageSidebar />
      </div>
    </div>
  );
}
