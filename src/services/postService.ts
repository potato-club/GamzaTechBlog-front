import { API_CONFIG } from "../config/api";
import { API_PATHS } from "../constants/apiPaths";
import {
  Pageable,
  PagedResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
  ResponseDto,
} from "@/generated/api";
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
   */
  async getPosts(params?: Pageable): Promise<PagedResponse> {
    const endpoint = API_PATHS.posts.base;
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch posts",
          endpoint
        );
      }

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as PagedResponse;
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
   */
  async getPopularPosts(): Promise<PostPopularResponse[]> {
    const endpoint = API_PATHS.posts.popular;
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch popular posts",
          endpoint
        );
      }

      const apiResponse: ResponseDto = await response.json();
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
   */
  async getPostsByTag(tagName: string, params?: Pageable): Promise<PagedResponse> {
    const endpoint = API_PATHS.posts.byTag(tagName);
    const url = new URL(API_CONFIG.BASE_URL + endpoint);

    if (params?.page !== undefined) url.searchParams.append("page", String(params.page));
    if (params?.size !== undefined) url.searchParams.append("size", String(params.size));
    if (params?.sort) params.sort.forEach((sort: string) => url.searchParams.append("sort", sort));

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch posts by tag",
          endpoint
        );
      }

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as PagedResponse;
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
   */
  async getTags(): Promise<string[]> {
    const endpoint = API_PATHS.tags.base;
    const url = API_CONFIG.BASE_URL + endpoint;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || "Failed to fetch tags",
          endpoint
        );
      }

      const apiResponse: ResponseDto = await response.json();
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
   */
  async getPostById(postId: number): Promise<PostDetailResponse> {
    const endpoint = API_PATHS.posts.byId(postId);
    const url = API_CONFIG.BASE_URL + endpoint;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PostServiceError(
          response.status,
          errorData.message || `Failed to fetch post with id ${postId}`,
          endpoint
        );
      }

      const apiResponse: ResponseDto = await response.json();
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

      const apiResponse: ResponseDto = await response.json();
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
  async getUserPosts(params?: Pageable): Promise<PagedResponse> {
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

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as PagedResponse;
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
  async getUserLikes(params?: Pageable): Promise<PagedResponse> {
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

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as PagedResponse;
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

      const apiResponse: ResponseDto = await response.json();
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
  async searchPosts(keyword: string, params?: Pageable): Promise<PagedResponse> {
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

      const apiResponse: ResponseDto = await response.json();
      return apiResponse.data as PagedResponse;
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
