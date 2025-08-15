"use client";

import { useRouter, useSearchParams } from "next/navigation";
import TagBadge from "../../ui/TagBadge";

/**
 * 인터랙티브 태그 섹션 클라이언트 컴포넌트
 *
 * 단일 책임: 태그 필터링 상태 관리 및 URL 업데이트
 */

interface InteractiveTagSectionProps {
  tags: string[];
}

export default function InteractiveTagSection({ tags }: InteractiveTagSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedTag === tag) {
      // 같은 태그 클릭시 필터 해제
      params.delete("tag");
      params.delete("page"); // 페이지도 초기화
    } else {
      // 새 태그 선택
      params.set("tag", tag);
      params.delete("page"); // 페이지 초기화
    }

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";

    router.push(url);
  };

  if (!tags || tags.length === 0) {
    return (
      <section className="mt-10">
        <h3 className="mb-7 text-[18px] text-[#838C9D]">태그</h3>
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">태그가 없습니다</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h3 className="mb-7 text-[18px] text-[#838C9D]">태그</h3>

      <nav className="flex flex-wrap gap-2">
        {/* 태그 목록 */}
        {tags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            variant={selectedTag === tag ? "outline" : "filled"}
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </nav>
    </section>
  );
}
