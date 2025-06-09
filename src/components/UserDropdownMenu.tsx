"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface UserDropdownMenuProps {
  className?: string;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ className = "" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    console.log("로그아웃");
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
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
                onClick={() => setIsDropdownOpen(false)}
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
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};