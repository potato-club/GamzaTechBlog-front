export default function MyPageSkeleton() {
  return (
    <main className="flex mt-20" role="status" aria-label="페이지 로딩중">
      <div className="w-64 h-96 bg-gray-200 animate-pulse rounded-lg" />
      <section className="flex-1 ml-12">
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-full h-32 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </section>
    </main>
  );
}