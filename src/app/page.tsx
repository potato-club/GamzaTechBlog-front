import MainPageContent from "@/components/MainPageContent";
import MainPageSkeleton from "@/components/skeletons/MainPageSkeleton";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<MainPageSkeleton />}>
      <MainPageContent />
    </Suspense>
  );
}
