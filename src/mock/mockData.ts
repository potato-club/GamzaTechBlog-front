/**
 * 개발용 더미 데이터
 * 
 * 백엔드 서버 없이 UI 개발을 위한 목 데이터입니다.
 * 환경 변수 NEXT_PUBLIC_USE_MOCK_DATA=true로 활성화됩니다.
 */

import { MyCommentData } from "@/types/comment";
import { MyPageData } from "@/types/mypage";
import { PostData } from "@/types/post";
import { UserProfileData } from "@/types/user";

// 더미 사용자 프로필
export const mockUserProfile: UserProfileData = {
  nickname: "개발자김개발",
  email: "developer@example.com",
  profileImageUrl: "/profileEX.png",
  role: "USER",
  githubId: "developer-kim",
  name: "김개발",
  studentNumber: "20240001",
  gamjaBatch: 1,
  position: "FRONTEND",
  createdAt: "2024-01-15T09:00:00Z",
  updatedAt: "2024-07-15T10:30:00Z"
};

// 더미 게시글 데이터 (PostData 타입에 맞게 수정)
export const mockPosts: PostData[] = [
  {
    postId: 1,
    title: "React 18의 새로운 기능들과 실무 적용 가이드",
    contentSnippet: "React 18에서 도입된 주요 기능들을 살펴보고, 실무에서 어떻게 활용할 수 있는지 알아보겠습니다. Automatic Batching, Concurrent Features 등의 새로운 기능들을 소개합니다.",
    writer: "개발자김개발",
    createdAt: "2024-07-15T10:30:00Z",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    postId: 2,
    title: "Next.js 13 App Router 마이그레이션 경험기",
    contentSnippet: "기존 Pages Router에서 App Router로 마이그레이션하면서 겪은 경험을 공유합니다. 폴더 구조 변경, 레이아웃 시스템, 서버 컴포넌트 등의 주요 변경사항을 다룹니다.",
    writer: "개발자김개발",
    createdAt: "2024-07-10T14:20:00Z",
    tags: ["Next.js", "React", "Migration"]
  },
  {
    postId: 3,
    title: "TypeScript 고급 타입 활용법",
    contentSnippet: "TypeScript의 고급 타입 기능들을 활용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 알아봅시다. Utility Types, Conditional Types 등을 다룹니다.",
    writer: "개발자김개발",
    createdAt: "2024-07-05T09:15:00Z",
    tags: ["TypeScript", "Frontend", "개발팁"]
  },
  {
    postId: 4,
    title: "Spring Boot와 JPA 성능 최적화 가이드",
    contentSnippet: "Spring Boot 애플리케이션에서 JPA를 사용할 때 성능을 최적화하는 방법들을 정리했습니다. N+1 문제 해결, 쿼리 최적화 등을 다룹니다.",
    writer: "개발자김개발",
    createdAt: "2024-06-30T16:45:00Z",
    tags: ["Spring Boot", "JPA", "Backend", "성능최적화"]
  },
  {
    postId: 5,
    title: "Docker와 Kubernetes 실무 적용기",
    contentSnippet: "컨테이너 기반 개발 환경 구축부터 운영까지의 경험을 공유합니다. Docker Compose를 활용한 로컬 개발 환경과 Kubernetes 배포 전략을 다룹니다.",
    writer: "개발자김개발",
    createdAt: "2024-06-25T11:20:00Z",
    tags: ["Docker", "Kubernetes", "DevOps", "인프라"]
  }
];

