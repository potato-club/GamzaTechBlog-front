import UserIcon from "@/components/ui/UserIcon";
import { Button } from "@/components/ui/button";
import { createMyPageStats } from "@/constants/mypageConstants";
import { UserActivityStatItem } from "@/features/user";
import ProfileEditDialog from "@/features/user/components/ProfileEditDialog";
import type { UserActivityResponse, UserProfileResponse } from "@/generated/api";
import Image from "next/image";
import Link from "next/link";
import { createServerApiClient } from "../../../../lib/apiClient";

interface MyPageSidebarServerProps {
  isOwner?: boolean;
  username?: string;
}

/**
 * MyPageSidebar 서버 컴포넌트
 *
 * 사용자 프로필과 활동 통계를 서버에서 직접 fetch하여
 * 빠른 초기 렌더링을 제공합니다.
 *
 * @param isOwner - 현재 사용자가 프로필 소유자인지 여부 (편집 기능 표시 제어)
 * @param username - 조회할 사용자명 (공개 프로필용, 없으면 현재 사용자)
 */
export default async function MyPageSidebarServer({
  isOwner = true,
  username,
}: MyPageSidebarServerProps = {}) {
  // API 호출: 소유자인 경우 현재 사용자 정보, 아닌 경우 공개 프로필 정보 조회
  let userProfile: UserProfileResponse | null = null;
  let activityStats: UserActivityResponse | null = null;

  try {
    const api = createServerApiClient();

    if (isOwner) {
      // 내 프로필 조회 - 서버 API 클라이언트 사용
      userProfile = (await api.getCurrentUserProfile()).data || null;
      activityStats = (await api.getActivitySummary()).data || null;
    } else {
      // 공개 프로필 조회
      if (!username) {
        throw new Error("Username is required for public profile");
      }
      const publicProfileResponse = await api.getPublicProfileByNickname({
        nickname: username,
        page: 0,
        size: 10,
      });
      const publicData = publicProfileResponse.data;
      // UserMiniProfileResponse를 UserProfileResponse 형태로 변환
      userProfile = publicData?.profile
        ? ({
            nickname: publicData.profile.nickname,
            profileImageUrl: publicData.profile.profileImageUrl,
            gamjaBatch: publicData.profile.gamjaBatch,
          } as UserProfileResponse)
        : null;
      activityStats = publicData?.activity || null;
    }
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    // 인증 에러인 경우 null로 처리하여 기본 UI 표시
    userProfile = null;
    activityStats = null;
  }

  const stats = createMyPageStats(activityStats);

  // 프로필 데이터가 없는 경우 (인증 실패 등)
  if (!userProfile) {
    return (
      <aside className="flex w-64 flex-col items-center py-10 pr-8">
        <div className="text-center">
          <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full bg-gray-200">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-gray-500">
              <UserIcon className="h-16 w-16" />
            </div>
          </div>
          <p className="text-gray-500">프로필을 불러올 수 없습니다</p>
          <p className="text-sm text-gray-400">로그인이 필요합니다</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-64 flex-col items-center py-10 pr-8">
      <section aria-labelledby="user-profile-heading" className="flex flex-col items-center">
        <h2 id="user-profile-heading" className="sr-only">
          {userProfile?.nickname}님의 {isOwner ? "프로필 정보" : "공개 프로필"}
        </h2>

        {/* 프로필 이미지 */}
        <figure className="relative mb-4 h-28 w-28 overflow-hidden rounded-full bg-gray-200">
          {userProfile?.profileImageUrl ? (
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
              <UserIcon className="h-16 w-16" />
            </div>
          )}
        </figure>

        {/* 사용자 정보 */}
        <div className="mb-2 text-center">
          <p className="text-2xl font-bold" aria-label="닉네임">
            {userProfile?.nickname}
          </p>
          {userProfile?.gamjaBatch && (
            <p className="mt-0.5 text-sm text-gray-400" aria-label="감자 기수">
              감자 {userProfile.gamjaBatch}기
            </p>
          )}
          {/* 이메일은 소유자에게만 표시 */}
          {isOwner && userProfile?.email && (
            <p className="mt-1 text-sm text-gray-500" aria-label="이메일">
              {userProfile.email}
            </p>
          )}
        </div>

        {/* 프로필 수정 Dialog 또는 GitHub 방문 버튼 */}
        {isOwner && userProfile ? (
          <ProfileEditDialog userProfile={userProfile} />
        ) : (
          userProfile?.nickname && (
            <Link
              href={`https://github.com/${userProfile.nickname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              <Button variant="primary" size="rounded" className="flex gap-1.5">
                <Image src="/githubIcon.svg" alt="GitHub 프로필 방문" width={16} height={16} />
                <span>GitHub</span>
              </Button>
            </Link>
          )
        )}
      </section>

      {/* 작성 글, 작성 댓글, 좋아요 수 표시 */}
      <section aria-labelledby="user-activity-stats-heading" className="mt-10 w-full">
        <h2 id="user-activity-stats-heading" className="sr-only">
          사용자 활동 통계
        </h2>
        <ul className="flex justify-around text-center text-sm">
          {stats.map((stat) => (
            <UserActivityStatItem
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              count={stat.count}
            />
          ))}
        </ul>
      </section>
    </aside>
  );
}
