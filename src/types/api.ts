export interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T;
  timestamp?: number;
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