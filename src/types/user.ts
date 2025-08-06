/**
 * OpenAPI Spec에 포함되지 않은 관리자 API 관련 타입들입니다.
 * 추후 백엔드 API 명세가 업데이트되면 이 파일은 삭제될 수 있습니다.
 */

// 가입 승인 대기중인 사용자 정보
export interface PendingUser {
  userId: string;
  gamjaBatch: number;
  name: string;
  position: string;
  createdAt: string;
}

// 범용 관리자 API 응답 타입
export interface AdminApiResponse {
  status: number;
  message: string;
  data: any;
  timestamp: number;
}

// 사용자 승인 API 응답
export interface ApproveUserResponse {
  status: number;
  message: string;
  data: object;
  timestamp: number;
}

// 승인 대기 사용자 목록 API 응답
export interface PendingUsersResponse {
  status: number;
  message: string;
  data: PendingUser[];
  timestamp: number;
}
