import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { UserDropdownMenu } from "./UserDropdownMenu";

interface HeaderNavigationProps {
  hideHeader: boolean;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ hideHeader }) => {

  const loginUrl = process.env.NEXT_PUBLIC_OAUTH_LOGIN_URL || "";

  const { isLoggedIn, userProfile } = useAuth();

  return (
    <nav className="flex items-center gap-2">
      {!hideHeader && (
        <>
          {isLoggedIn ? (
            // 로그인된 상태: 프로필 이미지 표시
            <UserDropdownMenu userProfile={userProfile} />
          ) : (
            // 로그인되지 않은 상태: 로그인 버튼 표시
            <Link href="https://gamzatech.site/login/oauth2/code/github">
              <Button className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]">
                로그인
              </Button>
            </Link>
          )}
        </>
      )}
    </nav>
  );
};