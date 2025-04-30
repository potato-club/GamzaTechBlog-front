import Image from "next/image";

export default function PostPage() {
  return (
    <div className="mx-16">
      <div className="py-8 border-b-1 border-[#D5D9E3]">
        <div className="font-extrabold text-[#1C222E] text-[32px]">
          제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다
        </div>

        <div className="flex gap-4 text-[14px] items-center h-12">
          <div className="flex border-r-1 border-[#B5BBC7] items-center h-5 pr-1.5">
            <Image
              src=""
              alt="사용사 이미지"
              width={35}
              height={35}
              className="m-2"
            />
            <span className="m-2 text-[#798191] font-medium">
              GyeongHwan Lee
            </span>
          </div>
          <div className="text-[#B5BBC7]">2025. 04. 28</div>
        </div>
        <div className="flex gap-2 text-[14px]">
          <div className="bg-[#F2F4F6] text-[#848484] px-2 py-1.5 rounded-2xl">
            # java
          </div>
        </div>
      </div>
      <div className="my-6 text-[#474F5D] text-[17px]">
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
