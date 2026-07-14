# 게시글 상세 페이지 ISR 전환 계획

- 작성: 2026-07-12 (job-search 이력서 소재 검증 세션에서 작성 — 구현은 별도 세션에서 진행)
- 갱신: 2026-07-12 (코드 재검증 세션) — **페이지 밖 차단 요인 2건 발견**(루트 레이아웃 인증 주입, `backendFetch`의 무조건 `cookies()`), 선행 단계(Step 1·2) 추가, TDD 진행 방식 명시, 검증 완료 항목 반영
- 대상 레포: `potato-club/GamzaTechBlog-front` (로컬: `/Users/tnemn/projects/GamzaTechBlog-front`)
- 작업 브랜치 규칙: 이 레포는 **이슈 → 브랜치 → PR** 워크플로우가 강제됨 (`AGENTS.md`, `docs/workflows/github-issue-pr-workflow.md` 참고). 작업 시작 전 이슈부터 생성할 것.

---

## 1. 배경 — 지금 어떤 상황인가

### 1-1. 발단

취업용 이력서 소재를 원격 저장소 근거로 전수 검증하던 중, PR #35(2025-09-10, "feat(캐싱): ISR 적용을 통한 렌더링 성능 개선")의 실체가 **route-level ISR이 아니라 fetch Data Cache revalidate**임이 실측으로 확인됐다.

- diff 실측: `revalidate`가 페이지가 아니라 fetch 옵션에만 존재 — 홈 `getHomeFeed(..., { next: { revalidate: 600 } })`, 상세 `getPostById(postId, { next: { revalidate: 3600 } })`
- 빌드 출력 실측(2026-07-12, worktree A/B): 홈·상세 모두 **ƒ (Dynamic)** — 페이지는 매 요청 서버 렌더되고 데이터 fetch만 캐시됨
- PR body의 "10분 주기로 페이지를 재생성"은 부정확한 서술

### 1-2. 왜 페이지가 동적인가 (ISR을 막는 원인)

ISR 성립 조건은 "라우트가 정적 렌더 가능"인데, 상세 페이지가 서버 렌더 중 **요청자별(개인화) 조각**을 조회한다:

**현재 main의 `src/app/(content)/posts/[id]/page.tsx` (2026-07-12 실측, 183줄):**

```
본문:   getCachedPost = cache(() => postService.getPostById(postId, { next: { revalidate: 86400 } }))
개인화: userService.getProfile({ cache: "no-store" })          ← 수정/삭제 버튼용 canEditPost
개인화: likeService.checkLikeStatus(postId, { cache: "no-store" }) ← 좋아요 초기 상태 (로그인 시)
```

`no-store` fetch + 쿠키 의존 조회가 렌더 경로에 있는 한 라우트는 정적화될 수 없다.
`generateStaticParams` 없음, route segment `revalidate` 없음.

**추가 차단 요인 (2026-07-12 코드 재검증에서 발견 — 페이지 바깥. 이것 때문에 page.tsx만 고치면 여전히 ƒ Dynamic):**

1. **루트 레이아웃이 쿠키를 읽는다** — `src/app/layout.tsx` 81~95행이 매 요청 `getUserRole`/`getProfile`(`no-store`)을 서버에서 호출해 `AuthProvider`에 주입. 레이아웃의 dynamic API 사용은 하위 **전체 라우트**를 동적으로 만든다. 상세 페이지 개인화를 다 걷어내도 이게 남아 있으면 정적화 불가
2. **`backendFetch`가 무조건 `cookies()`를 호출한다** — `src/lib/serverApiClient.ts:8`. 모든 서버 서비스가 이 경로를 타므로 공용 본문 fetch(`getCachedPost` → `getPostDetail`)조차 dynamic API에 걸린다. 부수 문제: 요청자 토큰을 첨부한 요청의 응답이 공유 Data Cache에 저장되는 구조(공개 데이터라 실해는 없지만 냄새)
3. cacheComponents/PPR 미사용 확인(next.config.ts) — 고전 모드라 부분 정적화 없음. 위 두 건을 제거하는 것 외에 우회로 없음

