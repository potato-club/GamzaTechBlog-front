import { errorMonitor } from "events";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== API Route 시작 ===');

  try {
    // 1. 요청 정보 로깅
    console.log('요청 URL:', request.url);
    console.log('요청 메서드:', request.method);

    // 2. 헤더 확인
    const cookieHeader = request.headers.get('cookie');
    console.log('쿠키 헤더:', cookieHeader);
    console.log('모든 헤더:', Object.fromEntries(request.headers.entries()));

    // 3. 백엔드 URL 설정
    const backendUrl = 'https://gamzatech.site/api/v1/users/me/get/profile';
    console.log('백엔드 호출 URL:', backendUrl);

    // 4. 백엔드 요청 헤더 구성
    const fetchHeaders: { [key: string]: string; } = {
      'Content-Type': 'application/json',
      'User-Agent': 'Next.js-Proxy/1.0',
    };

    if (cookieHeader) {
      fetchHeaders['Cookie'] = cookieHeader;
    }

    console.log('백엔드 요청 헤더:', fetchHeaders);

    // 5. 백엔드 호출
    console.log('백엔드 호출 시작...');
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: fetchHeaders,
    });

    console.log('백엔드 응답 상태:', response.status);
    console.log('백엔드 응답 헤더:', Object.fromEntries(response.headers.entries()));

    // 6. 응답 처리
    if (!response.ok) {
      console.log('백엔드 에러 발생:', response.status, response.statusText);

      // 에러 응답 본문도 확인
      let errorText = '';
      try {
        errorText = await response.text();
        console.log('백엔드 에러 본문:', errorText);
      } catch (e) {
        console.log('에러 본문 읽기 실패:', e);
      }

      return Response.json(
        {
          error: 'Backend Error',
          status: response.status,
          statusText: response.statusText,
          backendResponse: errorText
        },
        { status: response.status }
      );
    }

    // 7. 성공 응답 처리
    const data = await response.json();
    console.log('백엔드 성공 응답:', data);

    return Response.json(data);

  } catch (error) {
    console.error('=== API Route 에러 ===');
    console.error('에러 :', errorMonitor);

  }
}