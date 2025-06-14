import { commentService, CommentServiceError } from "@/services/commentService";
import { CommentData } from "@/types/comment";
import { DropdownActionItem } from "@/types/dropdown";
import Image from "next/image";
import { useState } from "react";
import { DropdownMenuList } from "../../common/DropdownMenuList";

interface CommentCardProps {
  comment: CommentData;
  onCommentDeleted?: (commentId: number) => void; // 댓글 삭제 성공 시 호출될 콜백
}

export default function CommentCard({ comment, onCommentDeleted }: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCommentEdit = () => {
    if (isDeleting) return;
    // TODO: Implement edit functionality
    alert(`댓글 수정 기능 (ID: ${comment.commentId})`);
  };

  const handleCommentDelete = async () => {
    if (isDeleting) return;

    const confirmDelete = window.confirm(
      `'${comment.content.substring(0, 30).trim()}${comment.content.length > 30 ? "..." : ""}' 댓글을 정말 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await commentService.deleteComment(comment.commentId);
      // 성공 알림은 부모 컴포넌트에서 Toast 등으로 관리하는 것이 더 좋을 수 있습니다.
      // alert(`댓글 (ID: ${comment.commentId})이(가) 삭제되었습니다.`);
      if (onCommentDeleted) {
        onCommentDeleted(comment.commentId); // 부모 컴포넌트에 삭제 알림
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      let errorMessage = "댓글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      if (error instanceof CommentServiceError) {
        errorMessage = `댓글 삭제 실패: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `댓글 삭제 실패: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const commentDropdownItems: DropdownActionItem[] = [
    {
      label: "수정하기",
      onClick: handleCommentEdit,
      className: isDeleting ? "text-gray-400 cursor-not-allowed" : "",
    },
  ];

  const commentTriggerElement = (
    <button
      type="button"
      aria-label="댓글 옵션 더보기"
      className={`p-1 hover:cursor-pointer hover:opacity-80 ${isDeleting ? "cursor-not-allowed" : ""}`}
    >
      <Image
        src="/dot3.svg"
        alt="더보기" // 버튼에 aria-label이 있으므로 alt는 간결하게
        width={18}
        height={4}
      />
    </button>
  );

  // 현재 사용자가 댓글 작성자인지 확인하는 로직 (예시, 실제 구현 필요)
  // const isCurrentUserCommentOwner = comment.writer === currentUser?.nickname;
  const isCurrentUserCommentOwner = true; // 임시로 항상 true로 설정 (실제 앱에서는 인증된 사용자 정보와 비교해야 함)

  if (isCurrentUserCommentOwner) {
    commentDropdownItems.push({
      label: isDeleting ? "삭제 중..." : "삭제하기",
      onClick: handleCommentDelete,
      className: `w-full text-left ${isDeleting ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50"}`,
    });
  }

  return (
    <div className="bg-[#FAFBFF] w-full rounded-xl px-6 py-5"> {/* key는 부모 map에서 제공하므로 제거 */}
      <div className="relative">
        {isCurrentUserCommentOwner && commentDropdownItems.length > 0 && (
          <div className="absolute top-0 right-0">
            <DropdownMenuList triggerElement={commentTriggerElement} items={commentDropdownItems} contentClassName="w-28" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1"> {/* 드롭다운 메뉴와의 간격 확보 */}
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <Image
            src="/profileSVG.svg" // 실제 프로필 이미지 경로로 변경해야 합니다.
            alt={`${comment.writer} 프로필 이미지`}
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[14px] font-medium text-[#1C222E]">{comment.writer}</span>
      </div>
      <div className="mt-2 text-[14px] text-[#464C58]">
        {comment.content}
      </div>
    </div>
  );
}