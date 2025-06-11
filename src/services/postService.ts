import { API_CONFIG } from "../config/api";
import { PostData } from "../types/post";

interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T; // 이 T가 PageableContent<PostData>가 됩니다.
  timestamp?: number; // API 응답에 timestamp가 있다면 포함
}

interface PageableContent<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface Tag {
  tagName: string;
}


// API 요청 파라미터 타입
interface GetPostsParams {
  page?: number;
  size?: number;
  sort?: string[]; // 예: ["createdAt,desc"]
  tags?: string[];
}



// --- 커스텀 에러 클래스 (필요시 정의 또는 공통 에러 클래스 사용) ---
export class PostServiceError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'PostServiceError';
  }
}

export const postService = {
  /**
   * 최신순 게시물 목록을 조회합니다.
   * @param params - 페이지네이션, 정렬, 태그 필터링 옵션
   * @param nextOptions - Next.js fetch 캐싱 옵션 (필요한 경우)
   */
  async getPosts(
    params?: GetPostsParams,
    nextOptions?: NextFetchRequestConfig
  ): Promise<PageableContent<PostData>> {
    const endpoint = '/api/v1/posts';
    let url = API_CONFIG.BASE_URL + endpoint;

    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));
      if (params.sort && params.sort.length > 0) {
        params.sort.forEach(sortOption => queryParams.append('sort', sortOption));
      }
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...nextOptions, // Next.js fetch options
      });

      if (!response.ok) {
        // 서버에서 에러 응답이 온 경우
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new PostServiceError(response.status, errorData.message || 'Failed to fetch posts', endpoint);
      }

      const apiResponse: ApiResponseWrapper<PageableContent<PostData>> = await response.json();
      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      // 네트워크 에러 또는 기타 예외 처리
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred', endpoint);
    }
  },
  async getTags(nextOptions?: NextFetchRequestConfig): Promise<Tag[]> {
    const endpoint = '/api/v1/tags';
    const url = API_CONFIG.BASE_URL + endpoint;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...nextOptions, // Next.js fetch options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new PostServiceError(response.status, errorData.message || 'Failed to fetch tags', endpoint);
      }

      const apiResponse: ApiResponseWrapper<Tag[]> = await response.json();
      console.log("apiResponse.data", apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred', endpoint);
    }
  }

  // 여기에 다른 게시물 관련 API 함수들을 추가할 수 있습니다.
  // 예: async getPostById(postId: number): Promise<PostDetail> { ... }
  // 예: async createPost(postData: CreatePostDto): Promise<PostDetail> { ... }
} as const;