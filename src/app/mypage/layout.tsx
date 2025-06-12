"use client";

import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import MyPageSkeleton from "@/components/skeletons/MyPageSkeleton";
import React, { Suspense } from 'react';

interface MyPageLayoutProps {
  children: React.ReactNode;
}

interface UserProfileData {
  profileImageUrl?: string;
  nickname: string;
  job?: string;
  generation?: string;
  postsCount?: number;
  commentsCount?: number;
  likesCount?: number;
}

// 임시 정적 사용자 프로필 데이터
const tempUserProfile: UserProfileData = {
  profileImageUrl: "", // 임시 이미지 URL
  nickname: "임시 사용자",
  job: "임시 직군",
  generation: "X기",
  postsCount: 10,
  commentsCount: 5,
  likesCount: 20,
};

// 임시 프로필 업데이트 핸들러
const handleTempProfileUpdate = (updatedProfile: Partial<UserProfileData>) => {
  // console.log("임시 프로필 업데이트 요청:", updatedProfile);
  // 실제로는 여기서 API를 호출하고 상태를 업데이트해야 합니다.
  // 예: setUserProfile(prev => ({ ...prev, ...updatedProfile }));
  // alert(`프로필 업데이트: ${JSON.stringify(updatedProfile)} (실제 API 호출 필요)`);
};


export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <div className="flex mt-10">
      {/* Consider adding a MyPage specific header or navigation here */}
      <Suspense fallback={<MyPageSkeleton />}>
        <MyPageSidebar userProfile={tempUserProfile} onProfileUpdate={handleTempProfileUpdate} />
        <main className="flex-1">
          {children}
        </main>
      </Suspense>
    </div>
  );
}