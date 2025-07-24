export interface CommentReply {
  // Swagger 예시에서는 replies가 string 배열이지만,
  // 만약 대댓글도 ID, 작성자 등을 가진다면 객체로 정의해야 합니다.
  // 여기서는 Swagger 예시대로 string으로 가정합니다.
  // replyId: number;
  // writer: string;
  // content: string;
  // createdAt: string;
}

// 공통 베이스 인터페이스
export interface BaseCommentData {
  commentId: number;
  content: string;
  createdAt: string;
}

// 게시글 댓글 (기존)
export interface PostCommentData extends BaseCommentData {
  writer: string;
  writerProfileImageUrl: string;
  replies: string[]; // Swagger 예시에서는 string 배열
}

// 내 댓글 (확장)
export interface MyCommentData extends BaseCommentData {
  postId: number;
  postTitle: string;
}

// 기존 CommentData를 PostCommentData로 별칭 (하위 호환성)
export type CommentData = PostCommentData;

// 통합 댓글 리스트 Props
export interface CommentListProps {
  comments: (PostCommentData | MyCommentData)[];
  variant: 'post' | 'my';
}

// 기존 Props들 (하위 호환성)
export interface PostCommentListProps {
  comments: PostCommentData[];
}

export interface MyCommentListProps {
  comments: MyCommentData[];
}

export interface PostDetailData {
  postId: number;
  title: string;
  content: string;
  writer: string;
  writerProfileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  comments: CommentData[];
}

export interface CommentRequest {
  content: string;
  parentCommentId?: number; // 대댓글의 경우 부모 댓글 ID
}

// 타입 가드 함수들
export const isPostComment = (comment: BaseCommentData): comment is PostCommentData => {
  return 'writer' in comment && 'replies' in comment;
};

export const isMyComment = (comment: BaseCommentData): comment is MyCommentData => {
  return 'postId' in comment && 'postTitle' in comment;
};