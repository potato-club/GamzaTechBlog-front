---
description: Webpack 빌드 시 barrel export로 인한 Server/Client 코드 혼합 문제 해결
---

# Webpack Barrel Export 문제 해결 가이드

## 🚨 문제 상황

`yarn build:webpack` (또는 `next build --webpack`) 실행 시 다음과 같은 에러가 발생하는 경우:

```
Error: You're importing a component that needs "server-only".
       That only works in a Server Component which is not supported in the pages/ directory.

Error: You're importing a component that needs `useState`.
       This React Hook only works in a Client Component.
```

## 📋 문제 원인

### Turbopack vs Webpack 차이

| Turbopack               | Webpack                 |
| ----------------------- | ----------------------- |
| 🟢 관대한 검증          | 🔴 엄격한 검증          |
| 런타임에 문제 발생 가능 | 빌드 시 문제 차단       |
| barrel export 허용      | barrel export 철저 검증 |

### Barrel Export란?

`index.ts`에서 모든 모듈을 re-export하는 패턴:

```typescript
// features/posts/index.ts (barrel)
export * from "./hooks"; // ❌ Client hooks 포함
export * from "./components"; // ❌ Server components 포함
export * from "./services"; // ❌ Server-only code 포함
```

### 왜 문제가 되는가?

```
Server Component (app/page.tsx)
  └─> import { MainContent } from "@/features/posts"  // barrel import
      └─> posts/index.ts가 평가됨
          └─> hooks/index.ts도 평가됨
              └─> usePostMutations.ts (useState 사용) ❌ 에러!
```

**Server Component에서 barrel을 import하면, 그 안의 모든 export가 평가되면서 Client 코드도 포함됩니다.**

---

## ✅ 해결 방법

### 규칙 1: Server Component에서는 직접 import 사용

```typescript
// ❌ BAD: barrel import
import { MainContent, PostCard } from "@/features/posts";

// ✅ GOOD: 직접 import
import MainContent from "@/features/posts/components/MainContent";
import PostCard from "@/features/posts/components/PostCard";
```

### 규칙 2: Barrel에서 Server 코드 제외

```typescript
// features/posts/index.ts

// ✅ Client-safe만 export
export { PostCard, PostList } from "./components";
export type { PostFormData } from "./types";

// ❌ Server 코드는 barrel에서 제외
// ⚠️ 직접 import: import { createPostServiceServer } from "@/features/posts/services/postService.server";
// ⚠️ 직접 import: import PostListSection from "@/features/posts/components/PostListSection.server";
```

### 규칙 3: Server Component 파일명 규칙

- `.server.tsx` 접미사 사용
- Barrel export에서 제외
- 직접 import로만 사용

```typescript
// ✅ GOOD
import PostListSection from "@/features/posts/components/PostListSection.server";

// ❌ BAD
import { PostListSection } from "@/features/posts";
```

---

## 🔧 에러 해결 단계

### Step 1: 에러 트레이스 분석

```
Import trace for requested module:
./src/lib/useActionMutation.ts              <-- 문제의 Client 코드
./src/features/posts/hooks/useImageQueries.ts
./src/features/posts/hooks/index.ts
./src/features/posts/index.ts               <-- barrel 진입점
./src/app/page.tsx                          <-- Server Component
```

**찾아야 할 것**: Server Component에서 barrel을 통해 Client 코드가 import되는 경로

### Step 2: barrel import를 직접 import로 변경

```typescript
// 에러가 발생하는 Server Component 파일을 수정

// Before
import { SomeComponent, SomeHook } from "@/features/some-feature";

// After
import SomeComponent from "@/features/some-feature/components/SomeComponent";
// Hook은 Server Component에서 사용하지 않음 (필요 없으면 삭제)
```

### Step 3: barrel에서 Server 코드 제거

```typescript
// features/xxx/index.ts 수정

// 제거할 것들:
// - *.server.ts/tsx 파일
// - "server-only" import하는 파일
// - createBackendApiClient 등 서버 전용 코드

// 주석으로 직접 import 안내 추가
// ⚠️ Server Services: import { createXxxServiceServer } from "@/features/xxx/services/xxxService.server";
```

---

## 📂 이 프로젝트의 Barrel 분리 패턴

### Client-safe barrel (features/xxx/index.ts)

```typescript
// ✅ Client에서도 사용 가능한 것만
export * from "./hooks"; // Client hooks만
export * from "./actions"; // Server Actions (Client에서 호출 가능)
export type * from "./types"; // 타입만

// Components (Client-safe만)
export { ClientComponent } from "./components";

// ⚠️ Server 코드는 직접 import:
// import { createXxxServiceServer } from "@/features/xxx/services/xxxService.server";
// import ServerComponent from "@/features/xxx/components/ServerComponent.server";
```

### 컴포넌트 분류

| 파일명                 | 유형             | Barrel 포함 |
| ---------------------- | ---------------- | ----------- |
| `Component.tsx`        | Client-safe      | ✅ 가능     |
| `Component.server.tsx` | Server Component | ❌ 제외     |
| `xxxService.server.ts` | Server Service   | ❌ 제외     |
| `useXxxMutations.ts`   | Client Hook      | ⚠️ 주의     |

---

## 🧪 검증 방법

### Webpack으로 빌드하여 확인

```bash
yarn build:webpack
```

에러가 없으면 OK!

### 에러 발생 시

1. 에러 트레이스 확인
2. Server Component → barrel → Client 코드 경로 파악
3. 직접 import로 변경
4. 다시 빌드

---

## 📋 체크리스트

새로운 feature를 추가할 때:

- [ ] `*.server.ts/tsx` 파일은 barrel에서 제외했는가?
- [ ] Server Services (`createXxxServiceServer`)는 barrel에서 제외했는가?
- [ ] Server Components는 barrel에서 제외했는가?
- [ ] Server Component에서 barrel import 대신 직접 import를 사용했는가?
- [ ] `yarn build:webpack`으로 검증했는가?

---

## 🔗 관련 파일

수정된 barrel 파일들:

- `src/features/posts/index.ts`
- `src/features/posts/components/index.ts`
- `src/features/user/index.ts`
- `src/features/user/components/index.ts`
- `src/features/comments/index.ts`
- `src/features/likes/index.ts`
- `src/features/intro/index.ts`
- `src/features/search/components/index.ts`
- `src/components/shared/index.ts`
