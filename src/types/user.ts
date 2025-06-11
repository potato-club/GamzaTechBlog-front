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

// 사용자 역할 타입
export type UserPosition = 'BACKEND' | 'FRONTEND' | 'DESIGN' | 'PM' | 'QA';
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';