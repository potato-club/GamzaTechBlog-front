"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabMenuProps<T extends string> {
  tab: T;
  onTabChange: (value: T) => void;
  labels: Record<T, string>;
  visibleTabs?: [string, string][];
}

/**
 * 공통 탭 메뉴 컴포넌트
 *
 * 모바일에서는 탭들이 고르게 분산되고, 데스크탑에서는 왼쪽 정렬됩니다.
 * 일관된 폰트 크기와 패딩을 제공합니다.
 *
 * @param tab - 현재 활성 탭
 * @param onTabChange - 탭 변경 핸들러
 * @param labels - 탭 라벨 매핑 객체
 * @param visibleTabs - 표시할 탭 목록 (기본값: 모든 탭)
 */
export default function TabMenu<T extends string>({
  tab,
  onTabChange,
  labels,
  visibleTabs,
}: TabMenuProps<T>) {
  const handleValueChange = (value: string) => {
    onTabChange(value as T);
  };

  // visibleTabs가 제공되면 사용, 아니면 모든 탭 표시
  const tabsToShow = visibleTabs || Object.entries(labels);

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={handleValueChange} className="w-full">
        <TabsList className="flex w-full justify-evenly border-b border-[#F2F4F6] bg-transparent px-0 pb-3 md:justify-start md:pb-4">
          {tabsToShow.map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              id={`${value}-tab`}
              className="text-lg md:border-none md:text-xl"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
