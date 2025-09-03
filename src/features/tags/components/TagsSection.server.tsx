import InteractiveTagSection from "@/components/shared/interactive/InteractiveTagSection";

/**
 * 태그 섹션 컴포넌트
 *
 * 단일 책임: 태그 데이터 표시만 (데이터는 props로 받음)
 */
interface TagsSectionProps {
  tags?: string[];
}

export default function TagsSection({ tags }: TagsSectionProps) {
  return <InteractiveTagSection tags={tags || []} />;
}
