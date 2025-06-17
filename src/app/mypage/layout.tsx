"use client";

import MyPageSidebar from "@/components/layout/sidebar/MyPageSidebar";
import MyPageSkeleton from "@/components/skeletons/MyPageSkeleton";
import { useAuth } from "@/hooks/queries/useUserQueries"; // ⭐️ 인증 상태 컴포지션 훅 직접 import
import type { UserProfileData } from "@/types/user"; // ⭐️ 공통 UserProfileData 타입 가져오기
import { useRouter } from "next/navigation"; // ⭐️ 라우터 추가 (로그인 안된 경우 리디렉션 등)
import React, { Suspense, useEffect } from 'react'; // useEffect 추가 (선택적)

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const router = useRouter();
  const { userProfile, isLoggedIn, isLoading, refetchAuthStatus } = useAuth();

  console.log("userProfile", userProfile);

  // 로그인되지 않았거나 프로필 정보가 없는 경우 리디렉션
  useEffect(() => {
    // isLoading이 false이고, 로그인이 안 되었거나 유저 프로필이 없을 때 리디렉션
    if (!isLoading && (!isLoggedIn || !userProfile)) {
      router.push("/"); // 또는 접근 제한 페이지로 안내
    }
  }, [isLoading, isLoggedIn, userProfile, router]);

  // 프로필 업데이트 핸들러 (실제 API 연동 필요)
  const handleProfileUpdate = async (updatedData: Partial<UserProfileData>) => {
    if (!userProfile) return; // 사용자 프로필이 없으면 중단

    console.log("프로필 업데이트 시도:", updatedData);
    try {
      // 예시: await userService.updateProfile(updatedData); // 실제 API 호출
      // API 호출 성공 후
      await refetchAuthStatus(); // 사용자 정보를 다시 가져와 UI를 갱신합니다.
      alert("프로필이 업데이트되었습니다."); // 실제 서비스에서는 토스트 메시지 등을 사용하는 것이 좋습니다.
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return <MyPageSkeleton />;
  }

  // 로그인되지 않았거나 프로필 정보가 없는 경우 처리
  if (!isLoggedIn || !userProfile) {
    return ( // 로딩이 끝났지만 여전히 로그인 정보가 없다면, 리디렉션 메시지 표시
      <div className="flex mt-10 justify-center items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <p className="text-xl">마이페이지에 접근하려면 로그인이 필요합니다. 로그인 페이지로 이동합니다...</p>
      </div>
    );
  }

  return (
    <div className="flex mt-10 gap-4">
      {/* Consider adding a MyPage specific header or navigation here */}
      <Suspense fallback={<MyPageSkeleton />}>
        <MyPageSidebar userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
        <main className="flex-1">
          {children}
        </main>
      </Suspense>
    </div>
  );
}