/**
 * 마이페이지 내 댓글 사용 예시
 */
import CommentList from "@/components/common/CommentList";
import { MyCommentData } from "@/types/comment";

interface MyCommentsProps {
  myComments: MyCommentData[];
}

export const MyComments = ({ myComments }: MyCommentsProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">내가 작성한 댓글</h3>
      <CommentList
        comments={myComments}
        variant="my"
        className="space-y-4"
      />
    </div>
  );
};
