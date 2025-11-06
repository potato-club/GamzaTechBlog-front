# 서버 API 분리 마이그레이션 계획

## 📋 목차
- [개요](#개요)
- [현재 문제점](#현재-문제점)
- [개선 방안](#개선-방안)
- [커밋 단위별 실행 계획](#커밋-단위별-실행-계획)
- [최종 구조](#최종-구조)
- [기대 효과](#기대-효과)

---

## 개요

현재 프로젝트는 클라이언트 API 호출은 잘 분리되어 있으나, 서버 API 호출 구조가 일관되지 않고 클라이언트용 Service를 서버에서 사용하는 문제가 있습니다. 이를 **Factory Pattern with Shared Logic** 방식으로 개선하여 깔끔한 분리와 일관성을 확보합니다.

---

## 현재 문제점

### ✅ 클라이언트 API 구조 (잘 되어 있음)
- `apiClient` (토큰 재발급, 요청 큐잉 등 복잡한 로직)
- 각 feature별 Service 파일 (postService, userService 등)
- 일관된 패턴으로 구성

### ❌ 서버 API 구조 (문제점)

1. **서버용 Service 레이어 없음**
   - `createServerApiClient()` 팩토리 함수만 존재
   - Service 레이어가 없어 일관성 부족

2. **서버 컴포넌트에서 클라이언트용 Service 사용** (잘못됨)
   - `app/page.tsx`: `postService.getHomeFeed()` 호출
   - `app/(content)/posts/[id]/page.tsx`: `postService.getPostById()` 호출
   - 서버 환경에서 클라이언트 전용 로직(토큰 재발급 등) 불필요하게 실행

3. **서버 컴포넌트에서 API 클라이언트 직접 호출** (일관성 부족)
   - `app/(content)/posts/[id]/page.tsx`: `createServerApiClient()` 직접 호출
   - `MyPageSidebar.server.tsx`: `createServerApiClient()` 직접 호출
   - Service 레이어를 거치지 않아 추상화 부족

---

## 개선 방안

### **Factory Pattern with Shared Logic**

#### 핵심 아이디어
```
공통 로직 (*.shared.ts)
    ↓
    ├── 클라이언트용 Service (*.ts) → apiClient 사용
    └── 서버용 Service (*.server.ts) → createServerApiClient() 사용
```

#### 장점
1. ✅ **로직 중복 완전 제거** - 공통 로직을 한 곳에서 관리
2. ✅ **타입 안정성 100% 유지** - TypeScript 타입 추론 완벽
3. ✅ **테스트 용이성** - Dependency Injection 가능
4. ✅ **번들 최적화** - 서버/클라이언트 코드 명확히 분리
5. ✅ **일관된 인터페이스** - 동일한 메서드 시그니처
6. ✅ **확장 가능** - 새로운 환경 추가 쉬움

---

## 커밋 단위별 실행 계획

### 🎯 Phase 1: Post Service 리팩토링 (최우선)

#### **Commit 1: Post Service 공통 로직 추출**
```bash
브랜치: refactor/post-service-shared-logic
커밋 메시지: refactor: Post Service 공통 로직 추출

- postService.shared.ts 생성 및 팩토리 함수 구현
- 기존 postService.ts의 모든 메서드를 createPostService()로 이동
- 타입 정의 정리 및 JSDoc 추가
```

**변경 파일:**
- ✅ `src/features/posts/services/postService.shared.ts` (신규)

**작업 내용:**
1. `postService.shared.ts` 생성
2. `createPostService(api: DefaultApi)` 팩토리 함수 구현
3. 기존 postService의 모든 메서드 이동:
   - getPosts()
   - getPostById()
   - getPopularPosts()
   - getPostsByTag()
   - getTags()
   - createPost()
   - getUserPosts()
   - deletePost()
   - getUserLikes()
   - updatePost()
   - searchPosts()
   - getHomeFeed()
   - getSidebarData()
4. 타입 import 정리
5. JSDoc 문서화

---

#### **Commit 2: 클라이언트 Post Service 리팩토링**
```bash
브랜치: refactor/post-service-shared-logic
커밋 메시지: refactor: 클라이언트 Post Service를 팩토리 패턴으로 리팩토링

- postService.ts를 createPostService() 사용하도록 수정
- 기존 import 경로 유지로 하위 호환성 보장
- 클라이언트 컴포넌트 동작 검증
```

**변경 파일:**
- ♻️ `src/features/posts/services/postService.ts` (수정)

**작업 내용:**
1. `postService.ts` 전체 리팩토링:
```typescript
import { apiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

export const postService = createPostService(apiClient);
```
2. 기존 export 유지 (하위 호환성)
3. 클라이언트 컴포넌트에서 정상 작동 확인

---

#### **Commit 3: 서버 Post Service 생성**
```bash
브랜치: refactor/post-service-shared-logic
커밋 메시지: feat: 서버 전용 Post Service 추가

- postService.server.ts 생성
- createPostServiceServer() 팩토리 함수 구현
- 서버 환경에서 사용 가능한 API 서비스 제공
```

**변경 파일:**
- ✅ `src/features/posts/services/postService.server.ts` (신규)

**작업 내용:**
1. `postService.server.ts` 생성:
```typescript
import { createServerApiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

/**
 * 서버 컴포넌트용 Post Service 팩토리
 */
export const createPostServiceServer = () => {
  return createPostService(createServerApiClient());
};
```
2. JSDoc 문서화
3. export 타입 정의

---

#### **Commit 4: 홈페이지 서버 컴포넌트 마이그레이션**
```bash
브랜치: refactor/post-service-shared-logic
커밋 메시지: refactor: 홈페이지에서 서버 Post Service 사용

- app/page.tsx를 서버 Post Service로 마이그레이션
- 클라이언트용 Service 대신 서버용 Service 사용
- ISR 캐싱 전략 유지
```

**변경 파일:**
- ♻️ `src/app/page.tsx` (수정)

**작업 내용:**
1. import 수정:
```typescript
// Before
import { postService } from "@/features/posts";

// After
import { createPostServiceServer } from "@/features/posts/services/postService.server";
```

2. 서버 컴포넌트 로직 수정:
```typescript
export default async function Home({ searchParams }) {
  // ...
  const postService = createPostServiceServer();
  const homeFeedData = await postService.getHomeFeed(...);
  // ...
}
```

---

#### **Commit 5: 게시글 상세 페이지 마이그레이션**
```bash
브랜치: refactor/post-service-shared-logic
커밋 메시지: refactor: 게시글 상세 페이지에서 서버 Post Service 사용

- posts/[id]/page.tsx를 서버 Post Service로 마이그레이션
- getCachedPost 함수 내부 로직 개선
- createServerApiClient() 직접 호출 대신 Service 레이어 사용
```

**변경 파일:**
- ♻️ `src/app/(content)/posts/[id]/page.tsx` (수정)

**작업 내용:**
1. import 추가:
```typescript
import { createPostServiceServer } from "@/features/posts/services/postService.server";
```

2. getCachedPost 함수 수정:
```typescript
const getCachedPost = cache(async (postId: number) => {
  const postService = createPostServiceServer();
  return await postService.getPostById(postId, { next: { revalidate: 86400 } });
});
```

3. 서버 API 직접 호출 부분 개선 (line 130):
```typescript
// Before
const serverApiClient = createServerApiClient();
const userProfile = await serverApiClient.getCurrentUserProfile();

// After - User Service 생성 후 수정 예정 (Phase 2에서 처리)
```

---

### 🎯 Phase 2: User Service 리팩토링

#### **Commit 6: User Service 공통 로직 추출**
```bash
브랜치: refactor/user-service-shared-logic
커밋 메시지: refactor: User Service 공통 로직 추출

- userService.shared.ts 생성 및 팩토리 함수 구현
- 기존 userService.ts의 모든 메서드를 createUserService()로 이동
- 타입 정의 정리 및 JSDoc 추가
```

**변경 파일:**
- ✅ `src/features/user/services/userService.shared.ts` (신규)

**작업 내용:**
1. `userService.shared.ts` 생성
2. `createUserService(api: DefaultApi)` 팩토리 함수 구현
3. 모든 메서드 이동 및 타입 정리

---

#### **Commit 7: 클라이언트 User Service 리팩토링 및 서버 Service 추가**
```bash
브랜치: refactor/user-service-shared-logic
커밋 메시지: refactor: User Service를 팩토리 패턴으로 리팩토링 및 서버 Service 추가

- userService.ts를 createUserService() 사용하도록 수정
- userService.server.ts 생성
- 서버/클라이언트 환경 모두 지원
```

**변경 파일:**
- ♻️ `src/features/user/services/userService.ts` (수정)
- ✅ `src/features/user/services/userService.server.ts` (신규)

---

#### **Commit 8: MyPageSidebar 서버 컴포넌트 마이그레이션**
```bash
브랜치: refactor/user-service-shared-logic
커밋 메시지: refactor: MyPageSidebar에서 서버 User Service 사용

- MyPageSidebar.server.tsx를 서버 User Service로 마이그레이션
- createServerApiClient() 직접 호출 대신 Service 레이어 사용
- 코드 가독성 및 일관성 개선
```

**변경 파일:**
- ♻️ `src/features/user/components/mypage/MyPageSidebar.server.tsx` (수정)

**작업 내용:**
1. import 수정:
```typescript
import { createUserServiceServer } from "@/features/user/services/userService.server";
```

2. API 호출 로직 수정:
```typescript
// Before
const api = createServerApiClient();
userProfile = (await api.getCurrentUserProfile()).data || null;
activityStats = (await api.getActivitySummary()).data || null;

// After
const userService = createUserServiceServer();
userProfile = await userService.getCurrentUserProfile();
activityStats = await userService.getActivitySummary();
```

---

#### **Commit 9: MyPage 및 게시글 상세 페이지 User Service 적용**
```bash
브랜치: refactor/user-service-shared-logic
커밋 메시지: refactor: MyPage 및 게시글 상세 페이지에서 서버 User Service 사용

- app/(dashboard)/mypage/page.tsx 마이그레이션
- app/(content)/posts/[id]/page.tsx의 사용자 프로필 조회 로직 개선
- 모든 서버 컴포넌트에서 일관된 Service 레이어 사용
```

**변경 파일:**
- ♻️ `src/app/(dashboard)/mypage/page.tsx` (수정)
- ♻️ `src/app/(content)/posts/[id]/page.tsx` (수정)

---

### 🎯 Phase 3: 나머지 Services 리팩토링

#### **Commit 10: Comment Service 리팩토링**
```bash
브랜치: refactor/comment-service-shared-logic
커밋 메시지: refactor: Comment Service를 팩토리 패턴으로 리팩토링

- commentService.shared.ts 생성
- commentService.server.ts 추가
- 클라이언트 Service 리팩토링
```

**변경 파일:**
- ✅ `src/features/comments/services/commentService.shared.ts` (신규)
- ♻️ `src/features/comments/services/commentService.ts` (수정)
- ✅ `src/features/comments/services/commentService.server.ts` (신규)

---

#### **Commit 11: Admin Service 리팩토링**
```bash
브랜치: refactor/admin-service-shared-logic
커밋 메시지: refactor: Admin Service를 팩토리 패턴으로 리팩토링

- adminService.shared.ts 생성
- adminService.server.ts 추가
- 클라이언트 Service 리팩토링
```

**변경 파일:**
- ✅ `src/features/admin/services/adminService.shared.ts` (신규)
- ♻️ `src/features/admin/services/adminService.ts` (수정)
- ✅ `src/features/admin/services/adminService.server.ts` (신규)

---

#### **Commit 12: 기타 Services 리팩토링 (일괄)**
```bash
브랜치: refactor/other-services-shared-logic
커밋 메시지: refactor: Image, Like, Intro, ChatBot Service를 팩토리 패턴으로 리팩토링

- 모든 Service에 공통 로직 추출 패턴 적용
- 서버용 Service 생성
- 일관된 구조로 통일
```

**변경 파일:**
- ✅ `src/features/posts/services/imageService.shared.ts` (신규)
- ✅ `src/features/posts/services/imageService.server.ts` (신규)
- ♻️ `src/features/posts/services/imageService.ts` (수정)
- ✅ `src/features/posts/services/likeService.shared.ts` (신규)
- ✅ `src/features/posts/services/likeService.server.ts` (신규)
- ♻️ `src/features/posts/services/likeService.ts` (수정)
- ✅ `src/features/intro/services/introService.shared.ts` (신규)
- ✅ `src/features/intro/services/introService.server.ts` (신규)
- ♻️ `src/features/intro/services/introService.ts` (수정)
- ✅ `src/features/chatbot/services/chatBotService.shared.ts` (신규)
- ✅ `src/features/chatbot/services/chatBotService.server.ts` (신규)
- ♻️ `src/features/chatbot/services/chatBotService.ts` (수정)

---

### 🎯 Phase 4: 문서화 및 정리

#### **Commit 13: 서버 API 분리 문서화**
```bash
브랜치: docs/server-api-separation
커밋 메시지: docs: 서버 API 분리 가이드 문서 작성

- 서버/클라이언트 API 사용 가이드 작성
- 아키텍처 설명 추가
- 예제 코드 및 Best Practices 문서화
```

**변경 파일:**
- ✅ `docs/api-architecture.md` (신규)
- ♻️ `CLAUDE.md` (업데이트)

**문서 내용:**
1. 서버/클라이언트 API 분리 아키텍처 설명
2. Factory Pattern 사용법
3. 각 Service 사용 예제
4. 새로운 Service 추가 가이드
5. 트러블슈팅 가이드

---

#### **Commit 14: 타입 정의 및 Export 최적화**
```bash
브랜치: refactor/optimize-exports
커밋 메시지: refactor: Service 타입 정의 및 export 최적화

- 각 feature의 index.ts에서 서버 Service export 추가
- 타입 정의 파일 정리
- barrel export 패턴 적용
```

**변경 파일:**
- ♻️ `src/features/posts/index.ts` (수정)
- ♻️ `src/features/user/index.ts` (수정)
- ♻️ `src/features/comments/index.ts` (수정)
- ♻️ `src/features/admin/index.ts` (수정)

**작업 내용:**
```typescript
// src/features/posts/index.ts
export * from "./services/postService";
export * from "./services/postService.server";
export * from "./components";
// ...
```

---

### 🎯 Phase 5: 테스트 및 검증

#### **Commit 15: 서버 Service 단위 테스트 추가**
```bash
브랜치: test/server-services
커밋 메시지: test: 서버 Service 단위 테스트 추가

- postService.server.test.ts 추가
- userService.server.test.ts 추가
- Mock API 클라이언트를 사용한 테스트 작성
```

**변경 파일:**
- ✅ `src/features/posts/services/__tests__/postService.server.test.ts` (신규)
- ✅ `src/features/user/services/__tests__/userService.server.test.ts` (신규)

---

#### **Commit 16: E2E 테스트 업데이트**
```bash
브랜치: test/e2e-update
커밋 메시지: test: 서버 API 분리 반영한 E2E 테스트 업데이트

- 홈페이지 렌더링 테스트 업데이트
- 게시글 상세 페이지 테스트 업데이트
- 마이페이지 테스트 업데이트
```

**변경 파일:**
- ♻️ `e2e/home.spec.ts` (수정)
- ♻️ `e2e/post-detail.spec.ts` (수정)
- ♻️ `e2e/mypage.spec.ts` (수정)

---

## 최종 구조

### 디렉토리 구조
```
src/features/
├── posts/
│   ├── services/
│   │   ├── postService.shared.ts      # 공통 로직 (팩토리 함수)
│   │   ├── postService.ts             # 클라이언트용
│   │   ├── postService.server.ts      # 서버용
│   │   ├── imageService.shared.ts
│   │   ├── imageService.ts
│   │   ├── imageService.server.ts
│   │   ├── likeService.shared.ts
│   │   ├── likeService.ts
│   │   └── likeService.server.ts
│   └── components/
│
├── user/
│   ├── services/
│   │   ├── userService.shared.ts
│   │   ├── userService.ts
│   │   └── userService.server.ts
│   └── components/
│
├── comments/
│   ├── services/
│   │   ├── commentService.shared.ts
│   │   ├── commentService.ts
│   │   └── commentService.server.ts
│   └── components/
│
└── ... (다른 features)
```

### 코드 예시

#### postService.shared.ts
```typescript
import type { DefaultApi, Pageable, PostDetailResponse, HomeFeedResponse } from "@/generated/api";

export const createPostService = (api: DefaultApi) => ({
  async getPosts(params: Pageable, options?: RequestInit) {
    const response = await api.getPosts({ ...params }, options);
    return response.data;
  },

  async getPostById(postId: number, options?: RequestInit) {
    const response = await api.getPostDetail({ postId }, options);
    return response.data;
  },

  async getHomeFeed(params?: {...}, options?: RequestInit) {
    const response = await api.getHomeFeed(params || {}, options);
    return response.data;
  },
  // ... 다른 메서드들
} as const);
```

#### postService.ts (클라이언트)
```typescript
import { apiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

export const postService = createPostService(apiClient);
```

#### postService.server.ts (서버)
```typescript
import { createServerApiClient } from "@/lib/apiClient";
import { createPostService } from "./postService.shared";

export const createPostServiceServer = () => {
  return createPostService(createServerApiClient());
};
```

### 사용 예시

#### 서버 컴포넌트
```typescript
import { createPostServiceServer } from "@/features/posts/services/postService.server";

export default async function PostPage() {
  const postService = createPostServiceServer();
  const posts = await postService.getPosts({ page: 0, size: 10 });

  return (
    <div>{/* ... */}</div>
  );
}
```

#### 클라이언트 컴포넌트
```typescript
'use client';
import { postService } from "@/features/posts";

export default function PostList() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts({ page: 0, size: 10 })
  });

  return (
    <div>{/* ... */}</div>
  );
}
```

---

## 기대 효과

### 1. 🎯 명확한 책임 분리
- 서버/클라이언트 API 호출 로직 완전 분리
- 각 환경에 최적화된 코드 실행
- 더 이상 서버에서 클라이언트 전용 로직 실행 안함

### 2. 📦 번들 크기 최적화
- 클라이언트 번들에 서버 전용 코드 미포함
- Tree-shaking 효율성 증가
- 초기 로딩 속도 개선

### 3. 🔒 타입 안정성 강화
- 서버/클라이언트 환경별 타입 체크
- 잘못된 환경에서의 사용 컴파일 타임에 방지
- IDE 자동완성 및 타입 추론 개선

### 4. 🧪 테스트 용이성
- Mock API 클라이언트 주입 가능
- 단위 테스트 작성 간편
- 환경별 독립적인 테스트 가능

### 5. 🔧 유지보수성 향상
- 공통 로직 한 곳에서 관리
- 일관된 패턴으로 코드 이해 쉬움
- 새로운 팀원 온보딩 용이

### 6. 🚀 성능 개선
- 서버에서 불필요한 클라이언트 로직 제거
- 각 환경에 최적화된 실행
- ISR/SSG 캐싱 전략 효율적 적용

### 7. 📚 확장성
- 새로운 Service 추가 시 명확한 패턴 제공
- 일관된 구조로 코드베이스 확장 용이
- 다른 환경(예: Electron, Mobile WebView) 추가 쉬움

---

## 작업 진행 순서

### Sprint 1 (Week 1)
- [x] Commit 1-5: Post Service 완전 리팩토링
- [x] 홈페이지 및 게시글 상세 페이지 마이그레이션
- [x] QA 및 버그 수정

### Sprint 2 (Week 2)
- [ ] Commit 6-9: User Service 리팩토링
- [ ] MyPage 및 프로필 관련 컴포넌트 마이그레이션
- [ ] QA 및 버그 수정

### Sprint 3 (Week 3)
- [ ] Commit 10-12: 나머지 Services 리팩토링
- [ ] 모든 서버 컴포넌트 마이그레이션 완료
- [ ] QA 및 버그 수정

### Sprint 4 (Week 4)
- [ ] Commit 13-14: 문서화 및 최적화
- [ ] Commit 15-16: 테스트 추가 및 업데이트
- [ ] 최종 검증 및 배포 준비

---

## 체크리스트

### Phase 1: Post Service
- [ ] postService.shared.ts 생성
- [ ] postService.ts 리팩토링
- [ ] postService.server.ts 생성
- [ ] app/page.tsx 마이그레이션
- [ ] app/(content)/posts/[id]/page.tsx 마이그레이션
- [ ] QA 및 동작 검증

### Phase 2: User Service
- [ ] userService.shared.ts 생성
- [ ] userService.ts 리팩토링
- [ ] userService.server.ts 생성
- [ ] MyPageSidebar.server.tsx 마이그레이션
- [ ] app/(dashboard)/mypage/page.tsx 마이그레이션
- [ ] QA 및 동작 검증

### Phase 3: 나머지 Services
- [ ] commentService 리팩토링
- [ ] adminService 리팩토링
- [ ] imageService 리팩토링
- [ ] likeService 리팩토링
- [ ] introService 리팩토링
- [ ] chatBotService 리팩토링
- [ ] 모든 서버 컴포넌트 마이그레이션 확인

### Phase 4: 문서화
- [ ] API 아키텍처 문서 작성
- [ ] 사용 가이드 작성
- [ ] CLAUDE.md 업데이트
- [ ] Export 최적화

### Phase 5: 테스트
- [ ] 서버 Service 단위 테스트
- [ ] E2E 테스트 업데이트
- [ ] 성능 테스트
- [ ] 최종 검증

---

## 참고 자료

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)

---

**작성일**: 2025년 10월 6일
**작성자**: Claude (AI Assistant)
**프로젝트**: GamzaTechBlog-front
