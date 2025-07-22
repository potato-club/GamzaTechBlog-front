/**
 * 인증 관련 페이지들의 공통 레이아웃
 * 
 * 로그인, 회원가입 등 인증 페이지에서 공통으로 사용되는 레이아웃입니다.
 * 깔끔한 중앙 정렬 레이아웃을 제공합니다.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
