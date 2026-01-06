// Hooks
export {
  POST_QUERY_KEYS,
  useAddLike,
  useCreatePost,
  useDeletePost,
  // Image hooks
  useImageUpload,
  // Like hooks
  useLikeStatus,
  usePopularPosts,
  usePost,
  usePosts,
  usePostsByTag,
  usePrefetchPosts,
  useRemoveLike,
  useSearchPosts,
  useTags,
  useUpdatePost,
} from "./hooks";

// Server Actions (app/actions에서 import)
export { createPostAction, deletePostAction, updatePostAction } from "@/app/actions/postActions";

// Action Types
export type {
  ActionResult,
  CreatePostInput,
  DeletePostInput,
  UpdatePostInput,
} from "./actions/types";

// Components
export {
  InteractivePostList,
  MainContent,
  // ⚠️ MarkdownViewer, ToastEditor는 무거워서 여기서 export하지 않습니다
  // 이유: 번들 크기 최적화 (각각 200-300KB)
  // 사용 방법:
  //   import { DynamicMarkdownViewer } from "@/components/dynamic/DynamicComponents";
  //   import { DynamicToastEditor } from "@/components/dynamic/DynamicComponents";
  PopularPost,
  PopularPostList,
  PopularPostListSkeleton,
  PopularPostsSection,
  PostCard,
  PostCommentsSection,
  PostDetailSkeleton,
  PostForm,
  PostFormActions,
  PostHeader,
  PostList,
  PostListSection,
  PostListSkeleton,
  PostMeta,
  PostStats,
  PostTagManager,
  PostTitleInput,
  WelcomeBoardSection,
} from "./components";

// Services
export { likeService } from "./services/likeService";
export { createLikeServiceServer } from "./services/likeService.server";
export { postService } from "./services/postService";
export type { LikedPostResponse } from "./services/postService";
export { createPostServiceServer } from "./services/postService.server";

// Types
export type {
  PostCardProps,
  PostCardVariant,
  PostFormData,
  PostFormProps,
  PostFormState,
  PostListProps,
  PostMetaProps,
  PostViewProps,
} from "./types";
