import { Skeleton } from "@/components/ui/skeleton";

export default function MyPageSkeleton() {
  return (
    <main className="flex mt-20" role="status" aria-label="페이지 로딩중">
      <Skeleton className="w-45 h-96 rounded-lg" />
      <section className="flex-1 ml-12">
        <Skeleton className="w-full h-12 rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton
              key={i}
              className="w-full h-32 rounded-lg"
            />
          ))}
        </div>
      </section>
    </main>
  );
}