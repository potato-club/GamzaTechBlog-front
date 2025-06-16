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
  needsProfileCompletion: boolean; // 프로필 추가 정보 입력이 필요한 상태인지 나타내는 플래그
}


export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user: UserProfileData;
  profileComplete: boolean;
}