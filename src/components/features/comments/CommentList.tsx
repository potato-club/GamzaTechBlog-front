import { CommentListProps } from "@/types/comment";
import CommentCard from "./CommentCard";

export default function CommentList({ comments, onCommentDeleted }: CommentListProps & {
  onCommentDeleted?: (commentId: number) => void; // 댓글 삭제 콜백 추가
}) {
  // console.log("post comments", comments); // 프로덕션에서는 제거

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
          onCommentDeleted={onCommentDeleted} // 콜백 전달
        />
      ))}
    </div>
  );
}