"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface UserDropdownMenuProps {
  userProfile: any; // 또는 구체적인 타입 정의
  logout: () => void; // 로그아웃 함수
  className?: string;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  userProfile,
  logout,
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    console.log("로그아웃");
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        aria-label="사용자 메뉴"
        variant="ghost" // ghost variant 추가 또는 다른 투명 배경 variant
        className="rounded-full p-0" // p-2 대신 p-0 또는 필요한 최소 패딩으로 변경 고려
      >
        {userProfile?.profileImageUrl ? (
          <img
            src={userProfile.profileImageUrl}
            alt={`${userProfile.nickname || '사용자'} 프로필`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {userProfile?.nickname?.[0] || 'U'}
          </div>
        )}
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