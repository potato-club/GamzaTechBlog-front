import { Skeleton } from "@/components/ui/skeleton";

const SkeletonContent = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
);

export default SkeletonContent;
