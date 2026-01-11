import { SearchPageContent } from "@/features/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <SearchPageContent searchParams={resolvedSearchParams} />;
}
