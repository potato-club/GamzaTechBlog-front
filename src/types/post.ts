export interface PostData {
  postId: number;
  title: string;
  contentSnippet: string;
  writer: string;
  createdAt: string;
  tags: string[];
}

export interface PopularPostData {
  postId: number;
  title: string;
  writer: string;
  writerProfileImageUrl?: string; // 작성자의 프로필 이미지 URL
}

export interface LikedPostData extends PostData {
  likeId: number;
}

// 게시글 생성을 위한 API 요청 본문 인터페이스
export interface CreatePostRequest {
  title: string;
  content: string; // 전체 내용
  tags?: string[];
  commitMessage?: string;
}

// 게시글 수정을 위한 API 요청 본문 인터페이스
export interface UpdatePostRequest {
  title: string;
  content: string;
  tags?: string[];
  commitMessage?: string;
}

export interface CreatePostResponse {
  postId: number;
  authorGithubId: string;
  repositoryName: string;
  title: string;
  content: string;
  tags: string[];
  commitMessage: string;
  createdAt: string;
  updatedAt: string;
}
