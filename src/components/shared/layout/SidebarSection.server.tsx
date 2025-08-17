import { Suspense } from "react";
import PopularPostsSection from "../../features/posts/components/PopularPostsSection.server";
import PopularPostsSkeleton from "../../features/posts/skeletons/PopularPostsSkeleton";
import TagsSkeleton from "../../features/tags/skeletons/TagsSkeleton";
import TagsSection from "../../features/tags/TagsSection.server";

/**
 * 사이드바 섹션 서버 컴포넌트
 *
 * 단일 책임: 사이드바 레이아웃 구성만
 */
export default function SidebarSection() {
  return (
    <aside className="ml-10 flex-1 border-l border-[#F2F4F6] pl-10">
      {/* 인기 게시글 섹션 - 독립적 스트리밍 */}
      <Suspense fallback={<PopularPostsSkeleton count={3} />}>
        <PopularPostsSection />
      </Suspense>

      {/* 태그 섹션 - 독립적 스트리밍 */}
      <Suspense fallback={<TagsSkeleton count={6} />}>
        <TagsSection />
      </Suspense>
    </aside>
  );
}
