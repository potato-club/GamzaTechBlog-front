import { PostDetailResponse, PostListResponse, PostResponse } from "@/generated/api/models";

// 컴포넌트 Props 타입
export interface PostCardProps {
  post: PostListResponse;
  onLike?: (postId: string) => void;
  variant?: "default" | "compact";
  className?: string;
}

export interface PostViewProps {
  post: PostDetailResponse;
  className?: string;
}

export interface PostListProps {
  posts: PostListResponse[];
  loading?: boolean;
  className?: string;
}

export interface PostFormProps {
  initialData?: Partial<PostResponse>;
  onSubmit: (data: PostFormData) => void;
  isSubmitting?: boolean;
  className?: string;
}

// 로컬 상태 타입
export interface PostFormState {
  title: string;
  content: string;
  tags: string[];
  isSubmitting: boolean;
}

export interface PostFormData {
  title: string;
  content: string;
  tags: string[];
  commitMessage?: string;
}

// UI 관련 타입
export type PostCardVariant = "default" | "compact" | "featured";

export interface PostMetaProps {
  authorName: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  className?: string;
}
