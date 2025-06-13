import Image from "next/image";

interface CommentCardProps {
  comment: {
    commentId: string;
    writer: string;
    content: string;
    // 필요한 경우 여기에 더 많은 comment 속성을 추가하세요.
  };
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
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
            src="/profileSVG.svg" // 실제 프로필 이미지 경로로 변경해야 합니다.
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
  );
}