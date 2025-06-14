"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // 수정된 useAuth 훅
import { DropdownActionItem } from "@/types/dropdown";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenuList } from "../../common/DropdownMenuList";

export const HeaderNavigation = () => {
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
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const headerDropdownItems: DropdownActionItem[] = [
    {
      label: "마이페이지",
      href: "/mypage",
      isLink: true,
    },
    {
      label: "로그아웃",
      onClick: handleLogout,
    },
  ];

  const headerTriggerElement = (
    <Button
      variant="ghost"
      className="relative h-8 w-8 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer"
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
  );

  if (isLoading) {
    // 로딩 중 UI (예: 스켈레톤 또는 간단한 메시지)
    return <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />;
  }

  return (
    <nav className="flex gap-2">
      <>
        {isLoggedIn && userProfile ? (
          // 로그인된 상태: 프로필 이미지 표시
          <DropdownMenuList
            triggerElement={headerTriggerElement}
            items={headerDropdownItems}
          />
        ) : (
          // 로그인되지 않은 상태: 로그인 버튼 표시
          <Link href={githubLoginUrl} target="_self">
            <Button
              variant="default" // 기본 variant 사용 또는 커스텀 스타일 유지
              className="rounded-full bg-[#20242B] px-4 py-2 text-white hover:bg-[#33373E] hover:cursor-pointer text-xs sm:text-sm flex items-center gap-2 transition-colors duration-150"
            >
              Login with
              <Image src="/githubIcon.svg" alt="깃허브" width={22} height={22} />
            </Button>
          </Link>
        )}
      </>
      {/* )} */}
    </nav>
  );
};