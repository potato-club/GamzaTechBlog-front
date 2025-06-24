import { CommentListProps } from "@/types/comment";
import CommentCard from "./CommentCard";

export default function CommentList({
  comments,
  postId, // TanStack Query를 위해 postId 추가
  onCommentDeleted
}: CommentListProps & {
  postId: number; // postId를 필수 prop으로 추가
  onCommentDeleted?: (commentId: number) => void; // 댓글 삭제 콜백 (이제 선택사항)
}) {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>아직 작성된 댓글이 없어요. 첫 댓글을 남겨주세요!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.commentId}
          comment={comment}
          postId={postId} // TanStack Query 뮤테이션을 위해 postId 전달
          onCommentDeleted={onCommentDeleted} // 하위 호환성을 위한 콜백 전달
        />
      ))}
    </div>
  );
}