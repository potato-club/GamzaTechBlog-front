# BFF 마이그레이션 상세 체크리스트 (0~4주차)

이 문서는 BFF 전환을 **파일럿 → 확대** 방식으로 진행하기 위한 실행 체크리스트입니다.  
우선순위 표(P0~P4)에 맞춰 주차별로 쪼갰고, 실제 파일/모듈 기준으로 세분화했습니다.

## 브랜치/커밋 운영 규칙

### 브랜치 명 규칙 (권장)
- 0주차: `refactor/bff-00-foundation`
- P0: `refactor/bff-p0-auth`
- P1: `refactor/bff-p1-write`
  - 필요 시 세분화: `refactor/bff-p1-write-posts`, `refactor/bff-p1-write-comments`, `refactor/bff-p1-write-likes`
- P2: `refactor/bff-p2-personal-reads`
- P4: `refactor/bff-p4-public-reads`
- 마무리: `refactor/bff-cleanup`

### 커밋 단위 규칙 (권장)
- 체크리스트 **1~2개 항목 = 1 커밋** 기준으로 쪼갠다.
- "라우트 1개 추가/변경" 또는 "서비스 1개 전환" 단위로 커밋한다.
- 작은 기능 단위로 커밋하여 롤백 가능성을 높인다.

## 0주차 (준비 단계, P0 진입 전)

**목표:** BFF 경계/규칙 확정, 서버 전용 클라이언트 기반 구축, 전환 기준 문서화

### 0.1 경계 규칙 결정

- [x] RSC vs BFF vs direct 기준을 문서화 (`docs/bff-boundary-rules.md`)
- [x] "인증/쓰기=Server Action 우선, 개인화=서버 전용 모듈 우선" 규칙 확정
- [x] "공개 읽기 경로(RSC/direct) 판단 기준" 확정
- [x] 경계 규칙 요약을 체크리스트/문서에 반영

### 0.2 BFF 경로 구조 확정(필요 시)

- [x] BFF 라우트 루트 결정 (필요 시 `src/app/api/**` 사용)
- [x] 리소스별 라우트 네이밍 규칙 정의
  - 예: `/api/posts/[id]`, `/api/posts/[id]/likes`, `/api/me/profile`
- [x] 엔드포인트별 요청/응답 형태 통일 기준 정의

### 0.3 서버 전용 클라이언트 스켈레톤

- [x] 신규 모듈 이름 확정 (예: `src/lib/serverApiClient.ts`)
- [x] `cookies()` 기반 쿠키 주입 방식 결정
- [x] 공통 fetch wrapper 설계
  - 타임아웃, 에러 변환, JSON 파싱 실패 처리
- [x] 서버 전용 모듈임을 명확히 표시
  - 예: `import "server-only"` 사용 여부 결정

### 0.4 에러/응답 표준화

- [x] 공통 응답 포맷 결정 (예: `{ success, data, error }`)
- [x] 공통 에러 타입/매핑 규칙 정의
- [x] BFF에서 반환할 HTTP 상태 코드 규칙 정의

### 0.5 인벤토리/맵핑

- [x] 현재 API 호출 경로 인벤토리 작성 (`docs/issues/bff-migration-inventory.md`)
  - `src/features/**/services/*`
  - `src/features/**/hooks/*`
  - `src/features/**/actions/*`
- [x] P0/P1/P2/P4 매핑 테이블 작성
  - 인증/쓰기/개인화/공개 읽기 분류
- [x] 기존 `apiClient` 사용처 목록화

### 0.6 롤백/검증 계획

- [x] fallback 전략 결정 (기존 경로 유지/제거 기준) (`docs/bff-fallback-plan.md`)
- [x] 롤백 기준 정의 (실패 조건/복구 절차)
- [x] 기본 회귀 시나리오 체크리스트 작성 (`docs/bff-regression-checklist.md`)

## 1주차 (P0: 인증/세션 파일럿)

**목표:** 인증/세션 흐름을 Server Action + 필요한 라우트로 정리하고 안정화

### 1.1 인증 라우트/액션 구축

- [x] 로그인은 OAuth 링크 리다이렉트로 유지 (BFF 라우트 없음)
- [x] 로그아웃을 Server Action으로 전환 (`src/features/auth/actions/logoutAction.ts`)
- [x] `src/app/api/auth/reissue/route.ts` 구현
- [x] 백엔드 인증 API 호출과 쿠키 전달 확인

### 1.2 프론트 인증 호출 전환

- [x] `src/features/auth/services/authService.ts`를 Server Action 경로로 전환
- [x] `src/lib/apiClient.ts`의 재발급 경로가 BFF를 사용하도록 정리
- [x] 기존 인증 호출 경로 fallback 여부 확정

### 1.3 클라이언트 토큰 접근 정리

- [x] `src/providers/Providers.tsx`에서 쿠키 직접 접근 점검
- [x] HttpOnly 쿠키 접근 로직 제거/대체 여부 결정
- [x] `src/lib/tokenManager.ts`의 삭제/만료 처리 정책 재확인

### 1.4 인증 예외 처리 규칙

- [x] 401/403 표준 처리 규칙 확정
- [x] 인증 실패 시 UI 정책 합의 (리다이렉트/토스트 등)

### 1.5 회귀 테스트

- [x] 로그인 성공/실패
- [x] 만료 시 재발급 성공/실패
- [x] 로그아웃 후 세션 정리

