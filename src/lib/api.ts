"use client";

import { API_CONFIG } from '@/config/api'; // API_CONFIG 경로가 올바르다고 가정
import { queryClient } from '@/providers/QueryProvider'; // QueryClient 인스턴스를 직접 가져옵니다.

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
// import { useRouter } from "next/navigation"; // React Hook은 유틸리티 함수에서 직접 사용하지 않습니다.

// --- 토큰 재발급 중 상태 관리 ---
let isRefreshingToken = false;
// 재발급 중 실패한 요청들을 저장할 큐
let failedRequestsQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void; url: string; options: RequestInit; }> = [];


// --- 커스텀 에러: 리프레시 토큰이 유효하지 않을 때 발생 ---
export class RefreshTokenInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefreshTokenInvalidError';
  }
}

// 큐에 쌓인 요청들을 처리하는 함수
const processFailedRequestsQueue = (error: Error | null, newAccessToken: string | null = null) => {

  failedRequestsQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (newAccessToken) {
      const newOptions = { ...prom.options };
      const headers = new Headers(newOptions.headers);
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      newOptions.headers = headers;

      fetch(prom.url, newOptions)
        .then(response => {
          // 재시도 성공 후 관련 쿼리 무효화 (예시)
          // 어떤 쿼리를 무효화할지는 애플리케이션 구조에 따라 결정
          if (prom.url.includes('/users/me') || prom.url.includes('/profile')) {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // 사용자 프로필 관련 쿼리 키
          }
          // 다른 중요한 쿼리들도 필요에 따라 무효화
          // queryClient.invalidateQueries(['someOtherData']);

          prom.resolve(response); // 원래 요청의 Promise를 resolve
        })
        .catch(prom.reject);
    }
  });
  failedRequestsQueue = [];
};

// --- 새 액세스 토큰을 발급받는 함수 ---
async function refreshAccessToken(): Promise<string | null> {
  // const refreshToken = getCookie('refreshToken');
  // if (!refreshToken) { ... }

  try {
    // 실제 토큰 재발급 API 엔드포인트로 수정해야 합니다.
    const endpoint = '/api/auth/reissue';
    const refreshUrl = `${API_CONFIG.BASE_URL}${endpoint}`;

    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 리프레시 토큰 전송 방식에 따라 필요
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse refresh error' }));
      console.error('토큰 재발급 API 실패:', response.status, errorData);
      // 리프레시 토큰도 만료된 경우 (예: 401, 403 등)
      if (response.status === 401 || response.status === 403 || response.status === 400) { // 400도 추가 (백엔드 상황에 따라)
        deleteCookie('authorization');
        // HttpOnly 리프레시 토큰은 서버에서 만료시켜야 합니다.
        // 클라이언트는 이 에러를 통해 강제 로그아웃을 유도합니다.
        console.warn('리프레시 토큰이 만료되었거나 유효하지 않습니다. 강제 로그아웃이 필요합니다.');
        throw new RefreshTokenInvalidError('Refresh token invalid or expired.');
      }
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken; // 백엔드 응답에 따라 키 이름 조정
    // const newRefreshToken = data.refreshToken; // 새 리프레시 토큰도 받는다면

    if (newAccessToken) {
      setCookie('authorization', newAccessToken, { path: '/' /*, httpOnly: false, secure: true, sameSite: 'lax' */ });
      // if (newRefreshToken) setCookie('refreshToken', newRefreshToken, { path: '/' });
      console.log('새 액세스 토큰 발급 및 저장 성공.');
      return newAccessToken;
    }
    return null;
  } catch (error) {
    if (error instanceof RefreshTokenInvalidError) {
      throw error; // RefreshTokenInvalidError는 그대로 다시 throw
    }
    console.error('토큰 재발급 중 네트워크 또는 기타 에러:', error);
    return null;
  }
}


export async function fetchWithAuth(url: string, options: RequestInit = {}, isRetry = false) {
  const accessToken = getCookie('authorization');
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  // 'Content-Type'은 body가 있을 때만 설정하거나, 기본값으로 application/json 유지
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }


  const newOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, newOptions);

  // J004: 액세스 토큰 만료 코드 (백엔드와 협의된 코드)
  if (!isRetry) { // isRetry 플래그 추가
    const clonedResponse = response.clone(); // 응답을 복제하여 body를 두 번 읽을 수 있도록 함
    try {
      const errorData = await clonedResponse.json();
      if (errorData.data === 'J004' || errorData.data === 'C005') { // data 또는 code 필드 확인
        console.warn('액세스 토큰 만료 감지 (J004). 재발급 시도...');

        if (!isRefreshingToken) {
          isRefreshingToken = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              // 성공: 큐에 있던 요청들 처리 및 현재 요청 재시도
              processFailedRequestsQueue(null, newAccessToken);
              // 현재 요청 재시도 (새 토큰으로)
              const retryHeaders = new Headers(newOptions.headers);
              retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
              const retryOptions = { ...newOptions, headers: retryHeaders };
              console.log('원래 요청 재시도:', url);
              response = await fetch(url, retryOptions); // 재시도 결과를 response에 할당
            } else {
              // 실패: 큐에 있던 요청들 에러 처리
              processFailedRequestsQueue(new Error('토큰 재발급 실패로 인한 요청 중단'), null);
              // 현재 요청은 이미 실패한 상태이므로, 추가 처리 없이 반환 (또는 에러 throw)
              // 여기서 로그아웃 처리가 refreshAccessToken 내부에서 이미 유도되었을 수 있음
            }
          } catch (refreshError: any) { // refreshAccessToken에서 발생한 에러 처리
            processFailedRequestsQueue(refreshError as Error, null);
            if (refreshError instanceof RefreshTokenInvalidError) {
              // 이 에러는 useAuth 훅에서 감지하여 로그아웃 처리하도록 전파
              console.error("RefreshTokenInvalidError caught during refresh, propagating for logout:", refreshError);
              throw refreshError;
            }
            // 기타 재발급 에러는 기존 로직대로 처리 (원래 J004 응답 반환)
          } finally {
            isRefreshingToken = false;
          }
        } else {
          // 이미 재발급 중: 현재 요청을 큐에 추가하고 Promise 반환
          console.log('이미 토큰 재발급 중. 현재 요청을 큐에 추가:', url.replace(API_CONFIG.BASE_URL, ''));
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({ resolve, reject, url, options: newOptions });
          });
        }
      }
    } catch (e) {
      // JSON 파싱 실패 등, J004가 아닌 다른 403 에러일 수 있음
      console.error('403 응답 처리 중 에러 (J004 아닐 수 있음):', e);
      // 이 경우 일반적인 에러로 처리하고 반환
    }
  }

  return response;
}