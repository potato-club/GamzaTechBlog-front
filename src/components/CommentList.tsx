import Image from "next/image";

export default function CommentList({ comments }: { comments: any[]; }) {

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
        <div key={comment.commentId} className="bg-[#FAFBFF] w-full rounded-xl px-6 py-5">
          <div className="relative">
            <Image
              src="/dot3.svg"
              alt="더보기"
              width={18}
              height={4}
              className="absolute top-0 right-0 hover:cursor-pointer hover:opacity-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image
                src="/profileSVG.svg"
                alt="유저 이미지"
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
      ))}
    </div>
  );
}