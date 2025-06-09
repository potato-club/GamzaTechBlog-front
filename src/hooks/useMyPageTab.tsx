import { TabType, VALID_TABS } from "@/types/mypage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useMyPageTab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = useMemo(() => {
    const tab = searchParams.get('tab');
    return tab && VALID_TABS.includes(tab as TabType)
      ? (tab as TabType)
      : 'posts';
  }, [searchParams]);

  const handleTabChange = useCallback((newTab: TabType) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', newTab);
    router.push(`/mypage?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return {
    currentTab,
    handleTabChange,
  };
}