import { Position } from "@/enums/position";

export type PositionKey = keyof typeof Position;

export interface UserProfileData {
  githubId?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  nickname: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  name?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  email?: string;
  profileImageUrl?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  role?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  studentNumber?: string;
  gamjaBatch?: number;
  position?: PositionKey; // 백엔드에 전송될 때는 "BACKEND"와 같은 키 값
  createdAt?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
  updatedAt?: string; // 회원가입 단계에서는 없을 수 있으므로 optional
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

export interface PendingUser {
  githubId: string;
  nickname: string;
  name: string;
  email: string;
  profileImageUrl: string;
  position: string;
  role: string;
  studentNumber: string;
  gamjaBatch: number;
  createdAt: string;
  updatedAt: string;
}

// Admin API 응답 타입들
export interface AdminApiResponse {
  status: number;
  message: string;
  data: any;
  timestamp: number;
}

export interface ApproveUserResponse {
  status: number;
  message: string;
  data: object;
  timestamp: number;
}

export interface PendingUsersResponse {
  status: number;
  message: string;
  data: PendingUser[];
  timestamp: number;
}
