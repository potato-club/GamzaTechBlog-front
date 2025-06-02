export default function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-56 py-10">
      {/* 프로필 이미지 */}
      <div className="w-28 h-28 rounded-full bg-gray-100 mb-4" />
      {/* 닉네임 */}
      <span className="text-2xl font-bold">gamza</span>
    </aside>
  );
}