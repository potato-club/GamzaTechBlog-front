"use client";

import Link from "next/link";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className = "" }) => {
  return (
    <Link
      href={{ pathname: "/" }}
      className={`flex cursor-pointer items-center text-[18px] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="감자 기술 블로그 로고" width={23} height={23} />
      <h1 className="ml-2">
        <span className="font-bold">감자 </span>
        <span className="font-light">Tech Blog</span>
      </h1>
    </Link>
  );
};
