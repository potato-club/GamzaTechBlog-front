"use client";

/**
 * 동적 로딩 컴포넌트들
 *
 * 무거운 라이브러리를 사용하는 컴포넌트들을 동적으로 로딩하여
 * 초기 번들 크기를 줄이고 성능을 개선합니다.
 */

import dynamic from "next/dynamic";
import CommentsSkeleton from "../../features/comments/components/skeletons/CommentsSkeleton";
import MarkdownViewerSkeleton from "../../features/posts/components/skeletons/MarkdownViewerSkeleton";
import { ProfileEditDialogSkeleton } from "../../features/user";

/**
 * MarkdownViewer 동적 로딩
 *
 * react-markdown, rehype-highlight 등 무거운 라이브러리들을 포함하므로
 * 필요할 때만 로딩합니다.
 */
export const DynamicMarkdownViewer = dynamic(
  () => import("../../features/posts/components/MarkdownViewer"),
  {
    loading: () => <MarkdownViewerSkeleton />,
    ssr: true, // 마크다운은 SEO를 위해 서버에서도 렌더링
  }
);

/**
 * ToastEditor 동적 로딩 - 개선된 버전
 *
 * 에디터는 무거운 라이브러리이므로 실제 사용할 때만 로딩하고
 * 더 나은 로딩 경험을 위해 개선된 스켈레톤을 사용합니다.
 */
export const DynamicToastEditor = dynamic(
  () => import("../../features/posts/components/ToastEditor"),
  {
    loading: () => (
      <div className="border-t border-gray-200">
        <div className="animate-pulse">
          {/* 툴바 스켈레톤 */}
          <div className="border-b border-gray-200 p-2">
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded bg-gray-200" />
              ))}
            </div>
          </div>

          {/* 에디터 영역 스켈레톤 */}
          <div className="min-h-[400px] p-4">
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false, // 에디터는 클라이언트에서만 동작
  }
);

/**
 * 프로필 편집 다이얼로그 동적 로딩
 *
 * 사용자가 프로필 편집 버튼을 클릭했을 때만 로딩합니다.
 * 주의: 마이페이지에서는 자주 사용되므로 일반 import 권장
 * 다른 페이지에서 간헐적으로 사용할 때 이 동적 버전 사용
 */
export const DynamicProfileEditDialog = dynamic(
  () => import("../../features/user/components/ProfileEditDialog"),
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
  () => import("../../features/posts/components/PostCommentsSection"),
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
export const DynamicWelcomeModal = dynamic(() => import("../shared/interactive/WelcomeModal"), {
  loading: () => null, // 모달은 로딩 상태를 보여주지 않음
  ssr: false, // localStorage를 사용하므로 클라이언트에서만
});
