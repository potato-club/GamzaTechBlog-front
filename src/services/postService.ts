import { API_CONFIG } from "../config/api";
import { fetchWithAuth } from "../lib/api";
import { PostDetailData } from "../types/comment";
import { CreatePostRequest, CreatePostResponse, PostData } from "../types/post";

interface ApiResponseWrapper<T> {
  status: number;
  message: string;
  data: T;
  timestamp?: number;
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
}

// --- 커스텀 에러 클래스 ---
export class PostServiceError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'PostServiceError';
  }
}

export const postService = {
  /**
   * 최신순 게시물 목록을 조회합니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   * @param params - 페이지네이션, 정렬, 태그 필터링 옵션
   */
  async getPosts(params?: GetPostsParams): Promise<PageableContent<PostData>> {
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
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    console.log("queryParams", queryParams.toString());

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
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
  },  /**
   * 태그 목록을 조회합니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   */
  async getTags(): Promise<string[]> {
    const endpoint = '/api/v1/tags';
    const url = API_CONFIG.BASE_URL + endpoint;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
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
  },  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   * @param postId - 조회할 게시글 ID
   */
  async getPostById(postId: number): Promise<PostDetailData> {
    const endpoint = `/api/v1/posts/${postId}`;
    const url = API_CONFIG.BASE_URL + endpoint;

    console.log("Requesting URL (getPostById):", url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
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
  /**
   * 새 게시글을 생성합니다.
   * POST 뮤테이션 작업이므로 캐싱하지 않습니다.
   * @param post - 생성할 게시글 데이터
   */
  async createPost(post: CreatePostRequest): Promise<CreatePostResponse> {
    const endpoint = '/api/v1/posts';
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      // 인증이 필요한 요청이므로 fetchWithAuth 사용
      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(post),
        // POST 작업이므로 캐싱하지 않음 (fetchWithAuth에서 기본값으로 처리)
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
  /**
   * 사용자가 작성한 게시글 목록을 조회합니다.
   * TanStack Query에서 캐싱을 담당하므로 fetch 레벨에서는 캐싱하지 않습니다.
   * @param params - 페이지네이션, 정렬 옵션
   */
  async getUserPosts(params?: GetPostsParams): Promise<PageableContent<PostData>> {
    const endpoint = '/api/v1/posts/me';
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
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    console.log("queryParams", queryParams.toString());

    try {
      const response = await fetchWithAuth(url, {
        method: 'GET',
        // 인증이 필요한 요청이지만 GET이므로 캐싱 설정을 명시적으로 비활성화
        cache: 'no-cache', // TanStack Query가 캐싱을 담당하므로 fetch 캐싱 비활성화
      }) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user posts' }));
        throw new PostServiceError(response.status, errorData.message || 'Failed to fetch user posts', endpoint);
      }

      const apiResponse: ApiResponseWrapper<PageableContent<PostData>> = await response.json();

      console.log("getUserPosts response:", apiResponse);

      return apiResponse.data;
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      // 네트워크 에러 또는 기타 예외 처리
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred while fetching user posts', endpoint);
    }
  },

  /**
   * 게시글을 삭제합니다.
   * @param postId - 삭제할 게시글 ID
   */
  async deletePost(postId: number): Promise<void> {
    const endpoint = `/api/v1/posts/${postId}`;
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        // DELETE 작업이므로 캐싱하지 않음 (fetchWithAuth에서 기본값으로 처리)
      }) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to delete post with id ${postId}` }));
        throw new PostServiceError(response.status, errorData.message || `Failed to delete post with id ${postId}`, endpoint);
      }
    } catch (error) {
      if (error instanceof PostServiceError) {
        throw error;
      }
      // 네트워크 에러 또는 기타 예외 처리
      throw new PostServiceError(500, (error as Error).message || 'An unexpected error occurred while deleting post', endpoint);
    }
  },
} as const;