import Image from "next/image";
import profileImg from "../../public/profileEX.png";

export default function Home() {
  return (
    <div className="mt-16 flex w-full gap-30">
      <div className="flex-3">
        <span className="text-2xl text-[#FAA631]">Posts</span>
        <div>
          <div className="border-b-1 border-[#D5D9E3] py-8">
            <div className="text-2xl font-extrabold text-[#1C222E]">
              제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다제목입니다
            </div>
            <div className="my-6 text-[#B5BBC7]">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
              aperiam animi libero quae sint nobis molestiae suscipit
              perferendis facere quia! Vel obcaecati culpa ex libero tempore
              consequuntur sapiente incidunt sint! Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Minima aperiam animi libero quae
              sint nobis molestiae suscipit perferendis facere quia! Vel
              obcaecati culpa ex libero tempore consequuntur sapiente incidunt
              sint!
            </div>
            <div className="flex h-12 items-center gap-4 text-[14px]">
              <div className="flex h-5 items-center border-r-1 border-[#B5BBC7] pr-1.5">
                <Image
                  src={profileImg}
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
              <div className="flex gap-2">
                <div className="rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
                  # java
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 pl-20">
        <span className="text-2xl text-[#FAA631]">Tags</span>
        <div className="mt-7 flex flex-col gap-2 text-[14px]">
          <div className="w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
            # javajavajavajavajavajavajavajavajavajava
          </div>
          <div className="w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
            # java
          </div>
        </div>
      </div>
    </div>
  );
}