// 더미 댓글 데이터 (마이페이지용 - MyCommentData)
export const mockMyComments: MyCommentData[] = [
  {
    commentId: 1,
    content: "React 18의 Automatic Batching 정말 유용하네요! 실제 프로젝트에 적용해봐야겠습니다.",
    createdAt: "2024-07-15T11:00:00Z",
    postId: 1,
    postTitle: "React 18의 새로운 기능들과 실무 적용 가이드"
  },
  {
    commentId: 2,
    content: "App Router 마이그레이션 정보 감사합니다. 저희 팀도 마이그레이션 계획 중인데 많은 도움이 될 것 같아요.",
    createdAt: "2024-07-10T15:30:00Z",
    postId: 2,
    postTitle: "Next.js 13 App Router 마이그레이션 경험기"
  },
  {
    commentId: 3,
    content: "Conditional Types 예제가 정말 이해하기 쉽게 설명되어 있네요. 고급 타입 공부하는데 큰 도움이 됩니다!",
    createdAt: "2024-07-05T10:45:00Z",
    postId: 3,
    postTitle: "TypeScript 고급 타입 활용법"
  },
  {
    commentId: 4,
    content: "startTransition을 사용한 예제도 추가해주시면 좋을 것 같아요.",
    createdAt: "2024-07-15T12:20:00Z",
    postId: 1,
    postTitle: "React 18의 새로운 기능들과 실무 적용 가이드"
  },
  {
    commentId: 5,
    content: "레이아웃 시스템 부분에서 헤맸는데, 이 글 보고 해결했습니다. 감사합니다!",
    createdAt: "2024-07-11T09:15:00Z",
    postId: 2,
    postTitle: "Next.js 13 App Router 마이그레이션 경험기"
  },
  {
    commentId: 6,
    content: "JPA N+1 문제 해결 방법이 정말 도움이 되었습니다. 쿼리 최적화 부분도 실무에 바로 적용해봤어요.",
    createdAt: "2024-07-01T14:30:00Z",
    postId: 4,
    postTitle: "Spring Boot와 JPA 성능 최적화 가이드"
  },
  {
    commentId: 7,
    content: "Docker Compose 설정 예제가 매우 유용했습니다. 로컬 개발 환경 구축하는데 큰 도움이 되었어요.",
    createdAt: "2024-06-26T09:40:00Z",
    postId: 5,
    postTitle: "Docker와 Kubernetes 실무 적용기"
  }
];

// 더미 댓글 데이터 (게시글용 - CommentData/PostCommentData)
export const mockComments: MyCommentData[] = [
  {
    commentId: 1,
    content: "정말 유익한 글이네요! 많은 도움이 되었습니다.",
    createdAt: "2024-07-15T11:00:00Z",
    postId: 1,
    postTitle: "React 18의 새로운 기능들과 실무 적용 가이드"
  },
  {
    commentId: 2,
    content: "실무에서 바로 적용해볼 수 있는 내용들이라 좋네요. 감사합니다!",
    createdAt: "2024-07-15T12:30:00Z",
    postId: 1,
    postTitle: "React 18의 새로운 기능들과 실무 적용 가이드"
  },
  {
    commentId: 3,
    content: "다음 글도 기대하겠습니다.",
    createdAt: "2024-07-15T14:15:00Z",
    postId: 2,
    postTitle: "Next.js 13 App Router 마이그레이션 경험기"
  }
];

// 더미 좋아요한 게시글 데이터 (Like 타입용 - MyPageData용)
export const mockMyPageLikes = [
  {
    id: 1,
    title: "Vue.js 3 Composition API 완전 정복",
    contentSnippet: "Vue.js 3의 Composition API를 활용하여 더 효율적인 컴포넌트를 작성하는 방법을 알아봅시다.",
    writer: "프론트엔드개발자",
    createdAt: "2024-07-12T13:20:00Z",
    tags: ["Vue.js", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    title: "Node.js 성능 모니터링과 최적화",
    contentSnippet: "Node.js 애플리케이션의 성능을 모니터링하고 최적화하는 다양한 방법들을 소개합니다.",
    writer: "백엔드개발자",
    createdAt: "2024-07-08T10:15:00Z",
    tags: ["Node.js", "Backend", "성능최적화"]
  }
];

// 더미 좋아요한 게시글 데이터 (LikedPostData 타입용 - API 응답용)
export const mockLikes = [
  {
    likeId: 1,
    postId: 101,
    title: "Vue.js 3 Composition API 완전 정복",
    contentSnippet: "Vue.js 3의 Composition API를 활용하여 더 효율적인 컴포넌트를 작성하는 방법을 알아봅시다.",
    writer: "프론트엔드개발자",
    createdAt: "2024-07-12T13:20:00Z",
    tags: ["Vue.js", "JavaScript", "Frontend"]
  },
  {
    likeId: 2,
    postId: 102,
    title: "Node.js 성능 모니터링과 최적화",
    contentSnippet: "Node.js 애플리케이션의 성능을 모니터링하고 최적화하는 다양한 방법들을 소개합니다.",
    writer: "백엔드개발자",
    createdAt: "2024-07-08T10:15:00Z",
    tags: ["Node.js", "Backend", "성능최적화"]
  }
];

// 더미 마이페이지 데이터 (MyPageData 타입에 맞게 수정)
export const mockMyPageData: MyPageData = {
  posts: mockPosts,
  comments: mockComments,
  likes: mockMyPageLikes
};

// Mock 데이터 사용 여부 확인 함수
export const shouldUseMockData = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
};

// Mock API 응답 시뮬레이션 (로딩 시간 포함)
export const createMockApiResponse = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
