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
} from "@/generated/api";
import { backendFetch, createBackendApiClient } from "@/lib/serverApiClient";
import { unwrapData } from "@/lib/unwrapData";

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

/**
 * 서버 컴포넌트용 Post Service 팩토리
 *
 * - 각 요청마다 새로운 API 클라이언트 생성 (요청별 쿠키 컨텍스트)
 * - ISR/SSG와 호환
 * - 서버 환경에서만 동작
 */
export const createPostServiceServer = () => {
  const api = createBackendApiClient();
  const basePath = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const fetchFn = backendFetch as typeof fetch;

  return {
    async getPosts(
      params: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponsePostListResponse> {
      const mergedOptions = mergeNextOptions(options, ["posts-list"]);
      const response = await api.getPosts({ ...params }, mergedOptions);
      return unwrapData(response);
    },

    async getPopularPosts(options?: RequestInitWithNext): Promise<PostPopularResponse[]> {
      const mergedOptions = mergeNextOptions(options, ["posts-popular"]);
      const response = await api.getWeeklyPopularPosts(mergedOptions);
      return unwrapData(response);
    },

    async getPostsByTag(
      tagName: string,
      params: Pageable,
      options?: RequestInitWithNext
    ): Promise<PagedResponsePostListResponse> {
      const mergedOptions = mergeNextOptions(options, ["posts-list"]);
      const response = await api.getPostsByTag({ tagName, ...params }, mergedOptions);
      return unwrapData(response);
    },

    async getTags(options?: RequestInitWithNext): Promise<string[]> {
      const mergedOptions = mergeNextOptions(options, ["tags"]);
      const response = await api.getAllTags(mergedOptions);
      return unwrapData(response);
    },

    async getPostById(postId: number, options?: RequestInitWithNext): Promise<PostDetailResponse> {
      const mergedOptions = mergeNextOptions(options, [`post-${postId}`]);
      const response = await api.getPostDetail({ postId }, mergedOptions);
      return unwrapData(response);
    },

    async createPost(post: PostRequest): Promise<PostResponse> {
      const response = await api.publishPost({ postRequest: post });
      return unwrapData(response);
    },

    async getUserPosts(
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponsePostListResponse> {
      const response = await api.getMyPosts(params, options);
      return unwrapData(response);
    },

    async deletePost(postId: number): Promise<void> {
      await api.removePost({ id: postId });
    },

    async getUserLikes(
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponseLikeResponse> {
      const response = await api.getMyLikes(params, options);
      return unwrapData(response);
    },

    async updatePost(postId: number, postData: PostRequest): Promise<PostResponse> {
      const response = await api.revisePost({ id: postId, postRequest: postData });
      return unwrapData(response);
    },

    async searchPosts(
      keyword: string,
      params: Pageable,
      options?: RequestInit
    ): Promise<PagedResponsePostListResponse> {
      // api.searchPosts()는 pageable을 중첩 객체로 직렬화하여 pageable[page]=0 형태로 전송합니다.
      // Spring Boot의 Pageable 리졸버는 flat params(page=0)를 기대하므로 직접 flat params를 구성합니다.
      const searchParams = new URLSearchParams({ keyword });
      if (params.page != null) searchParams.set("page", String(params.page));
      if (params.size != null) searchParams.set("size", String(params.size));
      params.sort?.forEach((s) => searchParams.append("sort", s));

      const response = await fetchFn(`${basePath}/api/v1/posts/search?${searchParams}`, options);

      if (!response.ok) {
        throw new Error(`Search failed (status ${response.status}).`);
      }

      const json = (await response.json()) as { data?: PagedResponsePostListResponse | null };
      return unwrapData(json);
    },

    async getHomeFeed(
      params?: {
        page?: number;
        size?: number;
        sort?: string[];
        tags?: string[];
      },
      options?: RequestInit
    ): Promise<HomeFeedResponse> {
      const response = await api.getHomeFeed(params || {}, options);
      return unwrapData(response);
    },

    async getSidebarData(
      options?: RequestInitWithNext
    ): Promise<{ weeklyPopular: PostPopularResponse[]; allTags: string[] }> {
      const popularOptions = mergeNextOptions(options, ["posts-popular"]);
      const tagsOptions = mergeNextOptions(options, ["tags"]);
      const [popularPosts, tags] = await Promise.all([
        api.getWeeklyPopularPosts(popularOptions).then(unwrapData),
        api.getAllTags(tagsOptions).then(unwrapData),
      ]);

      return {
        weeklyPopular: popularPosts,
        allTags: tags,
      };
    },
  };
};

export type PostService = ReturnType<typeof createPostServiceServer>;
