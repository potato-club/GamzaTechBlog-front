import Image from "next/image";

export default function CommentList({ comments }: { comments: any[]; }) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-[#FAFBFF] w-full rounded-xl px-6 py-5">
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
            <span className="text-[14px] font-medium text-[#1C222E]">{comment.author}</span>
          </div>
          <div className="mt-2 text-[14px] text-[#464C58]">
            {comment.comment}
          </div>
        </div>
      ))}
    </div>
  );
}