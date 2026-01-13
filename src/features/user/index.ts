// User Domain Feature Exports
export * from "./components";
export * from "./hooks";
export * from "./types";

// Hooks
export {
  USER_QUERY_KEYS,
  useUpdateProfile,
  useUpdateProfileImage,
  useUpdateProfileInSignup,
  useWithdrawAccount,
} from "./hooks";

// Components (Client-safe only)
export {
  ErrorDisplay,
  ProfileEditDialog,
  ProfileEditDialogSkeleton,
  UserActivityStatItem,
  UserActivityStatsSkeleton,
} from "./components";

// Types
export type { MyPageTab, ProfileEditDialogProps, UserActivityStatItemProps } from "./types";

// ⚠️ Server Components/Services는 직접 import하세요:
// import MyPageSidebarServer from "@/features/user/components/mypage/MyPageSidebar.server";
// import { createUserServiceServer } from "@/features/user/services/userService.server";
