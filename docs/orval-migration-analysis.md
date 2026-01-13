# OpenAPI Generator → Orval 마이그레이션 분석

## 현재 프로젝트 아키텍처 요약

### 데이터 패칭 전략

현재 프로젝트는 **RSC 중심의 BFF 아키텍처**를 채택하고 있습니다:

| 영역            | 현재 방식           | 설명                                              |
| --------------- | ------------------- | ------------------------------------------------- |
| **읽기 (Read)** | RSC (서버 컴포넌트) | `*Service.server.ts` 팩토리로 서버에서 직접 fetch |
| **쓰기 (CUD)**  | Server Actions      | `*Actions.ts` + `useActionMutation` 훅            |
| **캐시 무효화** | Tag 기반            | `revalidateTag()` + `next: { tags: [...] }`       |

### 주요 서비스 구조

```
features/
├── posts/
│   ├── services/
│   │   ├── postService.server.ts      # RSC용 팩토리
│   │   └── postService.shared.ts      # 공통 로직 (DI 패턴)
│   ├── actions/
│   │   └── postActions.ts             # Server Actions
│   └── hooks/
│       └── usePostMutations.ts        # useActionMutation 래퍼
├── comments/
│   ├── services/commentService.server.ts
│   └── hooks/useCommentMutations.ts
├── likes/
│   ├── services/likeService.server.ts
│   └── hooks/useLikeMutations.ts
└── chatbot/
    ├── services/chatBotService.ts     # 클라이언트 직접 호출
    └── hooks/useChatBotQueries.ts
```

---

## Next.js 기본 기능 vs React Query 활용 가이드

### ✅ Next.js 기본 기능으로 충분한 경우

아래 시나리오에서는 **Orval의 RQ 코드 생성 없이** 순수 Next.js 기능만으로 충분합니다.

#### 1. 정적/공개 데이터 읽기 (현재 패턴 유지)

```tsx
// postService.shared.ts - 이미 잘 구성됨
async getPosts(params, options) {
  const mergedOptions = mergeNextOptions(options, ["posts-list"]);
  const response = await api.getPosts({ ...params }, mergedOptions);
  return response.data;
}
```

- **ISR/SSG**: `next: { revalidate: 3600, tags: ["posts-list"] }`
- **SSR**: `cache: "no-store"` (개인화 데이터)

**적용 영역**:

- 게시글 목록/상세 (`posts`)
- 인기 게시글 (`posts-popular`)
- 태그 목록 (`tags`)
- 홈 피드 (`getHomeFeed`)
- Intro 목록

#### 2. CUD 작업 (Server Actions 활용)

```tsx
// likeActions.ts - 현재 패턴 유지
"use server";
export const addLikeAction = withActionResult(async (postId) => {
  const likeService = createLikeServiceServer();
  await likeService.addLike(postId);
  postCacheInvalidation.invalidateDetail(postId);
});
```

**장점**:

- Progressive Enhancement (JS 비활성화 시에도 동작)
- 자동 revalidation (`router.refresh()` 또는 `revalidateTag`)
- 클라이언트 번들 축소

**적용 영역**:

- 게시글 생성/수정/삭제
- 댓글 생성/삭제
- 좋아요 추가/취소
- 프로필 업데이트
- 관리자 승인

#### 3. 단순 폼 제출

현재 `useActionMutation` 훅이 이 역할을 잘 수행하고 있습니다.

---

### 🔄 React Query가 유리한 경우

아래 시나리오에서는 **Orval로 RQ 코드를 생성**하여 활용하는 것이 효과적입니다.

#### 1. 실시간성이 중요한 클라이언트 상호작용

| 기능                   | 설명                  | RQ 장점                |
| ---------------------- | --------------------- | ---------------------- |
| **Optimistic Updates** | 좋아요 버튼 즉시 반응 | `onMutate`로 UI 선반영 |
| **Polling**            | 알림 업데이트         | `refetchInterval`      |
| **Infinite Scroll**    | 게시글 무한 스크롤    | `useInfiniteQuery`     |

```tsx
// Orval 생성 예시 (tanstack-query)
export const useAddLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likeApi.addLike(postId),
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previous = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], (old) => ({
        ...old,
        isLiked: true,
        likeCount: old.likeCount + 1,
      }));
      return { previous };
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(["post", postId], context.previous);
    },
  });
};
```

> [!TIP]
> **현재 좋아요 로직**: Server Action 호출 후 페이지 전체 리렌더링 (`revalidateTag`).
> Optimistic Update가 필요하다면 RQ 도입 고려.

#### 2. 챗봇 기능 (실시간 상호작용)

현재 `chatBotService.ts`는 클라이언트에서 직접 API를 호출하고 있습니다:

