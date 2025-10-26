// 읽기 전용 쿼리 훅
export {
  POST_QUERY_KEYS,
  usePopularPosts,
  usePost,
  usePosts,
  usePostsByTag,
  usePrefetchPosts,
  useSearchPosts,
  useTags,
} from "./usePostQueries";

// 변경 작업 훅 (Server Actions 기반)
export { useCreatePost, useDeletePost, useUpdatePost } from "./usePostMutations";

// 이미지 업로드 훅
export * from "./useImageQueries";

// 좋아요 읽기 훅
export { LIKE_QUERY_KEYS, useLikeStatus } from "./useLikeQueries";

// 좋아요 변경 훅
export { useAddLike, useRemoveLike } from "./useLikeMutations";
