import Sidebar from "../../components/mypage/Sidebar";
import TabMenu from "../../components/mypage/TabMenu";

export default function MyPage() {
  return (
    <main className="border-2 border-black flex">
      <Sidebar />
      <section className="flex-1 ml-12">
        <TabMenu />
        {/* <PostList posts={posts} /> */}
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex items-start gap-6 p-6 bg-white rounded-lg border border-gray-200">
            {/* 썸네일 자리 */}
            <div className="w-28 h-20 bg-gray-100 rounded-md shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">작성 글 제목</h2>
              <p className="text-gray-500 text-sm mt-1">작성 글 요약 내용</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
                  작성자 이름
                </span>
                <span className="mx-2">|</span>
                <span>2023년 10월 1일</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-6 p-6 bg-white rounded-lg border border-gray-200">
            {/* 썸네일 자리 */}
            <div className="w-28 h-20 bg-gray-100 rounded-md shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">작성 글 제목</h2>
              <p className="text-gray-500 text-sm mt-1">작성 글 요약 내용</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-6 h-6 rounded-full bg-gray-200 inline-block" />
                  작성자 이름
                </span>
                <span className="mx-2">|</span>
                <span>2023년 10월 1일</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}