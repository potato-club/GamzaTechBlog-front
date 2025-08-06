"use client";

// TanStack Query 훅을 사용하여 사용자 활동 통계를 효율적으로 관리합니다
import { useUserActivityStats } from "@/hooks/queries/useUserQueries";
import type { UserProfileResponse } from "@/generated/api";
import Image from "next/image";
import ProfileEditDialog from "../../features/user/ProfileEditDialog";
import UserActivityStatItem from "../../features/user/UserActivityStatItem";
import UserIcon from "../../ui/UserIcon";

// Sidebar 컴포넌트 props 정의
interface SidebarProps {
  userProfile: UserProfileResponse; // 실제 사용자 프로필 데이터
}

interface StatItem {
  icon: string;
  alt: string;
  label: string;
  count: number;
}

export default function MyPageSidebar({ userProfile }: SidebarProps) {
  /**
   * TanStack Query를 사용하여 사용자 활동 통계를 가져옵니다.
   *
   * 기존의 useEffect + useState 패턴 대신 useUserActivityStats 훅을 사용하여:
   * - 자동 캐싱: 동일한 데이터를 여러 컴포넌트에서 공유
   * - 백그라운드 재검증: 데이터가 오래되면 자동으로 업데이트
   * - 로딩/에러 상태 관리: 별도 state 없이 자동 제공
   * - 재시도 로직: 네트워크 오류 시 자동 재시도
   */
  const {
    data: activityStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useUserActivityStats();

  const stats: StatItem[] = [
    {
      icon: "/postIcon.svg",
      alt: "작성 글 아이콘",
      label: "작성 글",
      count: activityStats?.writtenPostCount ?? 0,
    },
    {
      icon: "/commentIcon.svg",
      alt: "작성 댓글 아이콘",
      label: "작성 댓글",
      count: activityStats?.writtenCommentCount ?? 0,
    },
    {
      icon: "/likeIcon.svg",
      alt: "좋아요 아이콘",
      label: "좋아요",
      count: activityStats?.likedPostCount ?? 0,
    },
  ];

  console.log("mypage activityStats", stats);

  // Sidebar 자체에서 관리할 상태가 있다면 여기에 둡니다.
  // 예: const [isSomethingOpen, setIsSomethingOpen] = useState(false);

  console.log("mypage userProfile", userProfile);

  return (
    <aside className="flex w-64 flex-col items-center py-10 pr-8">
      <section aria-labelledby="user-profile-heading" className="flex flex-col items-center">
        <h2 id="user-profile-heading" className="sr-only">
          {userProfile.nickname}님의 프로필 정보
        </h2>
        {/* 프로필 이미지 */}
        <figure className="relative mb-4 h-28 w-28 overflow-hidden rounded-full bg-gray-200">
          {userProfile.profileImageUrl ? (
            <Image
              src={userProfile.profileImageUrl}
              alt={`${userProfile.nickname} 프로필 이미지`}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-gray-500"
              aria-label="기본 프로필 이미지"
            >
              <UserIcon className="h-16 w-16" /> {/* 예시 아이콘 */}
            </div>
          )}
        </figure>
        {/* 사용자 정보 */}
        <div className="mb-2 text-center">
          <p className="text-2xl font-bold" aria-label="닉네임">
            {userProfile.nickname}
          </p>
          {userProfile.gamjaBatch && (
            <p className="mt-0.5 text-sm text-gray-400" aria-label="감자 기수">
              감자 {userProfile.gamjaBatch}기
            </p>
          )}
          {userProfile.email && (
            <p className="mt-1 text-sm text-gray-500" aria-label="이메일">
              {userProfile.email}
            </p>
          )}
        </div>

        {/* 프로필 수정 Dialog 호출 */}
        <ProfileEditDialog userProfile={userProfile} />
      </section>

      {/* 작성 글, 작성 댓글, 좋아요 수 표시 */}
      <section aria-labelledby="user-activity-stats-heading" className="mt-10 w-full">
        <h2 id="user-activity-stats-heading" className="sr-only">
          사용자 활동 통계
        </h2>{" "}
        <ul className="flex justify-around text-center text-sm">
          {isLoadingStats ? (
            /* TanStack Query 로딩 상태: 스켈레톤 UI 표시 */
            <>
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="h-12 w-16 animate-pulse rounded-md bg-gray-200" />
            </>
          ) : statsError ? (
            /* TanStack Query 에러 상태: 간단한 에러 메시지 표시 */
            <div className="text-sm text-red-500">통계를 불러올 수 없습니다</div>
          ) : (
            /* TanStack Query 성공 상태: 실제 데이터 표시 */
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
