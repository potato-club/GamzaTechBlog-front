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
    <main className="mx-16 my-16">
      <article className="border-b border-[#D5D9E3] py-8">
        <header>
          <h1 className="text-[32px] font-extrabold text-[#1C222E]">
            제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다
          </h1>

          <div className="flex h-12 items-center gap-4 text-[14px]">
            <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
              <Image
                src="/profileSVG.svg"
                alt="GyeongHwan Lee의 프로필 이미지"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="ml-2 font-medium text-[#798191]">
                GyeongHwan Lee
              </span>
            </div>
            <time dateTime="2025-04-28" className="text-[#B5BBC7]">
              2025. 04. 28
            </time>
          </div>

          <ul className="flex gap-2 text-[14px]" role="list">
            <li className="rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
              # java
            </li>
          </ul>
        </header>

        <div className="my-6 text-[17px] text-[#474F5D] leading-relaxed">
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
      </article>

      <section className="mt-40 text-[#353841] text-[17px]" aria-label="댓글 섹션">
        <h2 className="mt-7 text-lg font-semibold">댓글 1개</h2>

        {/* 댓글 작성 */}
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="댓글 작성">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src="/profileSVG.svg"
              alt="현재 사용자의 프로필 이미지"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          <label htmlFor="comment-input" className="sr-only">
            댓글 내용
          </label>
          <input
            id="comment-input"
            type="text"
            placeholder="댓글을 남겨주세요."
            className="border border-[#E7EEFE] rounded-xl w-full px-5 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FAA631]/50 transition"
            aria-required="true"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]"
            >
              등록
            </Button>
          </div>
        </form>

        <CommentList comments={comments} />
      </section>
    </main>
  );
}