```tsx
// 현재 방식
const response = await apiFetch("/api/v1/ai/chat", {
  method: "POST",
  mode: "direct-private",
  ...
});
```

이 경우 Orval로 RQ 뮤테이션을 생성하면:

- 로딩 상태 자동 관리
- 에러 재시도 로직
- 요청 중복 방지

#### 3. 복잡한 클라이언트 상태 동기화

여러 컴포넌트에서 같은 데이터를 참조하고, 한 곳에서 변경 시 모든 곳이 동기화되어야 하는 경우:

- 예: 좋아요 수가 게시글 카드, 상세 페이지, 사이드바에 동시 표시

---

## 권장 마이그레이션 전략

### Phase 1: Orval 기본 설정 (타입 + Fetcher만)

```typescript
// orval.config.ts
export default {
  gamzaTech: {
    input: "https://gamzatech.site/v3/api-docs/all",
    output: {
      mode: "tags-split",
      target: "src/generated/orval",
      schemas: "src/generated/orval/models",
      client: "fetch", // RQ 없이 순수 fetch 함수만
      override: {
        mutator: {
          path: "./src/lib/customFetcher.ts",
          name: "customFetcher",
        },
      },
    },
  },
};
```

**목표**:

- 기존 `DefaultApi` 클래스 방식에서 **함수형 API**로 전환
- 현재 서버 컴포넌트 패턴과 호환 유지

### Phase 2: 선택적 RQ 통합

필요한 기능에만 React Query를 추가 생성:

```typescript
// orval.config.ts - RQ 필요한 기능만
export default {
  // 기본: fetch 함수만
  gamzaTechCore: {
    output: { client: "fetch" },
  },

  // RQ 필요한 기능들만 별도 생성
  gamzaTechReactive: {
    input: "https://gamzatech.site/v3/api-docs/all",
    output: {
      target: "src/generated/orval-rq",
      client: "react-query",
      override: {
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
    // 특정 태그만 포함
    tags: ["likes", "chatbot"],
  },
};
```

### Phase 3: 점진적 마이그레이션

| 우선순위 | 기능          | 전략                                  |
| -------- | ------------- | ------------------------------------- |
| 1        | 타입 교체     | Orval 생성 타입으로 점진적 교체       |
| 2        | 읽기 API      | 기존 서비스 레이어 → Orval fetch 함수 |
| 3        | Optimistic UI | 좋아요 등 즉각 피드백 필요시 RQ 도입  |
| 4        | 챗봇          | Streaming + RQ mutation               |

---

## 기능별 권장 접근법 요약

| 기능 영역              | 읽기               | 쓰기                          | Orval 생성 옵션      |
| ---------------------- | ------------------ | ----------------------------- | -------------------- |
| **게시글 목록/상세**   | RSC + ISR          | Server Action                 | `fetch` only         |
| **댓글**               | RSC                | Server Action                 | `fetch` only         |
| **좋아요**             | RSC (초기 상태)    | Server Action / RQ Mutation\* | 선택적 `react-query` |
| **프로필**             | RSC                | Server Action                 | `fetch` only         |
| **검색**               | RSC                | N/A                           | `fetch` only         |
| **챗봇**               | N/A                | RQ Mutation                   | `react-query`        |
| **알림 (미래)**        | RQ Query (Polling) | RQ Mutation                   | `react-query`        |
| **무한 스크롤 (미래)** | RQ InfiniteQuery   | N/A                           | `react-query`        |

> [!NOTE]
> `*` 좋아요의 경우, Optimistic Update UX가 필요하면 RQ 도입을 고려하세요.
> 현재 페이지 리렌더 방식으로도 충분하다면 Server Action 유지.

---

## 결론

### 현재 아키텍처의 장점

1. **번들 크기 최소화**: RQ 라이브러리 미포함
2. **Progressive Enhancement**: Server Actions의 폼 폴백
3. **캐시 일관성**: Next.js 내장 캐시 + Tag 기반 무효화
4. **단순성**: 클라이언트/서버 경계가 명확

### Orval 마이그레이션 권장사항

1. **타입 생성**만으로 시작 (기존 로직 유지)
2. **fetch 클라이언트**로 기존 서비스 레이어 점진 교체
3. **RQ는 필요시에만** 선택적으로 생성 (챗봇, Optimistic UI)
4. 기존 `useActionMutation` 훅은 Server Actions와 잘 통합되어 있으므로 유지

> [!IMPORTANT]
> **핵심 원칙**: React Query는 "필요할 때만" 도입.
> 대부분의 CRUD는 Next.js의 RSC + Server Actions로 충분히 처리 가능합니다.
