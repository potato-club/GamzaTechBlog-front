/**
 * 로고 스켈레톤 컴포넌트
 *
 * 메인 페이지 로고 영역의 로딩 상태를 표시합니다.
 */

export default function LogoSkeleton() {
  return (
    <section className="mt-5 text-center">
      <div className="animate-pulse">
        <div className="mx-auto h-[230px] w-[255px] rounded bg-gray-200"></div>
        <div className="mx-auto mt-2 h-6 w-64 rounded bg-gray-200"></div>
      </div>
    </section>
  );
}
