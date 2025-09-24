"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageNavMenuProps {
  labels: Record<string, string>;
  paths: Record<string, string>;
}

/**
 * 페이지 네비게이션 메뉴 컴포넌트
 *
 * 탭 대신 링크를 사용하여 페이지 간 이동을 제공합니다.
 * 현재 경로에 따라 활성 상태를 표시합니다.
 *
 * @param labels - 메뉴 라벨 매핑 객체
 * @param paths - 메뉴 경로 매핑 객체
 */
export default function PageNavMenu({ labels, paths }: PageNavMenuProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <nav className="w-full">
        <ul className="flex w-full justify-evenly border-b border-[#F2F4F6] bg-transparent px-0 pb-3 md:justify-start md:pb-4">
          {Object.entries(labels).map(([key, label]) => {
            const path = paths[key];
            const isActive = pathname === path;

            return (
              <li key={key}>
                <Link
                  href={path}
                  className={`text-lg hover:cursor-pointer md:border-none md:text-xl ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