## 2주차 (P1: 쓰기/변경 전환)

**목표:** 쓰기/변경 요청을 Server Action으로 통일하고 클라이언트 직접 호출 축소

### 2.1 게시글 쓰기 정리

- [x] `src/features/posts/actions/postActions.ts` 기준 BFF/Server Action 방식 통일
- [x] 게시글 생성/수정/삭제 요청을 Server Action으로 통합
- [x] `revalidate` 규칙(경로/태그) 정리

### 2.2 좋아요 쓰기 전환

- [x] 좋아요 CUD를 Server Action으로 전환
- [x] `src/features/posts/services/likeService.ts` 쓰기 경로 정리
- [x] `src/features/posts/hooks/useLikeMutations.ts` 연결 경로 교체

### 2.3 댓글 쓰기 전환

- [x] 댓글 CUD를 Server Action으로 전환
- [x] `src/features/comments/services/commentService.ts` 쓰기 경로 정리
- [x] `src/features/comments/hooks/useCommentMutations.ts` 연결 경로 교체

### 2.4 이미지 업로드 전환

- [x] 업로드 경로를 Server Action으로 처리할지 `/api` 유지할지 결정
- [x] `src/features/posts/services/imageService.ts` 처리 방식 정리
- [x] 업로드 실패 시 에러 메시지 규칙 확정

### 2.5 소개글/관리자 쓰기 전환

- [ ] `src/features/intro/services/introService.ts` → Server Action 전환
- [ ] `src/features/admin/services/adminService.ts` → Server Action 전환
- [ ] 관련 훅(`useIntroMutations`, `useAdminQueries`) 경로 교체

### 2.6 React Query 간소화(쓰기 영역)

- [ ] 낙관적 업데이트 제거 여부 결정
- [ ] `onSuccess` 기반 invalidate/refetch로 단순화
- [ ] `withOptimisticUpdate` 사용처 제거 계획 확정

### 2.7 회귀 테스트

- [ ] 게시글/댓글/좋아요 CRUD
- [ ] 업로드 성공/실패
- [ ] 권한 없는 사용자 처리

## 3주차 (P2: 개인화 읽기 전환)

**목표:** 개인화 데이터는 서버 경유로 통일하고 캐시 누수 방지

### 3.1 개인화 읽기 경로 정리

- [ ] 프로필/역할/활동 통계는 서버 전용 모듈(RSC) 우선
- [ ] 내 글/내 댓글/내 좋아요는 서버 전용 모듈(RSC) 우선

### 3.2 훅/서비스 전환

- [ ] `src/features/user/services/userService.ts`를 서버 전용 경로 우선으로 정리
- [ ] `src/features/user/hooks/useUserQueries.ts` 경로 교체
- [ ] `src/features/user/hooks/useMyPageQueries.ts` 경로 교체

### 3.3 캐시/동적 렌더링 정책

- [ ] 개인화 요청 `no-store` 적용 기준 확정
- [ ] `cookies()` 사용하는 페이지 `force-dynamic` 여부 점검

### 3.4 클라이언트 읽기 축소

- [ ] 서버에서 받은 데이터는 클라이언트에서 재요청하지 않도록 정리
- [ ] 필요 시 `initialData` 또는 prop 전달 방식 결정

### 3.5 회귀 테스트

- [ ] 로그인 사용자 개인화 데이터 노출
- [ ] 비로그인 사용자 처리

## 4주차 (P4: 공개 읽기 정리)

**목표:** 공개 읽기 경로 최종 결정(RSC/direct), 중복 호출 제거

### 4.1 공개 읽기 경로 결정

- [ ] 홈/목록/상세는 RSC vs direct 중 선택 확정
- [ ] `src/app/page.tsx`/`src/app/(content)/posts/[id]/page.tsx` 기준 정리

### 4.2 중복 fetch 제거

- [ ] 서버에서 받은 데이터는 클라이언트에서 재요청하지 않도록 정리
  - `src/features/posts/components/PostCommentsSection.tsx`
  - `src/features/posts/components/InteractivePostList.tsx`
- [ ] `src/features/posts/hooks/usePostQueries.ts` 사용 범위 재정의

### 4.3 캐시 전략 정리

- [ ] ISR/SSG/`revalidate` 기준 문서화
- [ ] 공개 데이터 캐시 정책 확정

### 4.4 Hydration/Prefetch 단순화

- [ ] `src/features/posts/services/hydration.server.ts` 유지 여부 결정
- [ ] 불필요한 RQ prefetch 제거 여부 검토

### 4.5 회귀 테스트

- [ ] 목록/상세 로딩 성능 확인
- [ ] SEO 메타데이터 정확성 확인

## 마무리 체크리스트

- [ ] 기존 `apiClient` 사용처 제거 계획 실행
- [ ] 남아있는 React Query 훅 최소화(필수 인터랙션만 유지)
- [ ] 문서 업데이트(경계 규칙, 호출 방식, 에러 규칙)
- [ ] 전체 회귀 테스트 체크리스트 업데이트 및 수행
- [ ] 좋아요/댓글 폴더 구조 통일 여부 결정 (likes 위치 정리)
- [ ] RSC 전환 완료 후 클라이언트 read 서비스 제거 여부 점검
- [ ] server/shared 서비스도 직접 fetch로 대체할지 최종 결정
- [ ] BFF 공통 프록시 통합 여부 결정 (cleanup 단계로 이월)
