import { Skeleton } from "@/components/ui/skeleton";

interface TabContentSkeletonProps {
  /**
   * 표시할 스켈레톤 아이템 개수
   */
  count?: number;
  /**
   * 각 아이템의 레이아웃 타입
   */
  variant?: "post" | "comment" | "simple";
}

export default function TabContentSkeleton({
  count = 3,
  variant = "post",
}: TabContentSkeletonProps) {
  const renderPostSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );

  const renderCommentSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );

  const renderSimpleSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );

  const getSkeletonRenderer = () => {
    switch (variant) {
      case "post":
        return renderPostSkeleton;
      case "comment":
        return renderCommentSkeleton;
      case "simple":
        return renderSimpleSkeleton;
      default:
        return renderPostSkeleton;
    }
  };

  const renderSkeleton = getSkeletonRenderer();

  return (
    <div className="mt-8 flex flex-col gap-8">
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
