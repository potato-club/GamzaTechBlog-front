import { CommentListProps, isMyComment, isPostComment } from "../../../types/comment";
import CommentCard from "./CommentCard";

// 향상된 CommentList - 기존 API와 호환성 유지하면서 variant 기능 추가
export default function CommentList({
  comments,
  postId, // 기존 API 호환성을 위해 유지
  onCommentDeleted,
  variant, // 새로운 variant 옵션 추가
  className = "" // className prop 추가
}: CommentListProps & {
  postId?: number; // postId를 선택적으로 변경 (기존 호환성)
  onCommentDeleted?: (commentId: number) => void;
  variant?: 'post' | 'my'; // 새로운 variant 옵션
  className?: string; // className prop 추가
}) {
  // variant가 지정되지 않으면 postId 존재 여부로 판단 (기존 호환성)
  const resolvedVariant = variant || (postId !== undefined ? 'post' : 'my');

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>
          {resolvedVariant === 'my'
            ? '아직 작성한 댓글이 없어요. 다른 게시글에 댓글을 남겨보세요!'
            : '아직 작성된 댓글이 없어요. 첫 댓글을 남겨주세요!'
          }
        </p>
      </div>
    );
  }
  return (
    <div className={`mt-8 flex flex-col gap-4 ${className}`}>
      {comments.map((comment) => {
        // 기존 PostComment 타입인 경우 기존 CommentCard 사용
        if (resolvedVariant === 'post' && isPostComment(comment)) {
          return (
            <CommentCard
              key={comment.commentId}
              comment={comment}
              postId={postId!} // variant가 post면 postId는 반드시 존재
              onCommentDeleted={onCommentDeleted}
            />
          );
        }        // MyComment 타입인 경우 CommentCard 사용 (게시글 정보 포함)
        if (resolvedVariant === 'my' && isMyComment(comment)) {
          return (
            <CommentCard
              key={comment.commentId}
              comment={comment}
              postId={comment.postId} // MyComment의 postId 사용
              onCommentDeleted={onCommentDeleted}
            />
          );
        }

        // 기본 댓글 렌더링 (안전장치)
        return (
          <div key={comment.commentId} className="border-b border-gray-200 py-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 mb-2">{comment.content}</p>
              <time className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}