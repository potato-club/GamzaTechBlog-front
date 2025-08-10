import { CommentResponse } from "@/generated/api";
import CommentCard from "./CommentCard";

// 'my' variant에서 postTitle과 postId를 사용하기 위한 확장 타입
type MyComment = CommentResponse & {
  postTitle?: string;
  postId?: number;
};

interface CommentListProps {
  comments: (CommentResponse | MyComment)[];
  postId?: number;
  variant?: "post" | "my";
  className?: string;
}

export default function CommentList({
  comments,
  postId,
  variant,
  className = "",
}: CommentListProps) {
  const resolvedVariant = variant || (postId !== undefined ? "post" : "my");
  // const reversedComments = [...comments].reverse();

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>
          {resolvedVariant === "my"
            ? "아직 작성한 댓글이 없어요. 다른 게시글에 댓글을 남겨보세요!"
            : "아직 작성된 댓글이 없어요. 첫 댓글을 남겨주세요!"}
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-8 flex flex-col gap-4 ${className}`}>
      {comments.map((comment) => (
        <CommentCard
          key={comment.commentId}
          comment={comment}
          // 'post' variant일 경우 부모로부터 받은 postId를, 'my' variant일 경우 comment에 포함된 postId를 사용
          postId={resolvedVariant === "post" ? postId! : (comment as MyComment).postId!}
        />
      ))}
    </div>
  );
}
