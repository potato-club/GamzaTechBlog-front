import { CommentListProps } from "@/types/comment";
import CommentCard from "./CommentCard";

export default function CommentList({ comments }: CommentListProps) { // 2. Props를 구조 분해 할당으로 받도록 수정

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
        <CommentCard key={comment.commentId} comment={comment} />
      ))}
    </div>
  );
}