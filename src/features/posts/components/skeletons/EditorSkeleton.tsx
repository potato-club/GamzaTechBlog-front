import { Skeleton } from "@/components/ui/skeleton";

export default function EditorSkeleton() {
  return (
    <div>
      {/* 툴바 스켈레톤 */}
      <div className="border-b p-2">
        <div className="flex gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>

      {/* 에디터 영역 스켈레톤 */}
      <div className="min-h-[400px] p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
