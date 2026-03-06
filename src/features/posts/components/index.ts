// Main Components (Client-safe)
export { EditPostForm } from "./EditPostForm";
export { default as PostCard } from "./PostCard";
export { default as PostForm } from "./PostForm";
export { default as PostFormActions } from "./PostFormActions";
export { default as PostHeader } from "./PostHeader";
export { default as PostList } from "./PostList";
export { default as PostMeta } from "./PostMeta";
export { default as PostStats } from "./PostStats";
export { default as PostTagManager } from "./PostTagManager";
export { default as PostTitleInput } from "./PostTitleInput";

// Popular Posts (Client-safe)
export { default as PopularPost } from "./PopularPost";

// Comments & Actions
export { default as PostCommentsSection } from "./PostCommentsSection";

// ⚠️ Editor & Viewer는 무거워서 여기서 export하지 않습니다 (각각 200-300KB)
// 사용: import { DynamicMarkdownViewer } from "@/components/dynamic/DynamicComponents";
// export { default as MarkdownViewer } from "./MarkdownViewer";
// export { default as ToastEditor } from "./ToastEditor";

// Skeletons
// export { default as MarkdownViewerSkeleton } from "./skeletons/MarkdownViewerSkeleton";
export { default as PopularPostListSkeleton } from "./skeletons/PopularPostListSkeleton";
export { default as PostDetailSkeleton } from "./skeletons/PostDetailSkeleton";
export { default as PostListSkeleton } from "./skeletons/PostListSkeleton";
// export { default as ToastEditorSkeleton } from "./skeletons/ToastEditorSkeleton";

export { default as MainContent } from "./MainContent";
export { default as WelcomeBoardSection } from "./WelcomeBoardSection";

// ⚠️ Server Components는 barrel export에서 제외합니다.
// 직접 import하세요:
// import PopularPostsSection from "@/features/posts/components/PopularPostsSection.server";
// import PostListSection from "@/features/posts/components/PostListSection.server";
