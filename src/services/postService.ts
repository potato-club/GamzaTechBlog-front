import {
  Pageable,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
  ResponseDtoListPostPopularResponse,
  ResponseDtoListString,
  ResponseDtoPagedResponseLikeResponse,
  ResponseDtoPagedResponsePostListResponse,
  ResponseDtoPostDetailResponse,
  ResponseDtoPostResponse,
} from "@/generated/api";
import { API_CONFIG } from "../config/api";
import { API_PATHS } from "../constants/apiPaths";
import { fetchWithAuth } from "../lib/api";

// --- 커스텀 에러 클래스 ---
export class PostServiceError extends Error {
  constructor(
    public status: number,
    message: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = "PostServiceError";
  }
}

// `PostResponse`에 `likeId`를 추가한 타입
export type LikedPostResponse = PostResponse & { likeId: number };

export const postService = {
  /**
   * 최신순 게시물 목록을 조회합니다.
   *
   * @param params 페이지네이션 파라미터
   * @param options 캐싱 옵션 (서버 컴포넌트에서 사용시 캐싱 적용 가능)
   */
  async getPosts(
    params?: Pageable,
    options?: { revalidate?: number; tags?: string[] }
  ): Promise<PagedResponsePostListResponse> {
    const endpoint = API_PATHS.posts.base;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // 서버 컴포넌트에서 호출시 Next.js 캐싱 적용
      if (options?.revalidate || options?.tags) {
        fetchOptions.next = {
          revalidate: options.revalidate || 300, // 기본 5분
          tags: options.tags || ["posts-list"],
        };
      } else {
        fetchOptions.cache = "no-cache";
      }

      const response = await fetch(url.toString(), fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch posts",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPagedResponsePostListResponse = await response.json();
      return apiResponse.data as PagedResponsePostListResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 주간 인기 게시물 목록을 조회합니다.
   *
   * @param options 캐싱 옵션 (서버 컴포넌트에서 사용시 캐싱 적용 가능)
   */
  async getPopularPosts(options?: {
    revalidate?: number;
    tags?: string[];
  }): Promise<PostPopularResponse[]> {
    const endpoint = API_PATHS.posts.popular;
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // 서버 컴포넌트에서 호출시 Next.js 캐싱 적용
      if (options?.revalidate || options?.tags) {
        fetchOptions.next = {
          revalidate: options.revalidate || 86400, // 기본 24시간
          tags: options.tags || ["popular-posts"],
        };
      } else {
        fetchOptions.cache = "no-cache";
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch popular posts",
          endpoint
        );
      }

      const apiResponse: ResponseDtoListPostPopularResponse = await response.json();
      return apiResponse.data as PostPopularResponse[];
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 태그별 게시물 목록을 조회합니다.
   *
   * @param tagName 태그명
   * @param params 페이지네이션 파라미터
   * @param options 캐싱 옵션 (서버 컴포넌트에서 사용시 캐싱 적용 가능)
   */
  async getPostsByTag(
    tagName: string,
    params?: Pageable,
    options?: { revalidate?: number; tags?: string[] }
  ): Promise<PagedResponsePostListResponse> {
    const endpoint = API_PATHS.posts.byTag(tagName);
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // 서버 컴포넌트에서 호출시 Next.js 캐싱 적용
      if (options?.revalidate || options?.tags) {
        fetchOptions.next = {
          revalidate: options.revalidate || 300, // 기본 5분
          tags: options.tags || [`posts-tag-${tagName}`],
        };
      } else {
        fetchOptions.cache = "no-cache";
      }

      const response = await fetch(url.toString(), fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch posts by tag",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPagedResponsePostListResponse = await response.json();
      return apiResponse.data as PagedResponsePostListResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 태그 목록을 조회합니다.
   *
   * @param options 캐싱 옵션 (서버 컴포넌트에서 사용시 캐싱 적용 가능)
   */
  async getTags(options?: { revalidate?: number; tags?: string[] }): Promise<string[]> {
    const endpoint = API_PATHS.tags.base;
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // 서버 컴포넌트에서 호출시 Next.js 캐싱 적용
      if (options?.revalidate || options?.tags) {
        fetchOptions.next = {
          revalidate: options.revalidate || 86400, // 기본 24시간
          tags: options.tags || ["tags"],
        };
      } else {
        fetchOptions.cache = "no-cache";
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch tags",
          endpoint
        );
      }

      const apiResponse: ResponseDtoListString = await response.json();
      return apiResponse.data as string[];
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   *
   * @param postId 게시글 ID
   * @param options 캐싱 옵션 (서버 컴포넌트에서 사용시 캐싱 적용 가능)
   */
  async getPostById(
    postId: number,
    options?: { revalidate?: number; tags?: string[] }
  ): Promise<PostDetailResponse> {
    const endpoint = API_PATHS.posts.byId(postId);
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // 서버 컴포넌트에서 호출시 Next.js 캐싱 적용
      if (options?.revalidate || options?.tags) {
        fetchOptions.next = {
          revalidate: options.revalidate || 300,
          tags: options.tags || [`post-${postId}`],
        };
      } else {
        // 클라이언트에서 호출시 캐싱 안함 (TanStack Query가 담당)
        fetchOptions.cache = "no-cache";
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || `Failed to fetch post with id ${postId}`,
          endpoint
        );
      }

      const apiResponse: ResponseDtoPostDetailResponse = await response.json();
      return apiResponse.data as PostDetailResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 새 게시글을 생성합니다.
   */
  async createPost(post: PostRequest): Promise<PostResponse> {
    const endpoint = API_PATHS.posts.base;
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const response = (await fetchWithAuth(url, {
        method: "POST",
        body: JSON.stringify(post),
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to create post",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPostResponse = await response.json();
      return apiResponse.data as PostResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 사용자가 작성한 게시글 목록을 조회합니다.
   */
  async getUserPosts(params?: Pageable): Promise<PagedResponsePostListResponse> {
    const endpoint = API_PATHS.posts.me;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const response = (await fetchWithAuth(url.toString(), {
        method: "GET",
        cache: "no-cache",
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch user posts",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPagedResponsePostListResponse = await response.json();
      return apiResponse.data as PagedResponsePostListResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 게시글을 삭제합니다.
   */
  async deletePost(postId: number): Promise<void> {
    const endpoint = API_PATHS.posts.byId(postId);
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const response = (await fetchWithAuth(url, {
        method: "DELETE",
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || `Failed to delete post with id ${postId}`,
          endpoint
        );
      }
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 사용자가 좋아요한 게시글 목록을 조회합니다.
   */
  async getUserLikes(params?: Pageable): Promise<PagedResponseLikeResponse> {
    const endpoint = API_PATHS.likes.me;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const response = (await fetchWithAuth(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch user likes",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPagedResponseLikeResponse = await response.json();
      return apiResponse.data as PagedResponseLikeResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 게시글을 수정합니다.
   */
  async updatePost(postId: number, postData: PostRequest): Promise<PostResponse> {
    const endpoint = API_PATHS.posts.byId(postId);

    try {
      const response = (await fetchWithAuth(API_CONFIG.BASE_URL + endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
        cache: "no-store",
      })) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to update post",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPostResponse = await response.json();
      return apiResponse.data as PostResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },

  /**
   * 게시글을 검색합니다.
   */
  async searchPosts(keyword: string, params?: Pageable): Promise<PagedResponsePostListResponse> {
    const endpoint = API_PATHS.posts.search;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);
    url.searchParams.append("keyword", keyword);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to search posts",
          endpoint
        );
      }

      const apiResponse: ResponseDtoPagedResponsePostListResponse = await response.json();
      return apiResponse.data as PagedResponsePostListResponse;
    } catch (error) {
      if (error instanceof PostServiceError) throw error;
      throw new PostServiceError(
        500,
        (error as Error).message || "An unexpected error occurred",
        endpoint
      );
    }
  },
} as const;
