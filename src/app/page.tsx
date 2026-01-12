import { DynamicWelcomeModal } from "@/components/dynamic/DynamicComponents";
import ContentLayout from "@/components/shared/layout/ContentLayout";
import { createIntroServiceServer } from "@/features/intro";
import {
  createPostServiceServer,
  MainContent,
  PostListSection,
  WelcomeBoardSection,
} from "@/features/posts";
import type {
  Pageable,
  PagedResponseIntroResponse,
  PagedResponsePostListResponse,
} from "@/generated/api";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; tab?: string }>;
}): Promise<Metadata> {
  const { tag, page, tab } = await searchParams;

  // 탭별 메타데이터 처리
  if (tab === "welcome") {
    return {
      title: "텃밭인사 | 감자 기술 블로그",
      description:
        "감자 기술 블로그에 새로 온 분들을 위한 텃밭인사 게시판입니다. 자유롭게 인사와 소개를 나눠보세요.",
      keywords: "인사, 소개, 텃밭인사, 감자, 한세대학교, 개발자 소개",
      openGraph: {
        title: "텃밭인사 | 감자 기술 블로그",
        description: "감자 기술 블로그 텃밭인사 게시판에서 인사를 나눠보세요.",
        type: "website",
      },
    };
  }

  if (tag) {
    return {
      title: `#${tag} 태그 게시글${page ? ` (${page}페이지)` : ""} | 감자 기술 블로그`,
      description: `${tag} 태그와 관련된 기술 블로그 게시글들을 확인해보세요. 감자 동아리 구성원들이 직접 작성한 실무 경험과 학습 내용을 공유합니다.`,
      keywords: `${tag}, 개발, 기술블로그, 프로그래밍, 감자, 한세대학교`,
      openGraph: {
        title: `#${tag} 태그 게시글 | 감자 기술 블로그`,
        description: `${tag} 관련 기술 게시글 모음`,
        type: "website",
      },
    };
  }

  if (page && page !== "1") {
    return {
      title: `게시글 목록 (${page}페이지) | 감자 기술 블로그`,
      description: `감자 기술 블로그의 모든 게시글을 확인해보세요. ${page}페이지`,
      keywords: "개발, 기술블로그, 프로그래밍, 감자, 한세대학교",
    };
  }

  // 기본 메타데이터 (모내기 게시판)
  return {
    title: "감자 기술 블로그",
    description:
      "안녕하세요. 감자 기술 블로그입니다. 한세대학교 웹·앱 개발 동아리 감자 구성원들의 지식 공유 공간입니다.",
    keywords: "개발, 기술블로그, 프로그래밍, 감자, 한세대학교, 웹개발, 앱개발",
    openGraph: {
      title: "감자 기술 블로그",
      description: "감자 구성원들의 기술 지식과 경험 공유 공간",
      type: "website",
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; tab?: string }>;
}) {
  const { tag, page, tab } = await searchParams;
  const currentTab = tab === "welcome" ? "welcome" : "posts";
  const currentPage = Number(page) || 1;
  const pageSize = 10;
  const queryParams: Pageable = {
    page: currentPage - 1,
    size: pageSize,
    sort: ["createdAt,desc"],
  };
  const listCache: RequestInit = { next: { revalidate: 300 } };

  const postService = createPostServiceServer();
  const introService = createIntroServiceServer();
  const [postsData, introData, sidebarData] = await Promise.all([
    currentTab === "posts"
      ? tag
        ? postService.getPostsByTag(tag, queryParams, listCache)
        : postService.getPosts(queryParams, listCache)
      : Promise.resolve(null),
    currentTab === "welcome"
      ? introService.getIntroList(
          {
            page: currentPage - 1,
            size: pageSize,
            sort: ["createdAt,desc"],
          },
          listCache
        )
      : Promise.resolve(null),
    postService.getSidebarData({ next: { revalidate: 600 } }),
  ]);
  const resolvedPostsData = postsData as PagedResponsePostListResponse | null;
  const resolvedIntroData = introData as PagedResponseIntroResponse | null;

  return (
    <>
      <DynamicWelcomeModal />
      <ContentLayout popularPosts={sidebarData.weeklyPopular} tags={sidebarData.allTags}>
        <MainContent
          currentTab={currentTab}
          postsTabContent={
            resolvedPostsData ? (
              <PostListSection
                initialTag={tag}
                posts={resolvedPostsData.content || []}
                totalPages={resolvedPostsData.totalPages || 0}
              />
            ) : null
          }
          welcomeTabContent={
            resolvedIntroData ? (
              <WelcomeBoardSection
                intros={resolvedIntroData.content || []}
                totalPages={resolvedIntroData.totalPages || 0}
              />
            ) : null
          }
        />
      </ContentLayout>
    </>
  );
}
