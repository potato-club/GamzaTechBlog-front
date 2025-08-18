import { UpdateProfileRequest, UserProfileResponse } from "@/generated/api/models";

// 컴포넌트 Props 타입
export interface UserProfileProps {
  user: UserProfileResponse;
  className?: string;
}

export interface ProfileEditDialogProps {
  user: UserProfileResponse;
  onClose: () => void;
  onSubmit: (data: UpdateProfileRequest) => void;
  isSubmitting?: boolean;
}

export interface UserActivityStatItemProps {
  label: string;
  count: number;
  icon?: React.ReactNode;
  className?: string;
}

export interface MyPageTabsProps {
  activeTab: MyPageTab;
  onTabChange: (tab: MyPageTab) => void;
}

// 로컬 상태 타입
export interface ProfileEditFormState {
  name: string;
  position: string;
  description: string;
  githubUrl: string;
  blogUrl: string;
  isSubmitting: boolean;
}

export interface MyPageState {
  activeTab: MyPageTab;
  isEditingProfile: boolean;
}

// UI 관련 타입
export type MyPageTab = "posts" | "comments" | "likes";

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesCount: number;
}
