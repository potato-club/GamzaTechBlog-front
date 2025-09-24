"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseTabOptions<T extends string> {
  // Make it generic over T
  defaultTab: T; // defaultTab is of type T
  validTabs: T[]; // validTabs is an array of T
  queryParamName?: string; // Default to "tab"
  basePath?: string; // Optional: if the path is not just a query param change
  preserveParams?: string[]; // Parameters to preserve when tab changes
}

export function useTab<T extends string>({
  // Make the function generic
  defaultTab,
  validTabs,
  queryParamName = "tab",
  basePath,
  preserveParams = [],
}: UseTabOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = useMemo(() => {
    const tab = searchParams.get(queryParamName);
    return tab && validTabs.includes(tab as T) ? (tab as T) : defaultTab; // Cast to T
  }, [searchParams, validTabs, defaultTab, queryParamName]);

  const handleTabChange = useCallback(
    (newTab: T) => {
      const params = new URLSearchParams();

      // Set the new tab
      params.set(queryParamName, newTab);

      // Preserve specified parameters
      preserveParams.forEach((paramName) => {
        const value = searchParams.get(paramName);
        if (value) {
          params.set(paramName, value);
        }
      });

      // Reset specified parameters are simply not added to new params

      const path = basePath ? `${basePath}?${params.toString()}` : `?${params.toString()}`;
      router.push(path, { scroll: false });
    },
    [router, searchParams, queryParamName, basePath, preserveParams]
  );

  return { currentTab, handleTabChange };
}
