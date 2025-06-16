export interface UserProfileData {
  githubId: string,
  nickname: string,
  name: string,
  email: string,
  profileImageUrl: string,
  role: string,
  gamjaBatch: number,
  createdAt: string,
  updatedAt: string;
}

// export interface UserProfile extends UserProfileData {
//   githubId: string;
//   nickname: string;
//   name: string;  
//   profileImageUrl: string;
//   role: string;
//   profileComplete: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

export interface UserActivityStats {
  likedPostCount: number;
  writtenPostCount: number;
  writtenCommentCount: number;
}

// 사용자 역할 타입
export type UserPosition = 'BACKEND' | 'FRONTEND' | 'DESIGNER' | 'APP_DEVELOPER';
// export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';