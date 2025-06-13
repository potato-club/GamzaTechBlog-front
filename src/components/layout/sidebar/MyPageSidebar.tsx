"use client";

import Image from "next/image";
import ProfileEditDialog from "../../features/user/ProfileEditDialog"; // 분리된 Dialog 컴포넌트 import

// UserProfileData 타입 정의 (실제 프로젝트에 맞게 수정 또는 공유 타입 사용)
interface UserProfileData {
  profileImageUrl?: string;
  nickname: string;
  job?: string;
  generation?: string;
  postsCount?: number; // 예시 통계 데이터
  commentsCount?: number; // 예시 통계 데이터
  likesCount?: number; // 예시 통계 데이터
  // 기타 필요한 필드들
}

// Sidebar 컴포넌트 props 정의
interface SidebarProps {
  userProfile: UserProfileData; // 실제 사용자 프로필 데이터
  onProfileUpdate: (updatedProfile: Partial<UserProfileData>) => void; // 프로필 업데이트 콜백
}

export default function MyPageSidebar({ userProfile, onProfileUpdate }: SidebarProps) {
  // 통계 데이터는 props로 받거나 API 호출을 통해 동적으로 가져오는 것이 좋습니다.
  const stats = [
    { icon: "/postIcon.svg", alt: "작성 글 아이콘", label: "작성 글", count: userProfile.postsCount || 0 },
    { icon: "/commentIcon.svg", alt: "작성 댓글 아이콘", label: "작성 댓글", count: userProfile.commentsCount || 0 },
    { icon: "/likeIcon.svg", alt: "좋아요 아이콘", label: "좋아요", count: userProfile.likesCount || 0 },
  ];

  // Sidebar 자체에서 관리할 상태가 있다면 여기에 둡니다.
  // 예: const [isSomethingOpen, setIsSomethingOpen] = useState(false);

  return (
    <aside className="flex flex-col items-center w-64 py-10 px-4">
      {/* 프로필 이미지 */}
      <div className="relative w-28 h-28 rounded-full bg-gray-200 mb-4 overflow-hidden">
        {userProfile.profileImageUrl ? (
          <Image
            src={userProfile.profileImageUrl}
            alt={`${userProfile.nickname} 프로필 이미지`}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 rounded-full">
            <UserIcon className="w-16 h-16" /> {/* 예시 아이콘 */}
          </div>
        )}
      </div>
      {/* 닉네임 */}
      <span className="text-2xl font-bold mb-2">{userProfile.nickname}</span>

      {/* 프로필 수정 Dialog 호출 */}
      <ProfileEditDialog userProfile={userProfile} onProfileUpdate={onProfileUpdate} />

      {/* 작성 글, 작성 댓글, 좋아요 수 표시 */}
      <div className="mt-10 w-full text-center flex justify-around text-sm">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src={stat.icon} alt={stat.alt} width={23} height={23} />
            </div>
            <div className="mt-1 text-gray-600">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.count}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// 임시 UserIcon (실제 아이콘 라이브러리 사용 권장, 또는 공유 유틸리티로 분리)
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}