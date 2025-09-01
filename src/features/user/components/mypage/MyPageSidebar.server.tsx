import UserIcon from "@/components/ui/UserIcon";
import { UserActivityStatItem } from "@/features/user";
import ProfileEditDialog from "@/features/user/components/ProfileEditDialog";
import Image from "next/image";
import { createServerApiClient } from "../../../../lib/apiClient";

interface StatItem {
  icon: string;
  alt: string;
  label: string;
  count: number;
}

/**
 * MyPageSidebar 서버 컴포넌트
 *
 * 사용자 프로필과 활동 통계를 서버에서 직접 fetch하여
 * 빠른 초기 렌더링을 제공합니다.
 */
export default async function MyPageSidebarServer() {
  const api = createServerApiClient();

  // 3. 생성된 클라이언트로 직접 API를 호출합니다.
  // openapi-generator로 생성된 클라이언트는 보통 .data 프로퍼티에 실제 응답 데이터가 들어있습니다.
  const userProfile = (await api.getCurrentUserProfile()).data;
  const activityStats = (await api.getActivitySummary()).data;

  console.log("User Profile:", userProfile);
  console.log("Activity Stats:", activityStats);

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

  return (
    <aside className="flex w-64 flex-col items-center py-10 pr-8">
      <section aria-labelledby="user-profile-heading" className="flex flex-col items-center">
        <h2 id="user-profile-heading" className="sr-only">
          {userProfile?.nickname}님의 프로필 정보
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
          {userProfile?.email && (
            <p className="mt-1 text-sm text-gray-500" aria-label="이메일">
              {userProfile.email}
            </p>
          )}
        </div>

        {/* 프로필 수정 Dialog - 클라이언트 컴포넌트 */}
        {userProfile && <ProfileEditDialog userProfile={userProfile} />}
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
