import { createUserServiceServer } from "@/features/user/services/userService.server";
import type { UserProfileResponse } from "@/generated/api/models";
import { HeaderNavigation } from "./HeaderNavigation";

export default async function HeaderNavigationServer() {
  let userRole: string | null = null;
  let userProfile: UserProfileResponse | null = null;

  try {
    const userService = createUserServiceServer();
    userRole = await userService.getUserRole();

    if (userRole && userRole !== "PRE_REGISTER") {
      userProfile = await userService.getProfile();
    }
  } catch (error) {
    console.warn("Failed to fetch header auth state:", error);
  }

  return <HeaderNavigation initialUserRole={userRole} initialUserProfile={userProfile} />;
}
