import Image from "next/image";
import { Button } from "../ui/button";

export default function Sidebar() {
  const stats = [
    { icon: "/postIcon.svg", alt: "작성 글 아이콘", label: "작성 글", count: 12 },
    { icon: "/commentIcon.svg", alt: "작성 댓글 아이콘", label: "작성 댓글", count: 12 },
    { icon: "/likeIcon.svg", alt: "좋아요 아이콘", label: "좋아요", count: 12 },
  ];

  return (
    <aside className="flex flex-col items-center w-56 py-10">
      {/* 프로필 이미지 */}
      <div className="w-28 h-28 rounded-full bg-gray-100 mb-4" />
      {/* 닉네임 */}
      <span className="text-2xl font-bold">gamza</span>
      {/* 프로필 수정 버튼 */}
      <Button className="mt-4 w-[90px] rounded-4xl text-[#353841] text-[14px] bg-transparent hover:bg-transparent hover:cursor-pointer border border-[#D5D9E3]">
        프로필 수정
      </Button>
      {/* 작성 글, 작성 댓글, 좋아요 수 표시 */}
      <div className="mt-10 w-40 text-center flex justify-between text-[14px]">
        {stats.map((stat) => (
          <div key={stat.label} className="mt-4 flex flex-col items-center gap-1">
            <div className="w-[23px] h-[23px] flex items-center justify-center">
              <Image src={stat.icon} alt={stat.alt} width={23} height={23} />
            </div>
            <div className="mt-2">{stat.label}</div>
            <div className="text-xl font-semibold">{stat.count}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}