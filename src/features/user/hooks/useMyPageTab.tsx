"use client";

import { TabType, VALID_TABS } from "@/types/mypage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useMyPageTab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = useMemo(() => {
    try {
      const tab = searchParams?.get("tab");
      return tab && VALID_TABS.includes(tab as TabType) ? (tab as TabType) : "posts";
    } catch {
      // 서버 사이드에서 searchParams에 접근할 수 없는 경우 기본값 반환
      return "posts";
    }
  }, [searchParams]);

  const handleTabChange = useCallback(
    (newTab: TabType) => {
      try {
        const params = new URLSearchParams(searchParams || undefined);
        params.set("tab", newTab);
        router.push(`/mypage?${params.toString()}`, { scroll: false });
      } catch {
        // 에러 발생 시 기본 경로로 이동
        router.push(`/mypage?tab=${newTab}`, { scroll: false });
      }
    },
    [router, searchParams]
  );

  return {
    currentTab,
    handleTabChange,
  };
}
