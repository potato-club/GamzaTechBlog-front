import "server-only";

import type {
  HomeFeedResponse,
  Pageable,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
  ResponseDtoHomeFeedResponse,
  ResponseDtoListPostPopularResponse,
  ResponseDtoListString,
  ResponseDtoPagedResponsePostListResponse,
  ResponseDtoPagedResponseLikeResponse,
  ResponseDtoPostDetailResponse,
  ResponseDtoPostResponse,
} from "@/generated/orval/models";
import { serverApiFetchJson } from "@/lib/serverApiFetch";

type NextOptions = { revalidate?: number | false; tags?: string[] };
type RequestInitWithNext = RequestInit & { next?: NextOptions };

const mergeNextOptions = (
  baseOptions: RequestInitWithNext | undefined,
  defaultTags: string[]
): RequestInitWithNext => {
  const existingTags = baseOptions?.next?.tags || [];
  return {
    ...baseOptions,
    next: {
      ...baseOptions?.next,
      tags: [...defaultTags, ...existingTags],
    },
  };
};

const buildPageParams = (params?: Pageable) => {
  const searchParams = new URLSearchParams();

  if (typeof params?.page === "number") {
    searchParams.set("page", params.page.toString());
  }
  if (typeof params?.size === "number") {
    searchParams.set("size", params.size.toString());
  }
  if (params?.sort?.length) {
    params.sort.forEach((sortKey) => {
      searchParams.append("sort", sortKey);
    });
  }

  return searchParams;
};

const buildQueryString = (params?: Pageable) => {
  const query = buildPageParams(params).toString();
  return query ? `?${query}` : "";
};

/**
 * Post Service 팩토리 함수
 *
 * 서버 환경에서 사용 가능한 공통 로직을 제공합니다.
 *
 * @returns Post Service 객체
 */
