"use client";

/**
 * 동적 로딩 컴포넌트들
 *
 * 무거운 라이브러리를 사용하는 컴포넌트들을 동적으로 로딩하여
 * 초기 번들 크기를 줄이고 성능을 개선합니다.
 */

import dynamic from "next/dynamic";
import MarkdownViewerSkeleton from "../skeletons/MarkdownViewerSkeleton";
import ToastEditorSkeleton from "../skeletons/ToastEditorSkeleton";
import CommentsSkeleton from "../skeletons/CommentsSkeleton";
import ProfileEditDialogSkeleton from "../skeletons/ProfileEditDialogSkeleton";

/**
 * MarkdownViewer 동적 로딩
 *
 * react-markdown, rehype-highlight 등 무거운 라이브러리들을 포함하므로
 * 필요할 때만 로딩합니다.
 */
export const DynamicMarkdownViewer = dynamic(() => import("../features/posts/MarkdownViewer"), {
  loading: () => <MarkdownViewerSkeleton />,
  ssr: true, // 마크다운은 SEO를 위해 서버에서도 렌더링
});

/**
 * ToastEditor 동적 로딩 (이미 PostForm에서 사용 중이지만 재사용을 위해 정의)
 */
export const DynamicToastEditor = dynamic(() => import("../ToastEditor"), {
  loading: () => <ToastEditorSkeleton />,
  ssr: false, // 에디터는 클라이언트에서만 동작
});

/**
 * 프로필 편집 다이얼로그 동적 로딩
 *
 * 사용자가 프로필 편집 버튼을 클릭했을 때만 로딩합니다.
 */
export const DynamicProfileEditDialog = dynamic(
  () => import("../features/user/ProfileEditDialog"),
  {
    loading: () => <ProfileEditDialogSkeleton />,
    ssr: false,
  }
);

/**
 * 댓글 섹션 동적 로딩
 *
 * 게시글 하단에 위치하므로 초기 로딩에서 제외하고
 * 사용자가 스크롤했을 때 로딩할 수 있습니다.
 */
export const DynamicPostCommentsSection = dynamic(
  () => import("../features/posts/PostCommentsSection"),
  {
    loading: () => <CommentsSkeleton count={2} />,
    ssr: false, // 댓글은 인터랙티브하므로 클라이언트에서만
  }
);

/**
 * 웰컴 모달 동적 로딩
 *
 * 메인 페이지에서만 사용되고 localStorage 체크 후 조건부로 표시되므로
 * 동적 로딩으로 초기 번들 크기를 줄입니다.
 */
export const DynamicWelcomeModal = dynamic(() => import("../features/main/WelcomeModal"), {
  loading: () => null, // 모달은 로딩 상태를 보여주지 않음
  ssr: false, // localStorage를 사용하므로 클라이언트에서만
});
