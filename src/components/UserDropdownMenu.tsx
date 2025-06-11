// ... 기존 import ...
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserProfileData } from "@/types/user";
import { Link } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface UserDropdownMenuProps {
  userProfile: UserProfileData | null;
  onLogout: () => Promise<void>; // 로그아웃 함수 prop 추가
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ userProfile, onLogout }) => {
  if (!userProfile) return null;

  const handleLogout = async () => {
    await onLogout();
    // 로그아웃 후 추가 작업 (예: 홈페이지로 리다이렉트)
    // window.location.href = '/'; // 또는 Next.js router 사용
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Image
            src="/profileSVG.svg" // 기본 아바타 이미지 경로
            alt="User"
            fill
            sizes="32px"
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.nickname}</p>
            {userProfile.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">설정</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};