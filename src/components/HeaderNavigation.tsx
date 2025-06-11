import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // 수정된 useAuth 훅
import Link from "next/link";
import { UserDropdownMenu } from "./UserDropdownMenu";

interface HeaderNavigationProps {
  hideHeader?: boolean; // hideHeader는 선택적 prop으로 변경 가능
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ hideHeader }) => {
  const githubLoginUrl = process.env.NEXT_PUBLIC_OAUTH_LOGIN_URL || "/api/auth/github"; // 환경 변수 또는 기본값

  // useAuth 훅 호출. React Query가 데이터 관리
  const { isLoggedIn, userProfile, isLoading, logout } = useAuth(); // logout 함수도 가져옴

  // // 로딩 중일 때 스켈레톤 UI 또는 간단한 로딩 메시지 표시 (선택 사항)
  // if (isLoading) {
  //   return (
  //     <nav className="flex items-center gap-2">
  //       {!hideHeader && (
  //         <>
  //           <Skeleton className="h-8 w-20 rounded-full" /> {/* 로그인 버튼 크기 */}
  //           {/* 또는 <p>Loading...</p> */}
  //         </>
  //       )}
  //     </nav>
  //   );
  // }

  return (
    <nav className="flex gap-2">
      {!hideHeader && (
        <>
          {isLoggedIn && userProfile ? (
            // 로그인된 상태: 프로필 이미지 표시
            // UserDropdownMenu에 logout 함수 전달
            <UserDropdownMenu userProfile={userProfile} />
          ) : (
            // 로그인되지 않은 상태: 로그인 버튼 표시
            <Link href={githubLoginUrl} target="_self"> {/* legacyBehavior와 passHref 제거, target 속성 직접 전달 */}
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