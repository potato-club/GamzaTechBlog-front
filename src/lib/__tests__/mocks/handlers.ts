/**
 * MSW 핸들러 - API 모킹
 *
 * 테스트 환경에서 API 호출을 가로채고 모킹된 응답을 반환합니다.
 */

import { http, HttpResponse, delay } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const handlers = [
  // --- 정상 응답 ---

  // 프로필 조회
  http.get(`${BASE_URL}/api/users/me`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        username: "testuser",
        name: "테스트 유저",
        email: "test@example.com",
      },
    });
  }),

  // 게시글 목록 조회
  http.get(`${BASE_URL}/api/posts`, () => {
    return HttpResponse.json({
      data: {
        content: [
          { id: 1, title: "테스트 게시글 1" },
          { id: 2, title: "테스트 게시글 2" },
        ],
        totalPages: 1,
        totalElements: 2,
      },
    });
  }),

  // 태그 목록 조회
  http.get(`${BASE_URL}/api/tags`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "JavaScript" },
        { id: 2, name: "TypeScript" },
      ],
    });
  }),

  // --- 토큰 재발급 ---

  // 토큰 재발급 성공
  http.post(`${BASE_URL}/api/auth/reissue`, () => {
    return HttpResponse.json({
      data: {
        authorization: "new.mock.token.here",
      },
    });
  }),

  // --- 에러 시나리오 (테스트별로 override 사용) ---

  // 401 에러 (토큰 만료) - 기본 핸들러는 성공으로 설정
  http.get(`${BASE_URL}/api/protected-endpoint`, () => {
    return HttpResponse.json({
      data: { message: "Protected data" },
    });
  }),

  // 503 에러 (일시적 네트워크 오류)
  http.get(`${BASE_URL}/api/flaky-endpoint`, async () => {
    await delay(100);
    return HttpResponse.json({ message: "Service Unavailable" }, { status: 503 });
  }),
];
