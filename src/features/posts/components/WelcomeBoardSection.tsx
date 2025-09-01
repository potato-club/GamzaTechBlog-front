"use client";

import { Skeleton } from "@/components/ui/skeleton";
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

  // return (
  //   <div className="container mx-auto py-8">
  //     <h2 className="mb-4 text-2xl font-bold">가입인사</h2>
  //     <p className="mb-6 text-gray-600">
  //       감자 기술 블로그에 오신 것을 환영합니다! 간단한 가입인사를 남겨주세요.
  //     </p>
  //     <CommentForm postId={WELCOME_POST_ID} userProfile={userProfile} />
  //     <CommentList comments={comments} postId={WELCOME_POST_ID} />
  //   </div>
  // );

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        {/* 아이콘 */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2F4F6]">
          <svg
            className="h-10 w-10 text-[#798191]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        {/* 메인 텍스트 */}
        <h1 className="mb-3 text-[28px] font-bold text-[#1C222E]">텃밭인사 준비 중</h1>

        {/* 서브 텍스트 */}
        <p className="mb-6 text-[16px] text-[#798191]">
          감자 기술 블로그의 새로운 기능을 준비하고 있습니다.
          <br />곧 만나뵐 수 있도록 열심히 개발 중이에요! 🌱
        </p>
      </div>
    </div>
  );
}
