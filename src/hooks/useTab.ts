"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseTabOptions<T extends string> {
  // Make it generic over T
  defaultTab: T; // defaultTab is of type T
  validTabs: T[]; // validTabs is an array of T
  queryParamName?: string; // Default to "tab"
  basePath?: string; // Optional: if the path is not just a query param change
}

export function useTab<T extends string>({
  // Make the function generic
  defaultTab,
  validTabs,
  queryParamName = "tab",
  basePath,
}: UseTabOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = useMemo(() => {
    const tab = searchParams.get(queryParamName);
    return tab && validTabs.includes(tab as T) ? (tab as T) : defaultTab; // Cast to T
  }, [searchParams, validTabs, defaultTab, queryParamName]);

  const handleTabChange = useCallback(
    (newTab: T) => {
      // newTab is of type T
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryParamName, newTab);
      const path = basePath ? `${basePath}?${params.toString()}` : `?${params.toString()}`;
      router.push(path, { scroll: false });
    },
    [router, searchParams, queryParamName, basePath]
  );

  return { currentTab, handleTabChange };
}
