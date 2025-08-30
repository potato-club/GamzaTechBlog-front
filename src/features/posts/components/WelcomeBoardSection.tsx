"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm, CommentList } from "@/features/comments";
import { CommentResponse } from "@/generated/api";
import { useAuth } from "../../user/hooks/useUserQueries";
// Zustand import 제거됨 - import { useAuth } from "@/store/authStore";

// TODO: 가입인사 게시판을 위한 전용 postId를 백엔드에서 할당받아 사용해야 합니다.
const WELCOME_POST_ID = 1;

// Mock comments data
const mockComments: CommentResponse[] = [
  {
    commentId: 1,
    writer: "감자",
    writerProfileImageUrl: "/profileSVG.svg",
    content: "안녕하세요! 잘 부탁드립니다.",
    createdAt: new Date("2025-08-24T11:42:12.733Z"),
    replies: [],
  },
  {
    commentId: 2,
    writer: "고구마",
    writerProfileImageUrl: "/profileSVG.svg",
    content: "반갑습니다~",
    createdAt: new Date("2025-08-24T11:43:12.733Z"),
    replies: [],
  },
];

export default function WelcomeBoardSection() {
  const { userProfile } = useAuth();

  const comments = mockComments;
  const isLoading = false;
  const isError = false;

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-4 h-8 w-1/4" />
        <Skeleton className="mb-4 h-24 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>가입인사 게시판을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-4 text-2xl font-bold">가입인사</h2>
      <p className="mb-6 text-gray-600">
        감자 기술 블로그에 오신 것을 환영합니다! 간단한 가입인사를 남겨주세요.
      </p>
      <CommentForm postId={WELCOME_POST_ID} userProfile={userProfile} />
      <CommentList comments={comments} postId={WELCOME_POST_ID} />
    </div>
  );
}
