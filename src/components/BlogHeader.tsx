"use client";

import { Button } from "@/components/ui/button"; // shadcn Button import
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BlogHeader() {
  const pathname = usePathname();
  const hideHeaderPaths = ["/login", "/signup"];
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  // if (hideHeader) return null;
  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-14 w-full max-w-[1100px] -translate-x-1/2 items-center justify-between bg-white px-6">
      <Link href="/" className="flex cursor-pointer items-center text-[18px]">
        <Image
          src="/logo.png"
          alt="감자 기술 블로그 로고"
          width={43}
          height={43}
        />
        <span>
          <span className="font-bold">감자 </span>
          <span className="font-light">Tech Blog</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        {!hideHeader && (
          <>
            <Link href="/login">
              <Button className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]">
                로그인
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}