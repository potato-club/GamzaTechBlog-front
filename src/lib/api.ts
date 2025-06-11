import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers'; // 서버에서 사용될 경우 필요

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // `getCookie`가 서버/클라이언트를 알아서 감지하고 쿠키를 가져옵니다.
  // 서버 환경에서 사용될 때는 두 번째 인자로 `next/headers`의 cookies()를 넘겨줄 수 있습니다.
  const accessToken = getCookie('accessToken', { cookies });

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const newOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // RT 자동 전송을 위해 계속 포함
  };

  return fetch(url, newOptions);
}