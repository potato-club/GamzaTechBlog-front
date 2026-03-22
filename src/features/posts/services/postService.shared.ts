import type {
  DefaultApi,
  HomeFeedResponse,
  Pageable,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
  ResponseDtoPagedResponsePostListResponse,
} from "@/generated/api";
import { apiFetch } from "@/lib/apiFetch";

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
 * Post Service 팩토리 함수
 *
 * 클라이언트/서버 환경 모두에서 사용 가능한 공통 로직을 제공합니다.
 * API 클라이언트 인스턴스를 주입받아 환경에 독립적으로 동작합니다.
 *
 * @param api - DefaultApi 인스턴스 (클라이언트용 또는 서버용)
 * @returns Post Service 객체
 *
 * @example
 * const postService = createPostService(createBackendApiClient());
 */
export const createPostService = (api: DefaultApi) => {
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
      const response = await api.getPosts({ ...params }, mergedOptions);
      return response.data as PagedResponsePostListResponse;
    },

    /**
     * 주간 인기 게시물 목록을 조회합니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 인기 게시물 배열
     */
    async getPopularPosts(options?: RequestInitWithNext): Promise<PostPopularResponse[]> {
      const mergedOptions = mergeNextOptions(options, ["posts-popular"]);
      const response = await api.getWeeklyPopularPosts(mergedOptions);
      return response.data as PostPopularResponse[];
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
      const response = await api.getPostsByTag({ tagName, ...params }, mergedOptions);
      return response.data as PagedResponsePostListResponse;
    },

    /**
     * 태그 목록을 조회합니다.
     *
     * @param options - fetch 옵션 (캐싱, revalidate 등)
     * @returns 태그 이름 배열
     */
    async getTags(options?: RequestInitWithNext): Promise<string[]> {
      const mergedOptions = mergeNextOptions(options, ["tags"]);
      const response = await api.getAllTags(mergedOptions);
      return response.data as string[];
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
      const response = await api.getPostDetail({ postId }, mergedOptions);
      return response.data as PostDetailResponse;
    },

    /**
     * 새 게시글을 생성합니다.
     *
     * @param post - 게시글 데이터
     * @returns 생성된 게시글 정보
     */
    async createPost(post: PostRequest): Promise<PostResponse> {
      const response = await api.publishPost({ postRequest: post });
      return response.data as PostResponse;
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
      const response = await api.getMyPosts(params, options);
      return response.data as PagedResponsePostListResponse;
    },

    /**
     * 게시글을 삭제합니다.
     *
     * @param postId - 삭제할 게시글 ID
     */
    async deletePost(postId: number): Promise<void> {
      await api.removePost({ id: postId });
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
      const response = await api.getMyLikes(params, options);
      return response.data as PagedResponseLikeResponse;
    },

    /**
     * 게시글을 수정합니다.
     *
     * @param postId - 수정할 게시글 ID
     * @param postData - 수정할 게시글 데이터
     * @returns 수정된 게시글 정보
     */
    async updatePost(postId: number, postData: PostRequest): Promise<PostResponse> {
      const response = await api.revisePost({ id: postId, postRequest: postData });
      return response.data as PostResponse;
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
      const searchParams = new URLSearchParams({ keyword });
      if (typeof params.page === "number") {
        searchParams.set("page", params.page.toString());
      }
      if (typeof params.size === "number") {
        searchParams.set("size", params.size.toString());
      }
      if (params.sort?.length) {
        params.sort.forEach((sortKey) => {
          searchParams.append("sort", sortKey);
        });
      }

      const response = await apiFetch(`/api/v1/posts/search?${searchParams.toString()}`, {
        ...options,
        mode: "direct-public",
      });

      if (!response.ok) {
        throw new Error(`Failed to search posts (status ${response.status}).`);
      }

      const payload = (await response.json()) as ResponseDtoPagedResponsePostListResponse | null;
      if (!payload?.data) {
        throw new Error("Search response data is missing.");
      }

      return payload.data as PagedResponsePostListResponse;
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
      const response = await api.getHomeFeed(params || {}, options);
      return response.data as HomeFeedResponse;
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
      const [popularPosts, tags] = await Promise.all([
        api.getWeeklyPopularPosts(popularOptions).then((res) => res.data as PostPopularResponse[]),
        api.getAllTags(tagsOptions).then((res) => res.data as string[]),
      ]);

      return {
        weeklyPopular: popularPosts,
        allTags: tags,
      };
    },
  };
};

/**
 * Post Service 타입
 */
export type PostService = ReturnType<typeof createPostService>;
