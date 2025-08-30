import { DynamicWelcomeModal } from "@/components/dynamic/DynamicComponents";
import LogoSection from "@/components/shared/layout/LogoSection";
import SidebarSection from "@/components/shared/layout/SidebarSection.server";
import SidebarSkeleton from "@/components/shared/layout/skeletons/SidebarSkeleton";
import { MainContent, PostListSection, PostListSkeleton } from "@/features/posts";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}): Promise<Metadata> {
  const { tag, page } = await searchParams;

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

  // 기본 메타데이터 (기존 layout.tsx에서 가져옴)
  return {
    title: "감자 기술 블로그",
    description:
      "안녕하세요. 감자 기술 블로그입니다. 한세대학교 웹·앱 개발 동아리 감자 구성원들의 지식 공유 공간입니다.",
    keywords: "개발, 기술블로그, 프로그래밍, 감자, 한세대학교, 웹개발, 앱개발",
  };
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  return (
    <>
      <DynamicWelcomeModal />

      <div className="layout-stable mx-auto flex flex-col gap-12">
        {/* 로고 섹션 - 즉시 렌더링 */}
        <LogoSection />

        {/* 메인 콘텐츠 - 스트리밍 */}
        <div className="dynamic-content flex pb-10">
          <MainContent
            postsTabContent={
              <Suspense fallback={<PostListSkeleton count={3} />}>
                <PostListSection searchParams={searchParams} />
              </Suspense>
            }
          />

          {/* 사이드바 섹션 - 독립적 스트리밍 */}
          <Suspense fallback={<SidebarSkeleton />}>
            <SidebarSection />
          </Suspense>
        </div>
      </div>
    </>
  );
}
