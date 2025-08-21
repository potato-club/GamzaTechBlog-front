import {
  Pageable,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  PostDetailResponse,
  PostPopularResponse,
  PostRequest,
  PostResponse,
} from "@/generated/api";
import { apiClient } from "@/lib/apiClient";

// `PostResponse`에 `likeId`를 추가한 타입
export type LikedPostResponse = PostResponse & { likeId: number };

export const postService = {
  /**
   * 최신순 게시물 목록을 조회합니다.
   */
  async getPosts(params: Pageable, options?: RequestInit): Promise<PagedResponsePostListResponse> {
    const response = await apiClient.getPosts({ ...params }, options);
    return response.data as PagedResponsePostListResponse;
  },

  /**
   * 주간 인기 게시물 목록을 조회합니다.
   */
  async getPopularPosts(options?: RequestInit): Promise<PostPopularResponse[]> {
    const response = await apiClient.getWeeklyPopularPosts(options);
    return response.data as PostPopularResponse[];
  },

  /**
   * 태그별 게시물 목록을 조회합니다.
   */
  async getPostsByTag(
    tagName: string,
    params: Pageable,
    options?: RequestInit
  ): Promise<PagedResponsePostListResponse> {
    const response = await apiClient.getPostsByTag({ tagName, ...params }, options);
    return response.data as PagedResponsePostListResponse;
  },

  /**
   * 태그 목록을 조회합니다.
   */
  async getTags(options?: RequestInit): Promise<string[]> {
    const response = await apiClient.getAllTags(options);
    return response.data as string[];
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   */
  async getPostById(postId: number, options?: RequestInit): Promise<PostDetailResponse> {
    const response = await apiClient.getPostDetail({ postId }, options);
    return response.data as PostDetailResponse;
  },

  /**
   * 새 게시글을 생성합니다.
   */
  async createPost(post: PostRequest): Promise<PostResponse> {
    const response = await apiClient.publishPost({ postRequest: post });
    return response.data as PostResponse;
  },

  /**
   * 사용자가 작성한 게시글 목록을 조회합니다.
   */
  async getUserPosts(params: Pageable): Promise<PagedResponsePostListResponse> {
    const response = await apiClient.getMyPosts(params);
    return response.data as PagedResponsePostListResponse;
  },

  /**
   * 게시글을 삭제합니다.
   */
  async deletePost(postId: number): Promise<void> {
    await apiClient.removePost({ id: postId });
  },

  /**
   * 사용자가 좋아요한 게시글 목록을 조회합니다.
   */
  async getUserLikes(params: Pageable): Promise<PagedResponseLikeResponse> {
    const response = await apiClient.getMyLikes(params);
    return response.data as PagedResponseLikeResponse;
  },

  /**
   * 게시글을 수정합니다.
   */
  async updatePost(postId: number, postData: PostRequest): Promise<PostResponse> {
    const response = await apiClient.revisePost({ id: postId, postRequest: postData });
    return response.data as PostResponse;
  },

  /**
   * 게시글을 검색합니다.
   */
  async searchPosts(keyword: string, params: Pageable): Promise<PagedResponsePostListResponse> {
    const response = await apiClient.searchPosts({ keyword, pageable: params });
    return response.data as PagedResponsePostListResponse;
  },
} as const;
