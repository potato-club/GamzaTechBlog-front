import { UserProfileData } from "./user";

export interface AuthState {
  isLoggedIn: boolean | null; // null = 로딩중
  userProfile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserProfileData | null;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user: UserProfileData;
  profileComplete: boolean;
}