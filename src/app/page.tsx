export default function Home() {
  return (
    <div className="w-full flex mt-16 gap-30">
      <div className="flex-3">
        <span className="text-[#FAA631] text-2xl">Posts</span>
        <div>
          <div className="py-8 border-b-1 border-[#D5D9E3]">
            <div className="font-extrabold">
              제목입니다제목입니다제목입니다제목입니다
            </div>
            <div className="my-6">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
              aperiam animi libero quae sint nobis molestiae suscipit
              perferendis facere quia! Vel obcaecati culpa ex libero tempore
              consequuntur sapiente incidunt sint! Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Minima aperiam animi libero quae
              sint nobis molestiae suscipit perferendis facere quia! Vel
              obcaecati culpa ex libero tempore consequuntur sapiente incidunt
              sint!
            </div>
            <div>사용자사진 / 닉네임 / 날짜 / 태그</div>
          </div>
        </div>
      </div>
      <div className="flex-1 border-2 border-[#FAA631]">
        <span className="text-[#FAA631] text-2xl">Tags</span>
      </div>
    </div>
  );
}
