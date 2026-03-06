"use server";

import type {
  ProfileImageResponse,
  UpdateProfileRequest,
  UserProfileRequest,
  UserProfileResponse,
} from "@/generated/api";
import { withActionResult } from "@/lib/actionResult";
import { createUserServiceServer } from "../services/userService.server";

export const updateProfileInSignupAction = withActionResult(
  async (profileData: UserProfileRequest): Promise<UserProfileResponse> => {
    const userService = createUserServiceServer();
    return await userService.updateProfileInSignup(profileData);
  }
);

export const updateProfileAction = withActionResult(
  async (profileData: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const userService = createUserServiceServer();
    return await userService.updateProfile(profileData);
  }
);

export const updateProfileImageAction = withActionResult(
  async (imageFile: File): Promise<ProfileImageResponse> => {
    const userService = createUserServiceServer();
    return await userService.updateProfileImage(imageFile);
  }
);

export const withdrawAccountAction = withActionResult(async (): Promise<void> => {
  const userService = createUserServiceServer();
  await userService.withdrawAccount();
});
