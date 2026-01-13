import SearchPageContent from "@/features/search/components/SearchPageContent";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <SearchPageContent searchParams={resolvedSearchParams} />;
}
