"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const handleLogout = () => {
    console.log("로그아웃");
    logout();
    // 로그아웃 후 메인 페이지로 강제 리디렉션
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-8 w-8 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer ${className}`}
        >
          {userProfile?.profileImageUrl ? (
            <img
              src={userProfile.profileImageUrl}
              alt={`${userProfile.nickname || "사용자"} 프로필`}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <Image
              src="/logo.png" // 기본 프로필 이미지 경로
              alt={`${userProfile?.nickname || "사용자"} 프로필`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8} // mt-2와 유사한 간격 (2 * 4px = 8px)
        className="w-36 rounded-md bg-white shadow-lg border border-gray-200 z-50 p-1" // shadcn 기본 패딩(p-1) 적용 또는 필요시 제거
      >
        <DropdownMenuItem asChild className="cursor-pointer p-0">
          <Link
            href="/mypage"
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm" // h-9는 py-2와 text-sm으로 유사하게 구현
          >
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="w-full cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-700 rounded-sm"
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};