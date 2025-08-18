/**
 * 태그 섹션 스켈레톤 컴포넌트
 *
 * TagSection 컴포넌트의 로딩 상태를 표시합니다.
 */

interface TagSectionSkeletonProps {
  count?: number;
}

export default function TagSectionSkeleton({ count = 6 }: TagSectionSkeletonProps) {
  return (
    <nav className="mt-7 flex flex-wrap gap-2">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-7 w-20 rounded-full bg-gray-200"></div>
        </div>
      ))}
    </nav>
  );
}
