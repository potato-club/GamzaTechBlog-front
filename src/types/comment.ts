export interface CommentReply {
  // Swagger 예시에서는 replies가 string 배열이지만,
  // 만약 대댓글도 ID, 작성자 등을 가진다면 객체로 정의해야 합니다.
  // 여기서는 Swagger 예시대로 string으로 가정합니다.
  // replyId: number;
  // writer: string;
  // content: string;
  // createdAt: string;
}

export interface CommentData {
  commentId: number;
  writer: string;
  content: string;
  createdAt: string;
  replies: string[]; // Swagger 예시에서는 string 배열
}

export interface CommentListProps {
  comments: CommentData[];
}

export interface PostDetailData {
  postId: number;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  comments: CommentData[];
}


export interface CommentRequest {
  content: string;
  parentCommentId?: number; // 대댓글의 경우 부모 댓글 ID
}