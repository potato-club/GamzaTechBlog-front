import LogoSection from "@/components/shared/layout/LogoSection";
import SidebarSection from "@/components/shared/layout/SidebarSection.server";
import { PostPopularResponse } from "@/generated/api";
import { ReactNode } from "react";

interface ContentLayoutProps {
  children: ReactNode;
  popularPosts: PostPopularResponse[] | undefined;
  tags: string[] | undefined;
}

export default function ContentLayout({ children, popularPosts, tags }: ContentLayoutProps) {
  return (
    <div className="layout-stable mx-auto flex flex-col gap-6 md:gap-12">
      {/* 로고 섹션 - 즉시 렌더링 */}
      <LogoSection />

      {/* 메인 콘텐츠 - 모바일: 세로 정렬, 데스크톱: 가로 정렬 */}
      <div className="dynamic-content flex flex-col pb-6 md:flex-row md:pb-10">
        {/* 메인 콘텐츠 영역 */}
        {children}

        {/* 사이드바 섹션 - 모바일에서는 메인 콘텐츠 아래에 표시 */}
        <SidebarSection popularPosts={popularPosts || []} tags={tags || []} />
      </div>
    </div>
  );
}
