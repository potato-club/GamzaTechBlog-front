import { Suspense } from "react";
import MainPageContent from "../components/MainPageContent";
import MainPageSkeleton from "../components/skeletons/MainPageSkeleton";

export default async function Home() {
  return (
    <div className="flex flex-col mt-16 gap-30 mx-auto">
      <Suspense fallback={<MainPageSkeleton />}>
        <MainPageContent />
      </Suspense>
    </div>
  );
}
