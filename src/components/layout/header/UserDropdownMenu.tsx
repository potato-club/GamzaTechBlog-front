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
import { cn } from "../../../lib/utils";

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
        className={cn(
          "w-36", // 특정 너비 유지
          "shadow-lg" // 기본 shadow-md보다 강한 그림자를 원하면 유지
          // bg-white, border-gray-200 등은 shadcn의 bg-popover, border로 대체 가능
          // p-1, rounded-md, z-50 등은 shadcn 기본값으로 이미 적용됨
        )}
      >
        {/* Link 아이템: DropdownMenuItem의 기본 패딩(p-0) 및 포커스 링 제거, Link에서 직접 스타일링 */}
        <DropdownMenuItem asChild className="p-0 focus-visible:ring-0 focus-visible:ring-offset-0">
          <Link
            href="/mypage"
            className="block w-full cursor-pointer rounded-sm px-4 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-700"

          >
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="w-full cursor-pointer rounded-sm px-4 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-700"
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};