"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      // 메인 페이지에서 클릭 시 새로고침
      window.location.reload();
    } else {
      // 다른 페이지에서 클릭 시 메인 페이지로 이동
      router.push('/');
    }
  };

  return (
    <div
      onClick={handleLogoClick}
      className={`flex cursor-pointer items-center text-[18px] ${className}`}
    >
      <Image
        src="/logo.svg"
        alt="감자 기술 블로그 로고"
        width={23}
        height={23}
      />
      <h1 className="ml-2">
        <span className="font-bold">감자 </span>
        <span className="font-light">Tech Blog</span>
      </h1>
    </div>
  );
};