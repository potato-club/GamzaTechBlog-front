// Hooks
export {
  useCreatePost,
  useDeletePost,
  // Image hooks
  useImageUpload,
  useUpdatePost,
} from "./hooks";

// Server Actions
export { createPostAction, deletePostAction, updatePostAction } from "./actions/postActions";

// Action Types
export type {
  ActionResult,
  CreatePostInput,
  DeletePostInput,
  UpdatePostInput,
} from "./actions/types";

// Components (Client-safe only)
export {
  MainContent,
  // ⚠️ MarkdownViewer, ToastEditor는 무거워서 여기서 export하지 않습니다
  // 이유: 번들 크기 최적화 (각각 200-300KB)
  // 사용 방법:
  //   import { DynamicMarkdownViewer } from "@/components/dynamic/DynamicComponents";
  //   import { DynamicToastEditor } from "@/components/dynamic/DynamicComponents";
  PopularPost,
  PopularPostListSkeleton,
  PostCard,
  PostCommentsSection,
  PostDetailSkeleton,
  PostForm,
  PostFormActions,
  PostHeader,
  PostList,
  PostListSkeleton,
  PostMeta,
  PostStats,
  PostTagManager,
  PostTitleInput,
  WelcomeBoardSection,
} from "./components";

// ⚠️ Server Services는 barrel export에서 제외합니다.
// 직접 import하세요: import { createPostServiceServer } from "@/features/posts/services/postService.server";

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
