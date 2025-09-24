import { UpdateProfileRequest, UserProfileResponse } from "@/generated/api/models";

// 컴포넌트 Props 타입

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

// UI 관련 타입
export type MyPageTab = "posts" | "comments" | "likes";
