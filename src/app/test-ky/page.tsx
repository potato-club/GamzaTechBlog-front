/**
 * Ky POC 수동 테스트 페이지
 *
 * 브라우저에서 Ky 기반 API 클라이언트를 실제로 테스트합니다.
 * 개발 환경에서만 접근 가능합니다.
 *
 * @route /test-ky
 */

"use client";

import { useState } from "react";
import { kyApiClient } from "@/lib/apiClient.ky-test";
import { apiClient } from "@/lib/apiClient";

interface TestResult {
  name: string;
  status: "✅" | "❌" | "⏳";
  duration?: number;
  data?: unknown;
  error?: string;
}

export default function KyTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runTest = async (name: string, testFn: () => Promise<unknown>) => {
    addResult({ name, status: "⏳" });
    const startTime = performance.now();

    try {
      const data = await testFn();
      const duration = Math.round(performance.now() - startTime);

      setResults((prev) =>
        prev.map((r) =>
          r.name === name && r.status === "⏳" ? { name, status: "✅", duration, data } : r
        )
      );
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : String(error);

      setResults((prev) =>
        prev.map((r) => {
          if (r.name === name && r.status === "⏳") {
            return { name, status: "❌" as const, duration, error: errorMessage };
          }
          return r;
        })
      );
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    // 1. 기본 API 호출 비교
    await runTest("Ky - 프로필 조회", () => kyApiClient.getCurrentUserProfile());
    await runTest("기존 - 프로필 조회", () => apiClient.getCurrentUserProfile());

    // 2. 동시 요청 테스트
    await runTest("Ky - 동시 3개 요청", async () => {
      return Promise.all([
        kyApiClient.getPosts({ page: 1 }),
        kyApiClient.getAllTags(),
        kyApiClient.getCurrentUserProfile(),
      ]);
    });

    await runTest("기존 - 동시 3개 요청", async () => {
      return Promise.all([
        apiClient.getPosts({ page: 1 }),
        apiClient.getAllTags(),
        apiClient.getCurrentUserProfile(),
      ]);
    });

    // 3. 게시글 목록 조회
    await runTest("Ky - 게시글 목록", () => kyApiClient.getPosts({ page: 1 }));
    await runTest("기존 - 게시글 목록", () => apiClient.getPosts({ page: 1 }));

    // 4. 태그 목록 조회
    await runTest("Ky - 태그 목록", () => kyApiClient.getAllTags());
    await runTest("기존 - 태그 목록", () => apiClient.getAllTags());

    setIsRunning(false);
  };

  const testProactiveRefresh = async () => {
    setIsRunning(true);
    clearResults();

    addResult({
      name: "사전 예방적 토큰 갱신 테스트",
      status: "⏳",
    });

    try {
      // 토큰 만료 시간을 30초 후로 설정 (1분 버퍼보다 짧음)
      const expirationTime = Date.now() + 30 * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      // API 호출 (사전 갱신이 발생해야 함)
      await kyApiClient.getCurrentUserProfile();

      setResults((prev) =>
        prev.map((r) =>
          r.name === "사전 예방적 토큰 갱신 테스트"
            ? { ...r, status: "✅" as const, data: "콘솔에서 갱신 로그 확인" }
            : r
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResults((prev) =>
        prev.map((r) =>
          r.name === "사전 예방적 토큰 갱신 테스트"
            ? { ...r, status: "❌" as const, error: errorMessage }
            : r
        )
      );
    }

    setIsRunning(false);
  };

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Ky POC 수동 테스트</h1>
          <p className="text-muted-foreground">
            브라우저 환경에서 Ky 기반 API 클라이언트를 테스트합니다.
          </p>
        </header>

        {/* 테스트 버튼 */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold disabled:opacity-50"
          >
            {isRunning ? "테스트 실행 중..." : "전체 테스트 실행"}
          </button>

          <button
            onClick={testProactiveRefresh}
            disabled={isRunning}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border px-6 py-3 font-semibold disabled:opacity-50"
          >
            사전 갱신 테스트
          </button>

          <button
            onClick={clearResults}
            disabled={isRunning}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border px-6 py-3 font-semibold disabled:opacity-50"
          >
            결과 초기화
          </button>
        </div>

        {/* 테스트 결과 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">테스트 결과</h2>

          {results.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
              테스트를 실행하려면 위 버튼을 클릭하세요.
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{result.status}</span>
                    <span className="font-semibold">{result.name}</span>
                  </div>
                  {result.duration !== undefined && (
                    <span className="text-muted-foreground text-sm">{result.duration}ms</span>
                  )}
                </div>

                {result.data ? (
                  <details className="mt-2">
                    <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
                      데이터 보기
                    </summary>
                    <pre className="bg-muted mt-2 overflow-x-auto rounded p-2 text-xs">
                      {typeof result.data === "string"
                        ? result.data
                        : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                ) : null}

                {result.error && (
                  <div className="bg-destructive/10 text-destructive mt-2 rounded p-2 text-sm">
                    <strong>에러:</strong> {result.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 개발자 정보 */}
        <div className="text-muted-foreground mt-8 rounded-lg border border-dashed p-4 text-sm">
          <h3 className="mb-2 font-semibold">💡 개발자 노트</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>브라우저 개발자 도구의 콘솔에서 상세 로그를 확인하세요.</li>
            <li>Network 탭에서 실제 HTTP 요청을 모니터링할 수 있습니다.</li>
            <li>로그인 상태에서 테스트하면 더 많은 API를 테스트할 수 있습니다.</li>
            <li>사전 갱신 테스트는 토큰 만료 시간을 조작하여 테스트합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
