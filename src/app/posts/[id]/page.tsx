'use client';

import CommentList from "@/components/CommentList";
import Image from 'next/image';
import { Button } from "../../../components/ui/button";

export default function PostPage() {
  const comments = [
    {
      id: 1,
      comment:
        "첫 댓글 달아봤습니다 하하.",
      author: "GyeongHwan Lee",
      date: "2025. 04. 28",
    },
    {
      id: 2,
      comment:
        "좋은 글 감사합니다! Next.js에 대해 더 배우고 싶어요.",
      author: "Jinwoo Park",
      date: "2025. 04. 27",
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="mx-16 my-16">
      <div className="border-b border-[#D5D9E3] py-8">
        <div className="text-[32px] font-extrabold text-[#1C222E]">
          제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다
        </div>

        <div className="flex h-12 items-center gap-4 text-[14px]">
          <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
            <Image
              src="/profileSVG.svg"
              alt="사용자 이미지"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="ml-2 font-medium text-[#798191]">
              GyeongHwan Lee
            </span>
          </div>
          <div className="text-[#B5BBC7]">2025. 04. 28</div>
        </div>

        <div className="flex gap-2 text-[14px]">
          <div className="rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
            # java
          </div>
        </div>
      </div>

      <div className="my-6 text-[17px] text-[#474F5D]">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima aperiam
        animi libero quae sint nobis molestiae suscipit perferendis facere quia!
        Vel obcaecati culpa ex libero tempore consequuntur sapiente incidunt
        sint! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
        aperiam animi libero quae sint nobis molestiae suscipit perferendis
        facere quia! Vel obcaecati culpa ex libero tempore consequuntur sapiente
        incidunt sint!Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Minima aperiam animi libero quae sint nobis molestiae suscipit
        perferendis facere quia! Vel obcaecati culpa ex libero tempore
        consequuntur sapiente incidunt sint! Lorem ipsum dolor, sit amet
        consectetur adipisicing elit. Minima aperiam animi libero quae sint
        nobis molestiae suscipit perferendis facere quia! Vel obcaecati culpa ex
        libero tempore consequuntur sapiente incidunt sint! Lorem ipsum dolor,
        sit amet consectetur adipisicing elit. Minima aperiam animi libero quae
        sint nobis molestiae suscipit perferendis facere quia! Vel obcaecati
        culpa ex libero tempore consequuntur sapiente incidunt sint! Lorem ipsum
        dolor, sit amet consectetur adipisicing elit. Minima aperiam animi
        libero quae sint nobis molestiae suscipit perferendis facere quia! Vel
        obcaecati culpa ex libero tempore consequuntur sapiente incidunt sint!

        <br />
        <br />

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, voluptatum. Quis, officiis autem ab quaerat accusantium reiciendis magni modi aut aliquam corporis est ea similique iusto enim voluptas fuga architecto?

        <br />
        <br />

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, voluptatum. Quis, officiis autem ab quaerat accusantium reiciendis magni modi aut aliquam corporis est ea similique iusto enim voluptas fuga architecto?
        <br />
        <br />

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, voluptatum. Quis, officiis autem ab quaerat accusantium reiciendis magni modi aut aliquam corporis est ea similique iusto enim voluptas fuga architecto?
      </div>

      <div className="mt-40 text-[#353841] text-[17px]">
        <div className="mt-7">댓글 1개</div>

        {/* 댓글 작성 */}
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src="/profileSVG.svg"
              alt="유저 이미지"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="text"
            placeholder="댓글을 남겨주세요."
            className="border border-[#E7EEFE] rounded-xl w-full px-5 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FAA631]/50 transition"
          />

          <div className="flex justify-end">
            <Button className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]">
              등록
            </Button>
          </div>
        </form>

        <CommentList comments={comments} />
      </div>
    </div>
  );
}
