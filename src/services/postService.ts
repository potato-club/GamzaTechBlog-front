import { API_CONFIG } from "../config/api";
import { fetchWithAuth } from "../lib/api"; // fetchWithAuth 임포트
import { PostDetailData } from "../types/comment";
import { CreatePostRequest, CreatePostResponse, PostData } from "../types/post";

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

    const page = params?.page !== undefined ? params.page : 0;
    const size = params?.size !== undefined ? params.size : 10;


    queryParams.append('page', String(page));
    queryParams.append('size', String(size));

    if (params) {
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

    console.log("queryParams", queryParams.toString());

    try {
      const response = await fetch(url, {
        next: {
          revalidate: 600, // 600초마다 캐시를 갱신
          tags: ['posts'], // 캐시 무효화 태그
        },
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
      console.log("apiResponse", apiResponse);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      // 네트워크 에러 또는 기타 예외 처리
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred', endpoint);
    }
  },
  async getTags(nextOptions?: NextFetchRequestConfig): Promise<string[]> {
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

      const apiResponse: ApiResponseWrapper<string[]> = await response.json();
      console.log("apiResponse.data", apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred', endpoint);
    }
  },
  async getPostById(
    postId: number,
    nextOptions?: NextFetchRequestConfig
  ): Promise<PostDetailData> { // 반환 타입을 PostDetailData로 수정
    const endpoint = `/api/v1/posts/${postId}`;
    const url = API_CONFIG.BASE_URL + endpoint;

    console.log("Requesting URL (getPostById):", url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...nextOptions,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to fetch post with id ${postId}` }));
        throw new PostServiceError(response.status, errorData.message || `Failed to fetch post with id ${postId}`, endpoint);
      }

      // Swagger 응답 예시에 따라 ApiResponseWrapper<PostDetailData>로 파싱
      const apiResponse: ApiResponseWrapper<PostDetailData> = await response.json();
      return apiResponse.data; // data 필드에 PostDetailData 객체가 있음
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred while fetching post details', endpoint);
    }
  },

  // 게시글 추가 로직 구현
  async createPost(post: CreatePostRequest): Promise<CreatePostResponse> {
    const endpoint = '/api/v1/posts';
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      // 인증이 필요한 요청이므로 fetchWithAuth 사용
      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(post),
      }) as Response; // fetchWithAuth는 Response를 반환하므로 타입 단언

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred while creating post' }));
        throw new PostServiceError(response.status, errorData.message || 'Failed to create post', endpoint);
      }

      const apiResponse: ApiResponseWrapper<CreatePostResponse> = await response.json();

      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      // 네트워크 에러 또는 기타 예외 처리
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred while creating post', endpoint);
    }
  },
} as const;