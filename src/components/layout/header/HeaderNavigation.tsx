"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/queries/useUserQueries"; // 인증 상태 컴포지션 훅 직접 import
import { DropdownActionItem } from "@/types/dropdown";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // usePathname import
import { useEffect, useState } from "react";
import { DropdownMenuList } from "../../common/DropdownMenuList";


export const HeaderNavigation = () => {
  const githubLoginUrl = process.env.NEXT_PUBLIC_OAUTH_LOGIN_URL || "/api/auth/github"; // 환경 변수 또는 기본값  // useAuth 훅 호출. React Query가 데이터 관리
  const { isLoggedIn, userProfile, isLoading, logout, needsProfileCompletion, refetchAuthStatus } = useAuth(); // refetchAuthStatus 추가

  console.log("HeaderNavigation state:", { isLoggedIn, userProfile, isLoading, needsProfileCompletion });

  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const [loginDots, setLoginDots] = useState("");
  const [forceUpdateKey, setForceUpdateKey] = useState(0); // 강제 리렌더링용 상태
  const [searchKeyword, setSearchKeyword] = useState("");

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // PRE_REGISTER 역할인 경우 /signup 페이지로 리디렉션
  useEffect(() => {
    // 로딩이 완료되고, 프로필 완성이 필요하며, 현재 페이지가 /signup이 아닌 경우
    if (!isLoading && needsProfileCompletion && pathname !== '/signup') {
      console.log('User needs profile completion, redirecting to /signup');
      router.push('/signup');
    }
  }, [isLoading, needsProfileCompletion, pathname]);


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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAttemptingLogin) {
      interval = setInterval(() => {
        setLoginDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
      }, 500); // 0.5초마다 점 변경
    }
    return () => clearInterval(interval);
  }, [isAttemptingLogin]);

  const handleLoginClick = () => {
    setIsAttemptingLogin(true);
    // 실제 로그인 로직은 Link href를 통해 GitHub으로 리디렉션되므로,
    // 여기서는 상태 변경만 처리합니다. 페이지 이동 후에는 이 컴포넌트가 언마운트되거나
    // isAttemptingLogin 상태가 초기화될 수 있습니다.
    // 만약 SPA 내에서 직접 API 호출로 로그인한다면, 성공/실패 시 isAttemptingLogin을 false로 설정해야 합니다.
  };

  const handleLogout = async () => {
    try {
      await logout();

      // 인증 상태를 강제로 새로고침하여 헤더를 즉시 업데이트
      await refetchAuthStatus();

      // 강제 리렌더링 트리거
      setForceUpdateKey(prev => prev + 1);

      // 현재 페이지가 메인 페이지가 아닌 경우에만 라우터 이동
      if (pathname !== '/') {
        router.push("/");
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 오류가 발생해도 메인 페이지로 이동
      router.push("/");
    }
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
        <Image
          src={userProfile.profileImageUrl}
          alt={`${userProfile.nickname || "사용자"} 프로필`}
          width={32}
          height={32}
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

  // if (isLoading) {
  //   // 로딩 중 UI (예: 스켈레톤 또는 간단한 메시지)
  //   return <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />;
  // }

  // console.log("HeaderNavigation state:", { isLoggedIn, userProfile, isLoading, needsProfileCompletion });

  return (
    <nav className="flex items-center gap-4 h-8" key={forceUpdateKey}>
      {/* 검색창 */}
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#FAA631] focus:border-transparent outline-none"
        />
      </form>

      <>
        {isLoggedIn && userProfile ? (
          // 로그인된 상태: 프로필 이미지 표시
          <>
            <Link href="/posts/new">
              <Button
                variant="default" // 기본 variant 사용 또는 커스텀 스타일 유지
                className={`rounded-full bg-[#20242B] px-4 py-2 text-white text-xs sm:text-sm flex items-center gap-2 transition-colors duration-150`}>
                글쓰기
              </Button>
            </Link>
            <DropdownMenuList
              triggerElement={headerTriggerElement}
              items={headerDropdownItems}
            />
          </>
        ) : (
          // 로그인되지 않은 상태: 로그인 버튼 표시
          <Link href={githubLoginUrl} target="_self" onClick={isAttemptingLogin ? (e) => e.preventDefault() : handleLoginClick} passHref>
            <Button
              variant="default" // 기본 variant 사용 또는 커스텀 스타일 유지
              className={`rounded-full bg-[#20242B] px-4 py-2 text-white text-xs sm:text-sm flex items-center gap-2 transition-colors duration-150 ${isAttemptingLogin
                ? "cursor-not-allowed opacity-70"
                : "hover:bg-[#33373E] hover:cursor-pointer"
                }`}
              disabled={isAttemptingLogin}>
              {isAttemptingLogin ? `Logging in${loginDots}` : (
                <>
                  Login with <Image src="/githubIcon.svg" alt="GitHub" width={22} height={22} />
                </>
              )}
            </Button>
          </Link>
        )}
      </>
      {/* )} */}
    </nav>
  );
};