/**
 * 대시보드 관련 페이지들의 공통 레이아웃
 * 
 * 마이페이지, 관리자 페이지 등 인증된 사용자만 접근할 수 있는
 * 대시보드 성격의 페이지들을 위한 공통 레이아웃입니다.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 대시보드 페이지들을 위한 공통 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
