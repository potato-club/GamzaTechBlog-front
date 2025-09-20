/**
 * 마이페이지와 공개 프로필의 서로 다른 API 구조를 통일된 인터페이스로 제공하는 훅
 */

import {
  Pageable,
  PagedResponseCommentListResponse,
  PagedResponseLikeResponse,
  PagedResponsePostListResponse,
  UserActivityResponse,
  UserMiniProfileResponse,
  UserProfileResponse,
} from "@/generated/api";
import { useMyComments, useMyLikes, useMyPosts } from "./useMyPageQueries";
import { usePublicProfile } from "./useUserQueries";

// 통일된 프로필 데이터 인터페이스
export interface UnifiedProfileData {
  posts: {
    data?: PagedResponsePostListResponse;
    isLoading: boolean;
    error: Error | null;
  };
  comments?: {
    data?: PagedResponseCommentListResponse;
    isLoading: boolean;
    error: Error | null;
  };
  likes?: {
    data?: PagedResponseLikeResponse;
    isLoading: boolean;
    error: Error | null;
  };
  profile?: {
    data?: UserProfileResponse | UserMiniProfileResponse;
    isLoading: boolean;
    error: Error | null;
  };
  activity?: {
    data?: UserActivityResponse;
    isLoading: boolean;
    error: Error | null;
  };
}

/**
 * 마이페이지와 공개 프로필 데이터를 통일된 형태로 제공하는 훅
 */
export function useProfileData(
  isOwner: boolean,
  username?: string,
  postsParams?: Pageable
): UnifiedProfileData {
  // 마이페이지용 개별 API 호출
  const myPostsQuery = useMyPosts(postsParams, { enabled: isOwner });
  const myCommentsQuery = useMyComments(postsParams, { enabled: isOwner });
  const myLikesQuery = useMyLikes(postsParams, { enabled: isOwner });

  console.log("wowowowowow", postsParams);

  // 공개 프로필용 통합 API 호출
  const publicProfileQuery = usePublicProfile(username || "", postsParams, {
    enabled: !isOwner && !!username,
  });

  if (isOwner) {
    // 마이페이지: 개별 API 결과 반환
    return {
      posts: {
        data: myPostsQuery.data,
        isLoading: myPostsQuery.isLoading,
        error: myPostsQuery.error,
      },
      comments: {
        data: myCommentsQuery.data,
        isLoading: myCommentsQuery.isLoading,
        error: myCommentsQuery.error,
      },
      likes: {
        data: myLikesQuery.data,
        isLoading: myLikesQuery.isLoading,
        error: myLikesQuery.error,
      },
      // profile: {
      //   data: null, // 마이페이지에서는 별도 관리
      //   isLoading: false,
      //   error: null,
      // },
      // activity: {
      //   data: null, // 마이페이지에서는 별도 관리
      //   isLoading: false,
      //   error: null,
      // },
    };
  } else {
    // 공개 프로필: 통합 API 결과를 분해하여 반환
    return {
      posts: {
        data: publicProfileQuery.data?.posts,
        isLoading: publicProfileQuery.isLoading,
        error: publicProfileQuery.error,
      },
      // comments: {
      //   data: null, // 공개 프로필에서는 댓글 제공 안함
      //   isLoading: false,
      //   error: null,
      // },
      // likes: {
      //   data: null, // 공개 프로필에서는 좋아요 제공 안함
      //   isLoading: false,
      //   error: null,
      // },
      profile: {
        data: publicProfileQuery.data?.profile,
        isLoading: publicProfileQuery.isLoading,
        error: publicProfileQuery.error,
      },
      activity: {
        data: publicProfileQuery.data?.activity,
        isLoading: publicProfileQuery.isLoading,
        error: publicProfileQuery.error,
      },
    };
  }
}
