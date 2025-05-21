'use client';

import Image from 'next/image';

export default function PostPage() {

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
            <button
              type="submit"
              className="rounded-full bg-[#FAA631] px-4 py-1.5 text-sm text-white hover:bg-[#f89f20] transition hover:cursor-pointer"
            >
              등록
            </button>
          </div>
        </form>

        {/* 댓글 리스트 */}
        <div className="mt-8 flex flex-col gap-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-[#FAFBFF] w-full rounded-xl px-6 py-5">
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
                <span className="text-[14px] font-medium text-[#1C222E]">GyeongHwan Lee</span>
              </div>
              <div className="mt-2 text-[14px] text-[#464C58]">
                어플리케이션을 운영하다 보면, 트래픽 증가나 사용자 경험 개선,<br />
                비용 절감 등 다양한 요인으로 인한 성능 개선 요구가 꾸준히 제기됩니다.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
