import Image from "next/image";

export default function PostPage() {
  return (
    <div className="mx-16 mt-16">
      <div className="border-b-1 border-[#D5D9E3] py-8">
        <div className="text-[32px] font-extrabold text-[#1C222E]">
          제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다
        </div>

        <div className="flex h-12 items-center gap-4 text-[14px]">
          <div className="flex h-5 items-center border-r-1 border-[#B5BBC7] pr-1.5">
            <Image
              src=""
              alt="사용사 이미지"
              width={35}
              height={35}
              className="m-2"
            />
            <span className="m-2 font-medium text-[#798191]">
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
      </div>
    </div>
  );
}
