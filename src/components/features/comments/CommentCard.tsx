/**
 * 댓글 카드 컴포넌트
 *
 * TanStack Query의 useDeleteComment 뮤테이션을 사용하여
 * 댓글 삭제 시 Optimistic Update와 자동 캐시 관리를 제공합니다.
 */

import { useDeleteComment } from "@/hooks/queries/useCommentQueries";
import { CommentResponse } from "@/generated/api";
import { DropdownActionItem } from "@/types/dropdown";
import Image from "next/image";
import { useAuth } from "@/hooks/queries/useUserQueries";
import { DropdownMenuList } from "@/components/common/DropdownMenuList";

interface CommentCardProps {
  comment: CommentResponse;
  postId: number; // TanStack Query 뮤테이션에 필요
}

export default function CommentCard({ comment, postId }: CommentCardProps) {
  /**
   * TanStack Query 뮤테이션을 사용한 댓글 삭제
   *
   * 이 훅은 다음 기능들을 자동으로 제공합니다:
   * - Optimistic Update: 서버 응답 전에 UI에서 댓글 즉시 제거
   * - 에러 처리: 실패 시 이전 상태로 자동 롤백
   * - 로딩 상태: isPending을 통한 UI 비활성화
   * - 캐시 갱신: 성공 시 관련 쿼리 자동 무효화
   */

  const { userProfile } = useAuth();

  const deleteCommentMutation = useDeleteComment(postId);

  const handleCommentEdit = () => {
    if (deleteCommentMutation.isPending || typeof comment.commentId !== 'number') return;
    // TODO: Implement edit functionality
    alert(`댓글 수정 기능 (ID: ${comment.commentId})`);
  };

  const handleCommentDelete = async () => {
    if (deleteCommentMutation.isPending || typeof comment.commentId !== 'number') return;

    const confirmDelete = window.confirm(
      `'${(comment.content ?? '').substring(0, 30).trim()}${(comment.content ?? '').length > 30 ? "..." : ""}' 댓글을 정말 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }

    // TanStack Query 뮤테이션 실행
    try {
      await deleteCommentMutation.mutateAsync(comment.commentId);
    } catch (error) {
      // 에러는 TanStack Query의 onError에서 이미 처리됨
      // 추가 사용자 피드백이 필요하면 여기에 추가
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const commentDropdownItems: DropdownActionItem[] = [
    {
      label: "수정하기",
      onClick: handleCommentEdit,
      className: deleteCommentMutation.isPending ? "text-gray-400 cursor-not-allowed" : "",
    },
  ];

  const commentTriggerElement = (
    <button
      type="button"
      aria-label="댓글 옵션 더보기"
      className={`p-1 hover:cursor-pointer hover:opacity-80 ${deleteCommentMutation.isPending ? "cursor-not-allowed" : ""}`}
    >
      <Image
        src="/dot3.svg"
        alt="더보기" // 버튼에 aria-label이 있으므로 alt는 간결하게
        width={18}
        height={4}
      />
    </button>
  );

  // 현재 사용자가 댓글 작성자인지 확인하는 로직
  const isCurrentUserCommentOwner = (() => {
    if (!userProfile || !comment.writer) return false;
    return comment.writer === userProfile.nickname;
  })();

  if (isCurrentUserCommentOwner) {
    commentDropdownItems.push({
      label: deleteCommentMutation.isPending ? "삭제 중..." : "삭제하기",
      onClick: handleCommentDelete,
      className: `w-full text-left ${deleteCommentMutation.isPending ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50"}`,
    });
  }

  return (
    <div className="bg-[#FAFBFF] w-full rounded-xl px-6 py-5">
      <div className="relative">
        {isCurrentUserCommentOwner && commentDropdownItems.length > 0 && (
          <div className="absolute top-0 right-0">
            <DropdownMenuList
              triggerElement={commentTriggerElement}
              items={commentDropdownItems}
              contentClassName="w-28"
            />
          </div>
        )}
      </div>

      {/* 사용자 프로필 정보 표시 */}
      {comment.writer && (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-9 h-9 rounded-full overflow-hidden mr-2">
            <Image
              src={comment.writerProfileImageUrl || "/profileSVG.svg"}
              alt={`${comment.writer}의 프로필 이미지`}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[14px] font-medium text-[#1C222E]">
            {comment.writer}
          </span>
        </div>
      )}

      <div className="mt-2 text-[14px] text-[#464C58]">
        {comment.content}
      </div>

      {comment.createdAt && (
        <div className="mt-2 text-[12px] text-[#B5BBC7]">
          <time dateTime={new Date(comment.createdAt).toISOString()}>
            {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </time>
        </div>
      )}
    </div>
  );
}
