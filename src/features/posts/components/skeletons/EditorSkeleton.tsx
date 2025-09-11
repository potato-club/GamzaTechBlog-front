export default function EditorSkeleton() {
  return (
    <div className="animate-pulse">
      {/* 툴바 스켈레톤 */}
      <div className="border-b border-gray-200 p-2">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-8 rounded bg-gray-200" />
          ))}
        </div>
      </div>

      {/* 에디터 영역 스켈레톤 */}
      <div className="min-h-[400px] p-4">
        <div className="space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
