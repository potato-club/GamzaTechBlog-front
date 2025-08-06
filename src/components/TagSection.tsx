'use client';

/**
 * 태그 섹션 컴포넌트
 * 
 * TanStack Query를 사용하여 태그 데이터를 
 * 자동으로 관리하고 로딩/에러 상태를 처리합니다.
 */

import { useTagStore } from '@/store/tagStore';
import { useTags } from '@/hooks/queries/usePostQueries';
import TagBadge from './ui/TagBadge';

export default function TagSection() {
  const { selectedTag, setSelectedTag } = useTagStore();

  /**
   * TanStack Query를 사용하여 태그 목록을 가져옵니다.
   * 
   * 이 훅의 장점:
   * - 자동 캐싱: 동일한 태그 데이터를 여러 컴포넌트에서 공유
   * - 백그라운드 갱신: 데이터가 오래되면 자동으로 업데이트
   * - 로딩/에러 상태: 별도 state 관리 없이 자동 제공
   * - 재시도 로직: 네트워크 오류 시 자동 재시도
   */
  const { data: tags, isLoading, error } = useTags();

  const handleTagClick = (tag: string) => {
    console.log(`태그 "${tag}" 클릭됨`);
    if (selectedTag === tag) {
      // 이미 선택된 태그를 다시 클릭하면 선택 해제
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  console.log('태그 데이터:', tags);
  console.log('선택된 태그:', selectedTag);

  return (
    <section className="mt-20">
      <h3 className="text-[18px] text-[#838C9D]">태그</h3>

      {/* 로딩 상태 처리 */}
      {isLoading && (
        <nav className="mt-7 flex flex-wrap gap-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-7 bg-gray-200 rounded-full w-20"></div>
            </div>
          ))}
        </nav>
      )}

      {/* 에러 상태 처리 */}
      {error && (
        <div className="mt-7 text-red-500 text-sm">
          <p>태그를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      )}

      {/* 성공 상태: 태그 목록 표시 */}
      {tags && !isLoading && !error && (
        <nav className="mt-7 flex flex-wrap gap-2 text-[14px]">
          {tags.map((tag, idx) => (
            <TagBadge
              key={idx}
              tag={tag}
              variant={selectedTag === tag ? 'outline' : 'filled'}
              onClick={handleTagClick}
            />
          ))}
        </nav>
      )}

      {/* 데이터가 없는 경우 */}
      {tags && tags.length === 0 && !isLoading && !error && (
        <div className="mt-7 text-gray-500 text-sm">
          <p>등록된 태그가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
