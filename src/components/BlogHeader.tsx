"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import blogLogo from "../../public/logo.png";

export default function BlogHeader() {

  const pathname = usePathname();
  const hideHeaderPaths = ["/login", "/signup"];
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  if (hideHeader) return null;
  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-14 w-full max-w-[1100px] -translate-x-1/2 items-center justify-between bg-white">
      <Link href="/" className="flex cursor-pointer items-center text-[18px]">
        <Image
          src={blogLogo}
          alt="감자 기술 블로그 로고"
          width={43}
          height={43}
          className="opacity-55"
        />
        <span>
          <span className="font-bold">감자 </span>
          <span className="font-light">Tech Blog</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button className="rounded-[63px] bg-[#FAA631] px-3 py-1.5 text-white">
          로그인
        </button>
        <button className="rounded-[63px] bg-[#F2F4F6] px-3 py-1.5 text-[#798191]">
          회원가입
        </button>
      </div>
    </header>
  );
}