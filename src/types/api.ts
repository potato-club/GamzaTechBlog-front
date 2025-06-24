export interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T;
  timestamp?: number;
}

/**
 * 페이지네이션을 위한 공통 파라미터 타입
 * 
 * 모든 목록 조회 API에서 사용되는 표준 페이지네이션 파라미터입니다.
 * 기존 GetPostsParams를 대체하는 공통 타입입니다.
 */
export interface PaginationParams {
  page?: number;    // 페이지 번호 (0부터 시작)
  size?: number;    // 페이지당 아이템 수
  sort?: string[];  // 정렬 조건 배열 (예: ["createdAt,desc", "title,asc"])
}

export interface PageableContent<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
  timestamp?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// API 에러 타입
export interface ApiError {
  status: number;
  message: string;
  endpoint?: string;
  timestamp: number;
}