**참고 — 홈(`src/app/page.tsx`)은 이번 작업 대상이 아님**: `searchParams`(page·tag)를 읽어 요청마다 화면이 달라지므로 구조적으로 ISR 불가. 상세 페이지만 대상.

### 1-3. 2026-07-12 A/B 측정 결과 (데이터 캐시만의 효과 — 이번 작업의 baseline 참고치)

worktree 격리, 동일 머신, 프로덕션 빌드, 비로그인, 로깅 프록시로 원본 호출 계측 (PR #35 전후 커밋 `b12b3e61` vs `f9c7a2f1`):

| 구간                 | BEFORE (매 요청 fetch) | AFTER (fetch revalidate) | 원본 API 호출         |
| -------------------- | ---------------------- | ------------------------ | --------------------- |
| 홈 전체응답 중앙값   | ~25ms (22~56)          | ~16ms (15~21)            | 5회/5요청 → 0회/5요청 |
| 상세 전체응답 중앙값 | ~67ms (61~219)         | ~59ms (57~103)           | 5회/5요청 → 0회/5요청 |

- 백엔드 콜드 첫 호출 0.91s / 웜 ~15-20ms (gamza.site)
- **델타가 작은 이유**: 렌더는 양쪽 다 매 요청 실행되므로 fetch 절약분만 측정됨. 페이지 ISR이 되면 렌더 생략까지 더해져 델타가 커질 것으로 기대 — 이번 작업 후 재측정으로 확인
- 측정 사고 기록: 서버 기동 시 `yarn start | head -20`처럼 파이프하면 로그가 20줄 넘는 순간 SIGPIPE로 서버가 죽는다. **서버 로그는 반드시 파일 리다이렉트**(`> server.log 2>&1`)로.

### 1-4. 작업의 이중 목적

1. 실서비스 개선: 읽기 중심 트래픽인 블로그에서 상세 페이지 렌더 비용·백엔드 호출 제거
2. 이력서/포트폴리오 소재: "요청자별 요소가 정적화를 막던 페이지를 공용/개인화로 분리해 ISR 전환" — 문제→진단→해결→결과 구조 + 실측 수치
   - **원칙: 머지된 diff와 실측만 이력서 근거로 사용. OPEN PR 상태에서는 잠정.** 머지+측정 완료 후 job-search 레포(`base/project-context/감자블로그_이력서_소재_평가.md`, `base/resume_base_edit.md`)에 반영

---

## 2. 현재 코드 상태 요약 (2026-07-12 main 실측)

- Next **16.2.4**, React **19.0.3**. React Query는 **완전 제거됨** (의존성에 없음)
- 데이터 변경: Server Actions + `src/lib/useActionMutation.ts`(커스텀 훅). 낙관적 업데이트 없음 (#120에서 의도적 제거)
- 캐시 무효화: `src/features/posts/utils/cacheInvalidation.ts` — **revalidateTag 기반 태그 설계** (`posts-list`, `post-${id}`, `posts-popular`, `tags`), Next 16이라 revalidateTag 두 번째 인자 `"max"` 프로필 사용 중
- 상세 페이지 렌더 트리: `PostHeader`(isCurrentUserAuthor prop) → `DynamicMarkdownViewer`(본문) → `PostStats`(클라 컴포넌트, initialLikesCount·initialIsLiked·commentsCount props) → `DynamicPostCommentsSection`(initialComments=post.comments)
- `PostStats`는 이미 "use client" — 좋아요는 `await mutateAsync()` 후 상태 반영(응답 대기형)
- 클라 인증 인프라 존재: `src/hooks/useAuth.ts`, `src/contexts/AuthContext.tsx`. `authorization` 쿠키는 **HttpOnly 아님** — #146에서 `document.cookie` 직접 읽어 백엔드 직접 호출한 선례 있음 (백엔드 CORS 허용됨)
- BFF 라우트는 정리됨: #144에서 `/api/auth/reissue` 제거, #141에서 `/api/users/*` 제거 — "클라에서 필요하면 백엔드 직접 호출"이 현재 방침
- 백엔드: `https://gamza.site`, 공개 조회는 비인증 가능. ⚠️ **OAuth 로그인이 현재 불가 상태** — 로그인 상태 검증에 제약 (아래 6장)

**2026-07-12 재검증에서 확인 완료된 사실 (구현 세션에서 재조사 불필요):**

- `getPostById`는 이미 `post-${id}` 태그를 자동 병합 — `postService.server.ts:78`의 `mergeNextOptions`. 태그 누락 걱정은 해소됨
- 댓글 수정/삭제 노출 판단은 이미 **클라이언트** — `CommentCard.tsx:80` `comment.writer === userProfile.nickname` (`useAuth` 경유). 서버 계산 아님. 단 데이터 원천이 레이아웃 서버 주입이므로, Step 1 이후 자동으로 클라 부트스트랩 값을 쓰게 됨 → **댓글 컴포넌트는 무수정**
- `generateMetadata`는 `getCachedPost` 외 쿠키/헤더 접근 없음
- `AuthContext`는 initial props 전용 — 클라이언트 측 조회/갱신 로직 없음. `useAuth().refetchAuthStatus`는 `router.refresh()`로 서버 레이아웃 재렌더에 의존 — Step 1에서 이 의존을 끊어야 함
- 헤더 구조: `BlogHeader`(서버, 정적 마크업만) → `HeaderNavigation`이 인증 UI 소비
- 기존 테스트 앵커: `src/contexts/__tests__/AuthContext.test.tsx`, `src/hooks/__tests__/useAuth.test.tsx`, `src/components/shared/layout/__tests__/HeaderNavigation.test.tsx` — Step 1 TDD의 출발점

---

## 3. 작업 목표 (Definition of Done)

1. `/posts/[id]` 라우트가 `yarn build` 출력에서 정적(SSG/ISR) 마커로 표시된다 (현재 ƒ Dynamic)
2. 캐시된 HTML에 개인화 요소(수정/삭제 버튼, 좋아요 상태)가 **포함되지 않는다** — 비로그인 캐시 HTML을 로그인 사용자가 받아도 사고가 없다
3. 글 수정·삭제, 댓글 작성·삭제 시 `revalidateTag("post-${id}")`로 **페이지 캐시까지** 재생성된다
4. 수정 버튼·좋아요의 지연 노출로 인한 **CLS 회귀가 없다** (자리 예약)
5. 전후 TTFB A/B 측정 기록 확보
6. 루트 레이아웃이 쿠키를 읽지 않는다 — 로그인 UI는 클라이언트 부트스트랩으로 전환, 헤더 로그인 영역은 판별 전 **크기 고정 스켈레톤**(틀린 상태 노출·CLS 0)
7. 동작 변경은 **테스트 선행(TDD)** — 기존 Jest 스위트 전체 통과 유지

---

## 4. 구현 단계

### 진행 방식 — TDD (전 단계 공통)

동작이 바뀌는 모든 단계는 **테스트 먼저**: 기대 동작을 Jest 테스트로 먼저 작성/수정 → **올바른 이유로 실패하는지 확인** → 최소 구현 → 통과 → 리팩터. 실행: `JEST_SKIP_MSW=true CI=true yarn test`.

- Jest(+RTL)로 커버할 것: AuthProvider 부트스트랩 동작, 헤더 스켈레톤→상태 전환, 수정 버튼 노출 판단, 좋아요 초기 조회, publicFetch의 쿠키 미접근
- Jest로 못 잡는 것 2가지는 **통합 검증이 red/green 역할을 대신한다**: ① 라우트 정적화 여부 = 빌드 출력 마커(Step 4) ② 개인화 누출 = curl 검증(Step 6). 이 둘도 같은 규율 적용 — 구현 전에 실패 상태를 먼저 기록(현재 ƒ Dynamic / 캐시 HTML에 개인화 마크업 존재)하고, 구현 후 통과를 확인한다

### Step 0 — 이슈 생성

레포 워크플로우대로 GitHub 이슈 생성. 제안 제목: `[refactor] 게시글 상세 페이지 ISR 전환 — 인증 클라이언트 부트스트랩 및 개인화 조각 분리`. 본문에 이 문서 링크/요지 + DoD 7개 항목.

### Step 1 — 인증 상태 클라이언트 부트스트랩 이관 (선행 필수)

페이지 작업 전에 **전 라우트를 동적으로 묶는 원인부터 제거**한다. 영향 범위가 전 페이지(헤더)라 이 작업의 실질적 몸통이다.

1. **테스트 먼저**: `AuthContext.test.tsx`·`useAuth.test.tsx`·`HeaderNavigation.test.tsx`를 새 기대 동작으로 수정/추가 — (a) AuthProvider가 마운트 후 프로필을 조회해 컨텍스트를 채운다 (b) 판별 전 헤더는 스켈레톤 (c) 판별 후 로그인 사용자는 프로필 UI, 비로그인은 로그인 버튼. 실패 확인 후 구현 진행
2. `AuthProvider`: initial props 의존 제거 → 마운트 후 스스로 프로필 조회(조회 경로는 5장 결정 1번). `isLoading`(미판별) 상태 노출
3. 루트 레이아웃(`src/app/layout.tsx`)에서 `getUserRole`/`getProfile` 블록 제거, `Providers` initial props 제거
4. 헤더 로그인 영역: 판별 전 **크기 고정 shadcn Skeleton**(CLS 0, 레포 스켈레톤 컨벤션 준수). 힌트 쿠키(`logged_in` 플래그) 최적화는 이번에 하지 않음 — 배포 후 비로그인 화면의 스켈레톤→버튼 전환이 실제로 거슬리면 후속
5. `refetchAuthStatus`(`router.refresh()` 의존)와 로그인 직후·로그아웃·프로필 수정 플로우가 클라 컨텍스트 갱신으로 동작하도록 수정·확인

### Step 2 — 공용(비인증) fetch 경로 분리 (선행 필수)

1. **테스트 먼저**: 공용 fetch가 쿠키에 접근하지 않음을 단언하는 단위 테스트 작성 (`next/headers` mock으로 `cookies()` 미호출 검증)
2. `src/lib/serverApiClient.ts`에 쿠키를 읽지 않는 공용 fetch(가칭 `publicFetch`) 추가 — 기존 `backendFetch`는 개인화 조회용으로 유지
3. 공개 조회를 공용 경로로 이관: `getPostById`(핵심). 홈피드·태그·인기글은 상세 페이지 렌더 경로에 걸리는 것만 포함(사이드바 등), 나머지는 범위 외
4. 이관 시 기존 `next` 옵션(태그·revalidate) 병합이 그대로 유지되는지 확인

### Step 3 — 개인화 조각을 클라이언트로 분리

1. `page.tsx`에서 `getProfile`/`checkLikeStatus` 서버 조회 블록(현재 132~158행 부근) 제거. `isCurrentUserAuthor`·`initialIsLiked` prop 제거
2. **수정/삭제 버튼** (`PostHeader`): **테스트 먼저** — 작성자면 노출·타인이면 미노출·판별 전 자리 예약을 RTL로 작성 후 구현. 버튼 영역을 클라 컴포넌트로 분리 → Step 1에서 부트스트랩된 `useAuth().userProfile`로 `canEditPost(profile, post.writer)` 판단(`src/lib/auth.ts`에 이미 있음) — **별도 마운트 조회 불필요**. 판별 전에는 **레이아웃이 고정된 자리**(invisible 또는 스켈레톤) 유지
3. **좋아요 초기 상태** (`PostStats`): **테스트 먼저** — 로그인 시 마운트 후 상태 조회, 비로그인 시 미조회를 작성 후 구현. `initialIsLiked` prop 의존 제거 → 마운트 후 조회(게시글별 데이터라 프로필 부트스트랩과 별개의 조회 필요). **조회 경로는 5장 결정 사항 1번 참조** (레포 리뷰 규칙과 #146 선례가 충돌 — 근거 확인 후 결정). likesCount는 본문 응답(공용)에 있으므로 유지
4. **댓글 영역 — 확인 완료(2026-07-12), 무수정**: 노출 판단은 이미 클라이언트(`CommentCard.tsx:80`, `comment.writer === userProfile.nickname`). Step 1 이후 자동으로 부트스트랩 값을 쓰게 되므로 코드 수정 불필요 — 기존 댓글 테스트 통과로 회귀만 확인. `initialComments`는 본문 fetch에 포함된 공용 데이터라 유지
5. `generateMetadata` — 확인 완료(2026-07-12): `getCachedPost` 외 쿠키/헤더 접근 없음. Step 2의 공용 fetch 이관 후 재확인만

### Step 4 — 라우트 정적화

1. 렌더 경로 전체(**루트/중간 레이아웃 포함** + `page.tsx` + 모든 하위 서버 컴포넌트 + `generateMetadata` + **이들이 import하는 서비스·lib 레이어**(`src/lib/**`, `*.server.ts`))에서 `cookies()`·`headers()`·`no-store` fetch·`searchParams`가 하나도 남지 않았는지 grep으로 전수 확인 — **하나라도 남으면 조용히 Dynamic으로 남는다** (이번 재검증에서 놓칠 뻔한 곳이 정확히 레이아웃과 `serverApiClient.ts`였다)
2. `generateStaticParams` 추가 + `export const revalidate` 명시 여부 결정. Next 16 기준 dynamic segment의 on-demand 정적 생성 조건(generateStaticParams 유무·dynamicParams 동작)은 **공식 문서로 확인 후 결정** — 추측 금지. 선택지: (a) 최신 N개 프리렌더 + 나머지 on-demand (b) 빈 배열 + 전부 on-demand
3. 검증 기준은 문서가 아니라 **빌드 출력의 라우트 마커**

### Step 5 — 태그-페이지 캐시 연결 검증

1. 확인 완료(2026-07-12): `getPostById`는 `mergeNextOptions`로 `post-${id}` 태그를 자동 병합(`postService.server.ts:78`). **Step 2의 공용 fetch 이관 후에도 태그·revalidate가 유지되는지만 재확인**
2. 로컬 검증: 프로덕션 빌드 기동 → 상세 페이지 캐시 워밍 → 댓글 작성(Server Action 경유) → 같은 URL 재요청 시 새 댓글이 포함된 HTML이 오는지
3. 글 수정·삭제 경로(`postActions.ts` → `cacheInvalidation.invalidateDetail`)도 동일 확인

### Step 6 — 품질 검증

- `yarn build` — `/posts/[id]` 마커 확인 (DoD 1)
- **개인화 누출 테스트 (DoD 2, 최대 리스크)**: 비로그인 curl로 캐시 워밍 → HTML에 수정 버튼 마크업이 없는지 grep → authorization 쿠키를 수동 첨부한 curl로 같은 URL 요청 → 같은(캐시된) HTML이 오고 개인화 마크업이 여전히 없는지
- CLS (DoD 4): 전후 커밋 Lighthouse 비교 (`--preset=desktop`, CLS 값 추출) — 기존 이력서 소재 "레이아웃 시프트 6→0"과 자기모순이 생기면 안 됨
- 테스트·린트: `JEST_SKIP_MSW=true CI=true yarn test`, `yarn lint`, `npx tsc --noEmit` (레포 관례 — 최근 PR들의 테스트 섹션 참고)

### Step 7 — A/B 측정 (이력서 수치 확보)

2026-07-12 세션에서 확립한 절차 재사용:

1. `git worktree add <경로> <커밋>` 으로 BEFORE(현재 main)·AFTER(ISR 브랜치) 격리 — 본 작업 트리 오염 금지
2. `.env.local` 복사 (`NEXT_PUBLIC_API_BASE_URL=https://gamza.site`)
3. 각각 `yarn install --frozen-lockfile` → `yarn build` → `PORT=34xx yarn start > server.log 2>&1` (⚠️ 파이프 금지 — 1-3 사고 기록)
4. 워밍 1회 후 `curl -s -o /dev/null --max-time 20 -w '%{http_code} %{time_starttransfer} %{time_total}\n' <URL>` 5회 이상, 요청 간 `sleep 0.4`
5. (선택) 원본 호출 계측: gamza.site로 포워딩하는 로컬 로깅 프록시를 만들어 `NEXT_PUBLIC_API_BASE_URL=http://localhost:3499`으로 빌드 — 구간별 로그 라인 수 델타가 호출 수
6. 기대치: BEFORE 상세 total ~60ms(렌더 포함) → AFTER 정적 서빙 수 ms. **수치는 조건 명시 델타로만 기록** (동일 머신·웜 상태·비로그인)
7. 배포 후: 응답 헤더(`x-nextjs-cache` 또는 Vercel이면 `x-vercel-cache`) HIT 확인

### Step 8 — PR·머지·이력서 반영

1. PR body는 **실제 동작 확인 후** 사실만 기술 (이 레포 과거 PR body 부정확 사례: #35 "페이지를 재생성", #22 "WebP/AVIF"가 머지 코드에선 주석 처리, #119 등 — 검증 세션에서 다수 적발됨. body는 이력서 검증 시 diff와 대조된다)
2. 머지 후 job-search 레포에 기록:
   - `base/project-context/감자블로그_이력서_소재_평가.md` — 신규 소재 등재 (등급·검증 근거·측정치)
   - `base/resume_base_edit.md` — 불릿 후보 추가. 기존 #35 불릿("주기 재검증 데이터 캐시")과의 관계는 "4단 진화의 완결"(#35 데이터 캐시 → #89 변경 시 무효화 → BFF기 태그 설계 → 본 작업 페이지 ISR)로 정리

---

## 5. 결정 필요 사항 (구현 세션에서 판단)

| 항목                                         | 선택지                                                                  | 참고                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프로필 부트스트랩·좋아요 상태 클라 조회 경로 | ① Route Handler(BFF) 신설 ② Server Action ③ 백엔드 직접 호출(#146 선례) | **Step 1로 인해 이 결정은 앱 전역 프로필 부트스트랩에 적용됨(좋아요 한정 아님) — 더 신중히.** **충돌 지점 — 먼저 사실 확인 필요.** `.github/copilot-instructions.md`(리뷰 규칙)는 "개인화 데이터는 BFF/Server Action 경유, 클라의 백엔드 직접 호출은 명시적 정당화 없인 금지, 클라에서 토큰 읽기 금지(HttpOnly)". 반면 #146(머지됨)은 "authorization 쿠키가 HttpOnly 아님"을 근거로 직접 호출을 채택. **authorization 쿠키의 실제 HttpOnly 여부를 Set-Cookie 응답으로 확인**하고, HttpOnly면 ①/②만 가능. 아니더라도 리뷰 규칙 취지(토큰 취급을 서버에 격리)상 ①이 가장 무난 — #141·#144의 BFF 정리는 "미사용 dead code 제거"였지 "BFF 금지 방침"이 아님 |
| generateStaticParams 범위                    | 최신 N개 프리렌더 vs 빈 배열(전부 on-demand)                            | 게시글 58건(2026-07 기준) — 전체 프리렌더도 부담 없음. 빌드 시간과 비교                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 버튼 지연 노출 UX                            | invisible 자리 예약 vs 스켈레톤                                         | CLS 0 유지가 우선. 버튼 크기가 고정이라 invisible이 단순                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 헤더 로그인 영역 노출                        | **결정됨: 판별 전 크기 고정 스켈레톤**(shadcn Skeleton 컨벤션)          | 비로그인 다수가 스켈레톤→버튼 전환을 보는 트레이드오프 수용. 힌트 쿠키(`logged_in` 플래그) 최적화는 배포 후 실제로 거슬릴 때 후속 — 미리 만들지 않음                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 홈 페이지                                    | **대상 외 유지**                                                        | searchParams 의존 — 정적화하려면 페이지네이션·태그 필터 URL 설계 자체를 바꿔야 하므로 별건                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

---

## 6. 주의사항·함정

1. **개인화 누출이 최대 리스크** — 남의 수정 버튼이 보이는 HTML이 캐시되면 개선이 아니라 사고. Step 6의 누출 테스트를 생략하지 말 것
2. **하나 남은 dynamic API가 전부 무효화** — 상위 레이아웃·하위 서버 컴포넌트·서비스 레이어 어디든 cookies() 한 줄로 조용히 ƒ로 남는다 (실사례: `layout.tsx`의 인증 주입, `serverApiClient.ts`의 무조건 `cookies()` — 둘 다 이번 재검증에서 발견). 빌드 출력이 유일한 판정 기준
3. **React `cache()`와 Next Data Cache는 다른 것** — `getCachedPost`의 `cache()`는 한 요청 내 중복 호출 방지(요청 스코프), `revalidate`는 요청 간 캐시. 혼동 금지
4. **revalidateTag 프로필 인자** — Next 16에서 두 번째 인자 필요. 기존 `cacheInvalidation.ts`의 `"max"`(SWR 방식) 패턴 따를 것
5. **OAuth 로그인 현재 불가** — 로그인 상태 검증은 (a) authorization 쿠키 수동 주입 curl/브라우저 (b) 백엔드 OAuth 복구 후 실검증. 비로그인 A/B 측정에는 영향 없음
6. **Node 버전**: 로컬 v22 사용 중 — 유지 (과거 Node v24에서 tailwind 의존성 이슈 #150 있었음, 현재 main은 4.2.2로 해결됐지만 굳이 바꿀 이유 없음)
7. **레포 리뷰 규칙과의 정합**: `.github/copilot-instructions.md`가 PR 리뷰(한국어)에 적용된다 — "Server Components 우선", "개인화 데이터는 BFF/Server Action/서버 전용 모듈", "user-specific 데이터를 공용 캐시에 누출 금지(no-store 또는 태그 재검증)", "최소 변경". 이 작업은 개인화를 클라로 내리는 방향이라 리뷰에서 "왜 서버에서 안 하나"를 지적받을 수 있음 — **PR body에 정당화를 선제 기술할 것**: "개인화 조회를 서버 렌더에 두면 라우트 정적화(ISR)가 불가능하므로, 페이지 캐시 성립을 위해 개인화만 렌더 이후로 분리" (이게 이 작업의 본질이다)
8. 이력서 반영 원칙 재확인: **머지 전에는 어떤 문안도 확정하지 않는다**
9. **로그인 상태 깜빡임·hydration mismatch** — 정적 HTML은 항상 "미판별" 상태로 페인트된다. 서버 렌더와 클라 첫 렌더는 동일하게 스켈레톤이어야 하고(mismatch 방지), 상태 전환은 마운트 후 조회 완료 시에만. 로그인 직후·로그아웃·프로필 수정의 갱신 플로우가 `router.refresh()` 의존에서 벗어나 클라 컨텍스트 갱신으로 동작하는지 Step 1에서 반드시 확인

---

## 7. A/B 측정 결과 (2026-07-15 실측 — DoD 5 충족)

**측정 조건**: 동일 머신, git worktree 격리(BEFORE=`92b549b` main / AFTER=`0b2ae6c` ISR 브랜치), 각각 프로덕션 빌드, **비로그인**, 웜 상태(워밍 1회 후 계측), 백엔드는 로컬 로깅 프록시(`:3499`) 경유로 `gamza.site` 포워딩. `/posts/178`에 요청 10회(간격 0.4s).

| 구간                      | BEFORE (`ƒ` Dynamic)  | AFTER (`●` ISR)       | 개선               |
| ------------------------- | --------------------- | --------------------- | ------------------ |
| 빌드 라우트 마커          | `ƒ /posts/[id]`       | `● /posts/[id]`       | 정적화 달성        |
| 전체 응답 중앙값          | **74.8ms** (61~100ms) | **5.2ms** (3.2~9.2ms) | **약 14배 / -93%** |
| 백엔드 호출 (10요청 기준) | **20회** (요청당 2회) | **0회**               | **100% 제거**      |
| 캐시 헤더                 | `no-store`            | `x-nextjs-cache: HIT` | —                  |

**요청당 백엔드 호출 2회의 정체** (로깅 프록시 실측):

```
GET /api/v1/users/me/role
GET /api/v1/users/me/get/profile
```

루트 레이아웃(`layout.tsx`)이 `no-store`로 인증 상태를 조회하던 것 — **비로그인 방문자에게도** 매 요청 발생했다. 게시글 본문 fetch는 PR #35의 Data Cache(`revalidate: 86400`)로 이미 캐시되고 있었으므로, 이번 개선의 실체는 **(a) 페이지 렌더 자체의 제거 + (b) 요청당 인증 API 2회 제거**다.

**부수 확인 (실측)**

- 개인화 누출 없음: authorization 쿠키를 첨부해도 캐시된 HTML이 **바이트 동일**, 수정/삭제 버튼 마크업 0건
- 장애 복원력: 백엔드를 완전히 내린 상태에서도 **이미 캐시된 글은 `200 STALE`로 정상 서빙**(전환 전에는 모든 글이 실패). 캐시에 없는 글만 실패하며, 실패는 캐시에 적재되지 않음(오염 없음)
- 첫 방문(캐시 생성) 1회는 ~0.43초, 이후 ~0.004초

**알려진 제약**

- 캐시에 없는 글을 백엔드 장애 중 최초 요청하면 ISR 온디맨드 "생성" 실패라 `error.tsx` 바운더리를 거치지 않고 Next 기본 500이 나간다(프레임워크 제약, 문서 확인함)
- 존재하지 않는 글이 404가 아닌 200으로 응답하는 soft-404 문제가 있으나, **ISR 전환과 무관한 기존 버그**(동적 라우트에서도 동일 재현) → 별도 이슈 #170

---

## 8. 관련 파일·PR 색인

**파일 (main 기준)**

- `src/app/(content)/posts/[id]/page.tsx` — 본 작업의 중심
- `src/features/posts/components/PostHeader.tsx`, `PostStats.tsx`, `PostCommentsSection.tsx`
- `src/features/posts/services/postService.server.ts` — getPostById 호출 체인 (fetch tags 확인 지점)
- `src/features/posts/utils/cacheInvalidation.ts` — 태그 설계
- `src/features/likes/` — actions/hooks/services
- `src/lib/auth.ts` (canEditPost), `src/hooks/useAuth.ts`, `src/contexts/AuthContext.tsx`
- `src/lib/useActionMutation.ts`
- `src/app/layout.tsx` — 인증 서버 주입 제거 대상 (Step 1)
- `src/lib/serverApiClient.ts` — 공용 fetch 분리 대상 (Step 2)
- `src/components/shared/layout/HeaderNavigation.tsx` — 헤더 로그인 UI 스켈레톤 (Step 1)
- 테스트 앵커: `src/contexts/__tests__/AuthContext.test.tsx` · `src/hooks/__tests__/useAuth.test.tsx` · `src/components/shared/layout/__tests__/HeaderNavigation.test.tsx`

**PR (배경 이해용)**

- #35 fetch revalidate 도입(2025-09) · #89 Server Action 무효화 · #109 RQ 시절 캐시 재설계 · #120 낙관적 업데이트 제거 · #122 공개 읽기 RSC 정리 · #141·#144 BFF 라우트 정리 · #146 백엔드 직접 호출 방침 · #166 서비스 레이어 단순화 · #22 CLS 개선(자기모순 방지 기준점)
