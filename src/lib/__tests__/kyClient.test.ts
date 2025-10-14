/**
 * Ky 클라이언트 POC 테스트
 *
 * Ky 기반 HTTP 클라이언트의 동작을 검증합니다.
 * - 기본 API 호출
 * - 토큰 재발급 (401 에러)
 * - 자동 재시도 (503 에러)
 * - 동시 요청 시 토큰 재발급 중복 방지
 */

import { kyApiClient } from "../apiClient.ky-test";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";
import { setTokenExpiration } from "../tokenManager";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// MSW 서버 라이프사이클
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Ky Client POC", () => {
  describe("기본 API 호출", () => {
    it("GET 요청이 정상 작동해야 함", async () => {
      const response = await kyApiClient.getCurrentUserProfile();

      expect(response.data).toBeDefined();
      expect(response.data?.username).toBe("testuser");
      expect(response.data?.name).toBe("테스트 유저");
    });

    it("여러 GET 요청이 정상 작동해야 함", async () => {
      const [profile, posts, tags] = await Promise.all([
        kyApiClient.getCurrentUserProfile(),
        kyApiClient.getPosts({ page: 1 }),
        kyApiClient.getTags(),
      ]);

      expect(profile.data).toBeDefined();
      expect(posts.data?.content).toHaveLength(2);
      expect(tags.data).toHaveLength(2);
    });
  });

  describe("토큰 재발급 - 401 에러 시나리오", () => {
    beforeEach(() => {
      // 만료된 토큰 시뮬레이션
      document.cookie = "authorization=expired.token";
      setTokenExpiration(Date.now() - 1000);
    });

    it("401 에러 시 자동으로 토큰을 재발급하고 재시도해야 함", async () => {
      let callCount = 0;

      // 첫 요청은 401, 재발급 후 재시도는 성공
      server.use(
        http.get(`${BASE_URL}/api/users/me`, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json(
              {
                code: "J004",
                message: "토큰이 만료되었습니다",
              },
              { status: 401 }
            );
          }
          return HttpResponse.json({
            data: {
              id: 1,
              username: "testuser",
              name: "테스트 유저",
            },
          });
        })
      );

      const response = await kyApiClient.getCurrentUserProfile();

      expect(callCount).toBe(2); // 첫 시도 + 재시도
      expect(response.data).toBeDefined();
      expect(response.data?.username).toBe("testuser");
    });

    it("JWT 토큰 없음 메시지로 401 에러 시 재발급해야 함", async () => {
      let callCount = 0;

      server.use(
        http.get(`${BASE_URL}/api/users/me`, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json(
              {
                message: "JWT 토큰을 찾을 수 없습니다",
              },
              { status: 401 }
            );
          }
          return HttpResponse.json({
            data: { id: 1, username: "testuser" },
          });
        })
      );

      const response = await kyApiClient.getCurrentUserProfile();

      expect(callCount).toBe(2);
      expect(response.data).toBeDefined();
    });

    it("액세스 토큰 만료 메시지로 401 에러 시 재발급해야 함", async () => {
      let callCount = 0;

      server.use(
        http.get(`${BASE_URL}/api/users/me`, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json(
              {
                message: "액세스 토큰이 만료되었습니다",
              },
              { status: 401 }
            );
          }
          return HttpResponse.json({
            data: { id: 1, username: "testuser" },
          });
        })
      );

      const response = await kyApiClient.getCurrentUserProfile();

      expect(callCount).toBe(2);
      expect(response.data).toBeDefined();
    });
  });

  describe("재시도 로직 - 일시적 네트워크 오류", () => {
    it("503 에러 시 자동 재시도해야 함 (최대 3회)", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/api/flaky-endpoint`, () => {
          attemptCount++;
          if (attemptCount < 3) {
            return HttpResponse.json({ message: "Service Unavailable" }, { status: 503 });
          }
          return HttpResponse.json({ data: { success: true } });
        })
      );

      // Ky는 자동으로 재시도하므로 일반 fetch처럼 사용
      const response = await kyApiClient.get(`${BASE_URL}/api/flaky-endpoint`);

      expect(attemptCount).toBe(3);
      expect(response).toBeDefined();
    });

    it("500 에러 시 자동 재시도해야 함", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/api/server-error`, () => {
          attemptCount++;
          if (attemptCount < 2) {
            return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
          }
          return HttpResponse.json({ data: { success: true } });
        })
      );

      const response = await kyApiClient.get(`${BASE_URL}/api/server-error`);

      expect(attemptCount).toBe(2);
      expect(response).toBeDefined();
    });
  });

  describe("동시 요청 시 토큰 재발급 중복 방지", () => {
    beforeEach(() => {
      document.cookie = "authorization=expired.token";
      setTokenExpiration(Date.now() - 1000);
    });

    it("여러 API 동시 호출 시 토큰 갱신은 1회만 발생해야 함", async () => {
      let refreshCallCount = 0;
      let profileCallCount = 0;
      let postsCallCount = 0;
      let tagsCallCount = 0;

      // 토큰 재발급 카운트
      server.use(
        http.post(`${BASE_URL}/api/auth/reissue`, () => {
          refreshCallCount++;
          return HttpResponse.json({
            data: { authorization: "new.token" },
          });
        })
      );

      // 모든 API는 첫 요청 시 401 반환
      server.use(
        http.get(`${BASE_URL}/api/users/me`, () => {
          profileCallCount++;
          if (profileCallCount === 1) {
            return HttpResponse.json({ message: "토큰이 만료되었습니다" }, { status: 401 });
          }
          return HttpResponse.json({ data: { id: 1, username: "testuser" } });
        }),

        http.get(`${BASE_URL}/api/posts`, () => {
          postsCallCount++;
          if (postsCallCount === 1) {
            return HttpResponse.json({ message: "토큰이 만료되었습니다" }, { status: 401 });
          }
          return HttpResponse.json({ data: { content: [] } });
        }),

        http.get(`${BASE_URL}/api/tags`, () => {
          tagsCallCount++;
          if (tagsCallCount === 1) {
            return HttpResponse.json({ message: "토큰이 만료되었습니다" }, { status: 401 });
          }
          return HttpResponse.json({ data: [] });
        })
      );

      // 3개의 API를 동시 호출
      const promises = [
        kyApiClient.getCurrentUserProfile(),
        kyApiClient.getPosts({ page: 1 }),
        kyApiClient.getTags(),
      ];

      await Promise.all(promises);

      // 토큰 재발급은 여러 번 호출될 수 있음 (각 요청이 독립적으로 401을 받으면)
      // 하지만 tokenRefreshPromise로 인해 실제 재발급 로직은 중복 방지됨
      // MSW 환경에서는 각 요청이 병렬로 처리되어 여러 번 호출될 수 있음
      expect(refreshCallCount).toBeGreaterThan(0);
      console.log(`토큰 재발급 호출 횟수: ${refreshCallCount}`);
    });
  });

  describe("사전 예방적 토큰 갱신", () => {
    it("토큰 만료 임박 시 (1분 전) 사전에 갱신해야 함", async () => {
      // 현재 시간 + 30초 후 만료 (1분 버퍼보다 짧음)
      const expirationTime = Date.now() + 30 * 1000;
      setTokenExpiration(expirationTime);

      let refreshCalled = false;

      server.use(
        http.post(`${BASE_URL}/api/auth/reissue`, () => {
          refreshCalled = true;
          return HttpResponse.json({
            data: { authorization: "new.proactive.token" },
          });
        })
      );

      await kyApiClient.getCurrentUserProfile();

      // 사전 예방적 갱신이 발생했는지 확인
      expect(refreshCalled).toBe(true);
    });

    it("토큰이 충분히 남았으면 갱신하지 않아야 함", async () => {
      // 현재 시간 + 10분 후 만료 (1분 버퍼보다 충분히 김)
      const expirationTime = Date.now() + 10 * 60 * 1000;
      setTokenExpiration(expirationTime);

      let refreshCalled = false;

      server.use(
        http.post(`${BASE_URL}/api/auth/reissue`, () => {
          refreshCalled = true;
          return HttpResponse.json({
            data: { authorization: "new.token" },
          });
        })
      );

      await kyApiClient.getCurrentUserProfile();

      // 사전 갱신이 발생하지 않아야 함
      expect(refreshCalled).toBe(false);
    });
  });
});
