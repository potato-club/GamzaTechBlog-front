/**
 * 콘텐츠 관련 페이지들의 공통 레이아웃
 * 
 * 게시글 목록, 상세보기, 작성 등 콘텐츠 관련 페이지들을 위한
 * 공통 레이아웃입니다.
 */

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* 콘텐츠 페이지들을 위한 공통 컨테이너 */}
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
