"use client";

import MyPageSidebar from "@/components/layout/sidebar/MyPageSidebar";
import MyPageSkeleton from "@/components/skeletons/MyPageSkeleton";
import { useAuth } from "@/hooks/queries/useUserQueries";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from 'react';

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const router = useRouter();
  const { userProfile, isLoggedIn, isLoading } = useAuth();

  console.log("userProfile", userProfile);

  // 로그인되지 않았거나 프로필 정보가 없는 경우 리디렉션
  useEffect(() => {
    // isLoading이 false이고, 로그인이 안 되었거나 유저 프로필이 없을 때 리디렉션
    if (!isLoading && (!isLoggedIn || !userProfile)) {
      router.push("/"); // 또는 접근 제한 페이지로 안내
    }
  }, [isLoading, isLoggedIn, userProfile, router]);

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
        <MyPageSidebar userProfile={userProfile} />
        <main className="flex-1">
          {children}
        </main>
      </Suspense>
    </div>
  );
}