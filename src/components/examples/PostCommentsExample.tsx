/**
 * 게시글 댓글 사용 예시
 */
import CommentList from "@/components/common/CommentList";
import { PostCommentData } from "@/types/comment";

interface PostCommentsProps {
  postComments: PostCommentData[];
}

export const PostComments = ({ postComments }: PostCommentsProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">댓글</h3>
      <CommentList
        comments={postComments}
        variant="post"
        className="bg-gray-50 p-4 rounded-lg"
      />
    </div>
  );
};
