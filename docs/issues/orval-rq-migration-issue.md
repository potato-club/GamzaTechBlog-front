# [refactor] OpenAPI Generator → Orval + React Query 마이그레이션

## 🛠 작업 내용

OpenAPI Generator에서 Orval로 API 클라이언트 생성 도구를 마이그레이션하고, React Query Hydration 패턴을 도입하여 Optimistic UX를 개선합니다.

### 주요 변경 사항

1. **Orval 도입**: OpenAPI spec에서 타입 안전한 API 클라이언트 + RQ 훅 자동 생성
2. **React Query Hydration 패턴**: 서버 컴포넌트에서 prefetch → 클라이언트 캐시에 hydrate
3. **Optimistic Updates**: 좋아요, 댓글 등 사용자 상호작용에 즉각적인 UI 반응
4. **기존 코드 정리**: OpenAPI Generator 및 레거시 훅 제거

## 🤷‍♂️ 이유 (Why)

1. **UX 개선**: 현재 Server Action 기반 mutation은 서버 응답까지 UI가 대기함. Optimistic Update로 즉각적인 피드백 제공.
2. **개발 생산성**: Orval이 타입 안전한 훅을 자동 생성하여 보일러플레이트 감소.
3. **유지보수성**: API 스펙 변경 시 `yarn gen:orval` 한 번으로 클라이언트 코드 자동 업데이트.

## ✅ 체크리스트

### Phase 1: 기반 설정

- [x] Orval 및 TanStack Query 의존성 추가
- [x] Custom Fetcher 구현 (`orvalFetcher.ts`)
- [x] QueryClientProvider 및 Hydration 설정
- [x] Orval 코드 생성

### Phase 2: 기능별 마이그레이션

- [x] Posts 읽기 Hydration 적용
- [x] Posts Mutation 마이그레이션
- [x] Likes Mutation 마이그레이션 (Optimistic UX)
- [x] Comments 마이그레이션
- [x] User/Profile 마이그레이션
- [x] Admin 기능 마이그레이션
- [x] Chatbot 마이그레이션

### Phase 3: 정리

- [x] 기존 OpenAPI Generator 코드 제거 (`src/generated/api/`)
- [ ] 레거시 훅 정리
- [x] 문서 업데이트 (CLAUDE.md, README.md)

### 검증

- [x] 기존 기능이 정상 동작하는지 확인 (Regression Test)
- [x] 빌드 성공 확인
- [ ] Optimistic Update 동작 확인

## 📆 예상 일정

- 2025.01.20 까지 완료 예정 (약 5-7일)
