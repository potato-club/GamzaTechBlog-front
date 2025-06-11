import { cookies } from 'next/headers';

export default async function HomePage() {
  // Server Component에서 httpOnly 쿠키 직접 접근
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get('refreshToken');

  console.log('=== Server Component 쿠키 확인 ===');
  console.log('🍪 refreshToken 존재:', !!refreshToken);
  console.log('🍪 refreshToken 값:', refreshToken?.value ? '존재함' : '없음');

  if (refreshToken) {
    console.log('✅ httpOnly 쿠키 정상 설정됨!');
    console.log('🔍 쿠키 상세 정보:', {
      name: refreshToken.name,
      value: refreshToken.value.substring(0, 20) + '...',
      httpOnly: true, // Next.js에서는 httpOnly 속성 직접 확인 불가
    });
  } else {
    console.log('❌ refreshToken 쿠키가 설정되지 않음');
  }

  // 모든 쿠키 확인
  const allCookies = (await cookieStore).getAll();
  console.log('📋 모든 쿠키 목록:', allCookies.map(c => c.name));

  return (
    <div className="container mx-auto p-4">
      <h1>홈페이지</h1>

      {/* 디버깅 정보 표시 (개발환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">🔍 쿠키 디버깅 정보</h2>
          <p>RefreshToken: {refreshToken ? '✅ 존재' : '❌ 없음'}</p>
          <p>전체 쿠키 수: {allCookies.length}</p>
          <details className="mt-2">
            <summary>쿠키 상세 정보</summary>
            <pre className="mt-2 text-sm">
              {JSON.stringify(allCookies, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* 나머지 컴포넌트 내용 */}
    </div>
  );
}