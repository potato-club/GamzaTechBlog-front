import { Skeleton } from "@/components/ui/skeleton";

export default function MyPageSkeleton() {
  return (
    <main className="mt-20 flex" role="status" aria-label="페이지 로딩중">
      <Skeleton className="h-96 w-45 rounded-lg" />
      <section className="ml-12 flex-1">
        <Skeleton className="mb-6 h-12 w-full rounded-lg" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
}
