import { PopularPostsSection } from "@/features/posts";
import { TagsSection } from "@/features/tags";
import { PostPopularResponse } from "@/generated/api";

/**
 * 사이드바 섹션 컴포넌트
 *
 * 단일 책임: 사이드바 레이아웃 구성 (데이터는 props로 받음)
 */
interface SidebarSectionProps {
  popularPosts?: PostPopularResponse[];
  tags?: string[];
}

export default function SidebarSection({ popularPosts, tags }: SidebarSectionProps) {
  return (
    <aside className="ml-10 flex-1 border-l border-[#F2F4F6] pl-10">
      {/* 인기 게시글 섹션 */}
      <PopularPostsSection popularPosts={popularPosts} />

      {/* 태그 섹션 */}
      <TagsSection tags={tags} />
    </aside>
  );
}