export const createPostService = () => {
  return {
    /**
     * 최신순 게시물 목록을 조회합니다.
     *
     * @param params - 페이지네이션 파라미터
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 페이지네이션된 게시물 목록
     */
    async getPosts(
      params: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponsePostListResponse> {
      const mergedOptions = mergeNextOptions(options, ["posts-list"]);
      const query = buildQueryString(params);
      const payload = await serverApiFetchJson<ResponseDtoPagedResponsePostListResponse>(
        `/api/v1/posts${query}`,
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Posts response data is missing.");
      }

      return payload.data;
    },

    /**
     * 주간 인기 게시물 목록을 조회합니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 인기 게시물 배열
     */
    async getPopularPosts(options?: RequestInitWithNext): Promise<PostPopularResponse[]> {
      const mergedOptions = mergeNextOptions(options, ["posts-popular"]);
      const payload = await serverApiFetchJson<ResponseDtoListPostPopularResponse>(
        "/api/v1/posts/popular",
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Popular posts response data is missing.");
      }

      return payload.data;
    },

    /**
     * 태그별 게시물 목록을 조회합니다.
     *
     * @param tagName - 태그 이름
     * @param params - 페이지네이션 파라미터
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 페이지네이션된 게시물 목록
     */
    async getPostsByTag(
      tagName: string,
      params: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponsePostListResponse> {
      const mergedOptions = mergeNextOptions(options, ["posts-list"]);
      const query = buildQueryString(params);
      const payload = await serverApiFetchJson<ResponseDtoPagedResponsePostListResponse>(
        `/api/v1/posts/tags/${tagName}${query}`,
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Posts by tag response data is missing.");
      }

      return payload.data;
    },

    /**
     * 태그 목록을 조회합니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 태그 이름 배열
     */
    async getTags(options?: RequestInitWithNext): Promise<string[]> {
      const mergedOptions = mergeNextOptions(options, ["tags"]);
      const payload = await serverApiFetchJson<ResponseDtoListString>(
        "/api/v1/tags",
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Tags response data is missing.");
      }

      return payload.data;
    },

    /**
     * 특정 게시글의 상세 정보를 조회합니다.
     *
     * @param postId - 게시글 ID
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 게시글 상세 정보
     */
    async getPostById(postId: number, options?: RequestInitWithNext): Promise<PostDetailResponse> {
      const mergedOptions = mergeNextOptions(options, [`post-${postId}`]);
      const payload = await serverApiFetchJson<ResponseDtoPostDetailResponse>(
        `/api/v1/posts/${postId}`,
        mergedOptions
      );

      if (!payload.data) {
        throw new Error("Post detail response data is missing.");
      }

      return payload.data;
    },

    /**
     * 새 게시글을 생성합니다.
     *
     * @param post - 게시글 데이터
     * @returns 생성된 게시글 정보
     */
    async createPost(post: PostRequest): Promise<PostResponse> {
      const payload = await serverApiFetchJson<ResponseDtoPostResponse>("/api/v1/posts", {
        method: "POST",
        body: JSON.stringify(post),
      });

      if (!payload.data) {
        throw new Error("Post response data is missing.");
      }

      return payload.data;
    },

    /**
     * 사용자가 작성한 게시글 목록을 조회합니다.
     *
     * @param params - 페이지네이션 파라미터
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 페이지네이션된 게시물 목록
     */
    async getUserPosts(
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponsePostListResponse> {
      const query = buildQueryString(params);
      const payload = await serverApiFetchJson<ResponseDtoPagedResponsePostListResponse>(
        `/api/v1/posts/me${query}`,
        options
      );

      if (!payload.data) {
        throw new Error("User posts response data is missing.");
      }

      return payload.data;
    },

    /**
     * 게시글을 삭제합니다.
     *
     * @param postId - 삭제할 게시글 ID
     */
    async deletePost(postId: number): Promise<void> {
      await serverApiFetchJson(`/api/v1/posts/${postId}`, {
        method: "DELETE",
      });
    },

    /**
     * 사용자가 좋아요한 게시글 목록을 조회합니다.
     *
     * @param params - 페이지네이션 파라미터
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 페이지네이션된 좋아요 목록
     */
    async getUserLikes(
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponseLikeResponse> {
      const query = buildQueryString(params);
      const payload = await serverApiFetchJson<ResponseDtoPagedResponseLikeResponse>(
        `/api/v1/likes/me${query}`,
        options
      );

      if (!payload.data) {
        throw new Error("User likes response data is missing.");
      }

      return payload.data;
    },

    /**
     * 게시글을 수정합니다.
     *
     * @param postId - 수정할 게시글 ID
     * @param postData - 수정할 게시글 데이터
     * @returns 수정된 게시글 정보
     */
    async updatePost(postId: number, postData: PostRequest): Promise<PostResponse> {
      const payload = await serverApiFetchJson<ResponseDtoPostResponse>(`/api/v1/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(postData),
      });

      if (!payload.data) {
        throw new Error("Post response data is missing.");
      }

      return payload.data;
    },

    /**
     * 게시글을 검색합니다.
     *
     * @param keyword - 검색 키워드
     * @param params - 페이지네이션 파라미터
     * @returns 페이지네이션된 검색 결과
     */
    async searchPosts(
      keyword: string,
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponsePostListResponse> {
      const searchParams = buildPageParams(params);
      searchParams.set("keyword", keyword);

      const query = searchParams.toString();
      const payload = await serverApiFetchJson<ResponseDtoPagedResponsePostListResponse>(
        `/api/v1/posts/search?${query}`,
        options
      );

      if (!payload.data) {
        throw new Error("Search response data is missing.");
      }

      return payload.data;
    },

    /**
     * 홈 피드 데이터를 조회합니다. (게시글 리스트, 인기 게시글, 태그를 한 번에)
     *
     * @param params - 홈 피드 파라미터 (페이지네이션, 정렬, 태그 필터)
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 홈 피드 데이터
     */
    async getHomeFeed(
      params?: {
        page?: number;
        size?: number;
        sort?: string[];
        tags?: string[];
      },
      options?: RequestInit
    ): Promise<HomeFeedResponse> {
      const searchParams = new URLSearchParams();

      if (typeof params?.page === "number") {
        searchParams.set("page", params.page.toString());
      }
      if (typeof params?.size === "number") {
        searchParams.set("size", params.size.toString());
      }
      if (params?.sort?.length) {
        params.sort.forEach((sortKey) => {
          searchParams.append("sort", sortKey);
        });
      }
      if (params?.tags?.length) {
        params.tags.forEach((tag) => {
          searchParams.append("tags", tag);
        });
      }

      const query = searchParams.toString();
      const payload = await serverApiFetchJson<ResponseDtoHomeFeedResponse>(
        `/api/v1/posts/feed${query ? `?${query}` : ""}`,
        options
      );

      if (!payload.data) {
        throw new Error("Home feed response data is missing.");
      }

      return payload.data;
    },

    /**
     * 사이드바 데이터를 조회합니다. (인기 게시글, 태그)
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 사이드바 데이터 (인기 게시글, 전체 태그)
     */
    async getSidebarData(
      options?: RequestInitWithNext
    ): Promise<{ weeklyPopular: PostPopularResponse[]; allTags: string[] }> {
      const popularOptions = mergeNextOptions(options, ["posts-popular"]);
      const tagsOptions = mergeNextOptions(options, ["tags"]);

      const [popularPayload, tagsPayload] = await Promise.all([
        serverApiFetchJson<ResponseDtoListPostPopularResponse>(
          "/api/v1/posts/popular",
          popularOptions
        ),
        serverApiFetchJson<ResponseDtoListString>("/api/v1/tags", tagsOptions),
      ]);

      if (!popularPayload.data || !tagsPayload.data) {
        throw new Error("Sidebar response data is missing.");
      }

      return {
        weeklyPopular: popularPayload.data,
        allTags: tagsPayload.data,
      };
    },
  };
};

/**
 * Post Service 타입
 */
export type PostService = ReturnType<typeof createPostService>;
