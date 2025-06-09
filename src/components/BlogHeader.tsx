"use client";

import { Button } from "@/components/ui/button"; // shadcn Button import
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BlogHeader() {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <h1 className="ml-2">
          <span className="font-bold">감자 </span>
          <span className="font-light">Tech Blog</span>
        </h1>
      </Link>
      <nav className="flex items-center gap-2">
        {!hideHeader && (
          <>
            <Link href="/login">
              <Button className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]">
                로그인
              </Button>
            </Link>
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                aria-label="사용자 메뉴"
              >
                메뉴
              </Button>
              {isDropdownOpen && (
                <nav
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-36 rounded-md bg-white shadow-lg border border-gray-200 z-50"
                >
                  <ul className="py-1" role="none">
                    <li role="none">
                      <Link
                        href="/mypage"
                        role="menuitem"
                        className="block w-full h-9 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        내 정보
                      </Link>
                    </li>
                    <li role="none">
                      <Button
                        variant="ghost"
                        size="sm"
                        role="menuitem"
                        className="block w-full h-9 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                        onClick={() => {
                          console.log("로그아웃");
                        }}
                      >
                        로그아웃
                      </Button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}