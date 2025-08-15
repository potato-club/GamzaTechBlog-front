"use client";

import { usePathname, useRouter } from "next/navigation";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 항상 완전한 루트 경로로 이동 (쿼리 파라미터 제거)
    router.push("/");
    if (pathname === "/") {
      // 메인 페이지에서 클릭 시 새로고침하여 상태 초기화
      setTimeout(() => window.location.reload(), 100);
    }
  };

  return (
    <div
      onClick={handleLogoClick}
      className={`flex cursor-pointer items-center text-[18px] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="감자 기술 블로그 로고" width={23} height={23} />
      <h1 className="ml-2">
        <span className="font-bold">감자 </span>
        <span className="font-light">Tech Blog</span>
      </h1>
    </div>
  );
};
