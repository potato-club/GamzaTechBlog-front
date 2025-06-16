"use client";

import { userService } from "@/services/userService"; // ⭐️ userService import
import type { UserActivityStats, UserProfileData } from "@/types/user"; // ⭐️ 공유 타입 사용
import Image from "next/image";
import { useEffect, useState } from "react"; // ⭐️ useEffect, useState import
import ProfileEditDialog from "../../features/user/ProfileEditDialog";
import UserActivityStatItem from "../../features/user/UserActivityStatItem";
import UserIcon from "../../ui/UserIcon";

// Sidebar 컴포넌트 props 정의
interface SidebarProps {
  userProfile: UserProfileData; // 실제 사용자 프로필 데이터
  onProfileUpdate: (updatedProfile: Partial<UserProfileData>) => void; // 프로필 업데이트 콜백
}

interface StatItem {
  icon: string;
  alt: string;
  label: string;
  count: number;
}

export default function MyPageSidebar({ userProfile, onProfileUpdate }: SidebarProps) {
  const [activityStats, setActivityStats] = useState<UserActivityStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (userProfile?.githubId) { // userProfile이 있고, 식별 가능한 ID가 있을 때만 호출
        try {
          setIsLoadingStats(true);
          const statsData = await userService.getActivityCounts();
          setActivityStats(statsData);
        } catch (error) {
          console.error("Failed to fetch activity stats:", error);
          // 에러 처리 (예: 사용자에게 알림)
        } finally {
          setIsLoadingStats(false);
        }
      }
    };
    fetchStats();
  }, [userProfile?.githubId]); // userProfile.githubId가 변경될 때마다 실행

  const stats: StatItem[] = [
    { icon: "/postIcon.svg", alt: "작성 글 아이콘", label: "작성 글", count: activityStats?.writtenPostCount ?? 0 },
    { icon: "/commentIcon.svg", alt: "작성 댓글 아이콘", label: "작성 댓글", count: activityStats?.writtenCommentCount ?? 0 },
    { icon: "/likeIcon.svg", alt: "좋아요 아이콘", label: "좋아요", count: activityStats?.likedPostCount ?? 0 },
  ];

  console.log('mypage activityStats', stats);

  // Sidebar 자체에서 관리할 상태가 있다면 여기에 둡니다.
  // 예: const [isSomethingOpen, setIsSomethingOpen] = useState(false);

  console.log("mypage userProfile", userProfile);

  return (
    <aside className="flex flex-col items-center w-64 py-10 pr-8 border-r border-[#D5D9E3]">
      <section aria-labelledby="user-profile-heading" className="flex flex-col items-center">
        <h2 id="user-profile-heading" className="sr-only">{userProfile.nickname}님의 프로필 정보</h2>
        {/* 프로필 이미지 */}
        <figure className="relative w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden">
          {userProfile.profileImageUrl ? (
            <Image
              src={userProfile.profileImageUrl}
              alt={`${userProfile.nickname} 프로필 이미지`}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 rounded-full" aria-label="기본 프로필 이미지">
              <UserIcon className="w-16 h-16" /> {/* 예시 아이콘 */}
            </div>
          )}
        </figure>
        {/* 사용자 정보 */}
        <div className="text-center mb-2">
          <p className="text-2xl font-bold" aria-label="닉네임">{userProfile.nickname}</p>
          {userProfile.gamjaBatch && (
            <p className="text-sm text-gray-400 mt-0.5" aria-label="감자 기수">감자 {userProfile.gamjaBatch}기</p>
          )}
          {userProfile.email && (
            <p className="text-sm text-gray-500 mt-1" aria-label="이메일">{userProfile.email}</p>
          )}
        </div>

        {/* 프로필 수정 Dialog 호출 */}
        <ProfileEditDialog userProfile={userProfile} onProfileUpdate={onProfileUpdate} />
      </section>

      {/* 작성 글, 작성 댓글, 좋아요 수 표시 */}
      <section aria-labelledby="user-activity-stats-heading" className="mt-10 w-full">
        <h2 id="user-activity-stats-heading" className="sr-only">사용자 활동 통계</h2>
        <ul className="text-center flex justify-around text-sm">
          {isLoadingStats ? (
            <>
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
            </>
          ) : (
            stats.map((stat) => (
              <UserActivityStatItem
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                count={stat.count}
              />
            ))
          )}
        </ul>
      </section>
    </aside>
  );
}