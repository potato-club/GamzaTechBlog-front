"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // 마우스 이탈 시 딜레이를 위한 ref

  const handleLogout = () => {
    console.log("로그아웃");
    logout();
    setIsDropdownOpen(false);
    // 로그아웃 후 메인 페이지로 강제 리디렉션
    router.push("/");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // 드롭다운 메뉴로 마우스가 이동할 시간을 주기 위해 약간의 딜레이를 줍니다.
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150); // 150ms 딜레이 (조정 가능)
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} // 전체 div 영역에 mouse leave 이벤트 핸들러 추가
    >

      {userProfile?.profileImageUrl ? (
        <img
          src={userProfile.profileImageUrl}
          alt={`${userProfile.nickname || '사용자'} 프로필`}
          className="w-8 h-8 rounded-full hover:cursor-pointer"
        />
      ) : (
        <Image
          src="/logo.png" // 기본 프로필 이미지 경로
          alt={`${userProfile?.nickname || '사용자'} 프로필`}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full hover:cursor-pointer" />
      )}
      {isDropdownOpen && (
        <nav
          role="menu"
          className="absolute right-0 top-full mt-2 w-36 rounded-md bg-white shadow-lg border border-gray-200 z-50"
          // 드롭다운 메뉴 자체에도 onMouseEnter/Leave를 걸어주면
          // 마우스가 버튼에서 메뉴로 이동할 때 메뉴가 바로 닫히는 것을 방지할 수 있습니다.
          onMouseEnter={handleMouseEnter} // 메뉴 위로 마우스가 올라가면 닫힘 타이머 취소
          onMouseLeave={handleMouseLeave} // 메뉴에서 마우스가 나가면 닫힘 타이머 시작
        >
          <ul className="py-1" role="none">
            <li role="none">
              <Link
                href="/mypage"
                role="menuitem"
                className="block w-full h-9 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)} // 링크 클릭 시 메뉴 닫기
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
                onClick={handleLogout} // 로그아웃 클릭 시 메뉴 닫기 (handleLogout 내부에서 이미 처리)
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