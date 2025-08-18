/**
 * Toast 에디터 스켈레톤 컴포넌트
 *
 * ToastEditor 컴포넌트의 로딩 상태를 표시합니다.
 */

export default function ToastEditorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 rounded border bg-gray-200">
        <div className="p-4">
          <div className="mb-4 h-8 rounded bg-gray-300"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-300"></div>
            <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
