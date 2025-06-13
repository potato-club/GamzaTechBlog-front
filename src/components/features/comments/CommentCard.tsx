import { CommentData } from "@/types/comment";
import Image from "next/image";

interface CommentCardProps {
  comment: CommentData;
}

export default function CommentCard({ comment }: CommentCardProps) { // 3. Props를 구조 분해 할당으로 받도록 수정
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