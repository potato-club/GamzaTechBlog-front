/**
 * 마크다운 뷰어 스켈레톤 컴포넌트
 *
 * MarkdownViewer 컴포넌트의 로딩 상태를 표시합니다.
 */

export default function MarkdownViewerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-32 rounded bg-gray-200"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
