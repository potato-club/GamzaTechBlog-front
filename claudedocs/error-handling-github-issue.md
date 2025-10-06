# 에러 처리 체계 개선

## 📌 문제 요약

프로젝트 전반에 걸쳐 **에러 처리가 일관성 없고 불완전**하여, 사용자 경험 저하 및 디버깅 어려움이 발생하고 있습니다.

## 🔴 주요 문제점

### 1. Service 레이어 에러 처리 부재
- 모든 Service 함수에 try-catch 없음
- API 호출 실패 시 에러가 그대로 전파됨
- Type assertion (`as`) 사용으로 런타임 에러 위험

```typescript
// ❌ 현재
async getPostById(postId: number): Promise<PostDetailResponse> {
  const response = await api.getPostDetail({ postId });
  return response.data as PostDetailResponse;
}

// ✅ 개선 필요
async getPostById(postId: number): Promise<PostDetailResponse> {
  try {
    const response = await api.getPostDetail({ postId });
    if (!response.data) throw new ServiceError('No data');
    return response.data;
  } catch (error) {
    throw new ServiceError('게시글 조회 실패', error);
  }
}
```

### 2. Error Boundary 없음
- `error.tsx`, `ErrorBoundary` 컴포넌트 미존재
- React 에러 발생 시 앱 전체 크래시
- Fallback UI 없음

### 3. 에러 타입 구분 없음
- 네트워크/인증/서버/검증 에러 구분 안됨
- 사용자에게 적절한 안내 불가

### 4. 사용자 피드백 부족
- `alert()` 사용 (나쁜 UX)
- `console.error`만 사용 (사용자 확인 불가)
- Toast/Snackbar 같은 현대적 패턴 미사용

### 5. API 클라이언트 일관성 부족
- null 반환과 throw 혼재
- 에러 처리 로직이 함수마다 다름

## 🎯 해결 방안

### Phase 1: 긴급 수정 (1-2주)

**1. Error Boundary 추가**
```bash
app/error.tsx
app/(content)/error.tsx
components/ErrorBoundary.tsx
```

**2. 커스텀 에러 클래스 정의**
```bash
lib/errors.ts
  - AppError
  - NetworkError
  - AuthError
  - ValidationError
  - ServiceError
```

**3. Service 레이어 에러 처리**
```bash
features/*/services/*.ts
  - try-catch 추가
  - 커스텀 에러 throw
  - Type assertion 제거
```

### Phase 2: 중요 개선 (2-3주)

**4. React Query 글로벌 에러 핸들러**
```typescript
// providers/Providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { onError: handleGlobalError },
    mutations: { onError: handleGlobalError }
  }
});
```

**5. Toast 기반 사용자 피드백**
```bash
- alert() → Toast 대체
- 에러 메시지 유틸리티 구현
- 에러별 적절한 메시지 표시
```

**6. API 클라이언트 표준화**
```bash
- null 반환 제거 → throw로 통일
- 일관된 에러 처리 패턴 적용
```

### Phase 3: 장기 개선 (1-2개월)

**7. 에러 복구 전략**
- 스마트 재시도 로직
- Fallback UI
- 오프라인 감지

**8. 에러 모니터링**
- Sentry 설정
- 에러 로깅 시스템

**9. 일관된 에러 UI**
- ErrorDisplay 컴포넌트
- 모든 컴포넌트 에러 UI 적용

## 📝 체크리스트

### Phase 1 (필수)
- [ ] `app/error.tsx` 생성
- [ ] `lib/errors.ts` 커스텀 에러 클래스 정의
- [ ] `postService.shared.ts` 에러 처리 추가
- [ ] `commentService.ts` 에러 처리 추가
- [ ] `authService.ts` 에러 처리 추가
- [ ] 기타 Service 파일 에러 처리 추가

### Phase 2 (중요)
- [ ] `Providers.tsx` 글로벌 에러 핸들러 추가
- [ ] Toast 컴포넌트 설정
- [ ] `alert()` 제거 및 Toast로 대체
- [ ] `apiClient.ts` 에러 처리 표준화
- [ ] 자동 재시도 전략 구현

### Phase 3 (개선)
- [ ] Sentry 설정
- [ ] `ErrorDisplay` 공통 컴포넌트 구현
- [ ] 모든 컴포넌트 에러 UI 적용
- [ ] Fallback UI 구현
- [ ] 에러 대시보드 설정

## 📂 영향 받는 파일

### 수정 필요
```
src/lib/apiClient.ts
src/features/posts/services/postService.shared.ts
src/features/comments/services/commentService.ts
src/features/auth/services/authService.ts
src/features/admin/services/adminService.ts
src/features/user/services/userService.ts
src/providers/Providers.tsx
```

### 신규 생성
```
app/error.tsx
lib/errors.ts
components/shared/ErrorDisplay.tsx
components/ErrorBoundary.tsx
lib/error-handlers.ts
```

## 🔗 참고 자료

- [상세 분석 문서](./error-handling-analysis.md)
- [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TanStack Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-errors)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

## 💬 논의 사항

1. **우선순위**: Phase 1부터 순차적으로 진행할지, 특정 부분 우선 처리할지?
2. **에러 모니터링**: Sentry vs 다른 도구?
3. **Toast 라이브러리**: shadcn/ui Toast vs 다른 라이브러리?
4. **담당자**: Phase별 담당자 배정

---

**예상 작업 기간**: 총 4-6주
**우선순위**: High (사용자 경험 및 안정성에 직접적 영향)
