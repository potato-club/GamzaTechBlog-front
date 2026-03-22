# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses **Yarn** as the package manager. Always use `yarn` instead of `npm`.

### Core Development
- `yarn dev` - Start development server
- `yarn dev:https:local` - Start HTTPS dev server on dev.gamzatech.site:3000
- `yarn dev:https` - Start HTTPS dev server on app.gamzatech.site
- `yarn build` - Build for production
- `yarn build:analyze` - Build with bundle analyzer
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### API Management
- `yarn gen:api` - Generate TypeScript API client from OpenAPI spec at gamzatech.site/v3/api-docs/all

## Architecture Overview

This is a Next.js 15 frontend for GamzaTechBlog, a Korean tech blog platform. The codebase follows a feature-based architecture with the following key patterns:

### Project Structure
- **Feature-based organization**: Each feature has its own folder in `src/features/` containing components, hooks, services, and types
- **API-first approach**: API client is auto-generated from OpenAPI specs in `src/generated/api/`
- **Shared components**: Reusable UI components in `src/components/` using shadcn/ui and Radix UI
- **Type safety**: Full TypeScript with Zod for validation

### Key Architecture Patterns

**API Client Architecture**:

- Dual API client system in `src/lib/apiClient.ts`
- `apiClient`: Client-side with automatic token refresh and request queuing
- `createServerApiClient()`: Server-side factory for SSR/SSG components
- Generated API types in `src/generated/api/` from OpenAPI spec (auto-regenerated)

**Route Structure**:

- `src/app/(auth)/`: Authentication pages (login, register)
- `src/app/(content)/`: Public content pages (posts, tags, search)
- `src/app/(dashboard)/`: User dashboard and profile
- `src/app/admin/`: Admin-only pages

### State Management
- **Server Actions / RSC**: Server-side data fetching and mutations
- **Zustand**: Client-side state management (stores not present in current codebase structure)
- **React Hook Form + Zod**: Form handling and validation

**Authentication Flow**:

- JWT-based with automatic refresh tokens
- Cookie-based token storage (`.gamzatech.site` domain)
- Proactive token refresh (1-minute buffer) + fallback reactive refresh
- Failed request queuing during token refresh

### Key Features
- **Posts**: Blog post creation, editing, viewing with markdown support using Toast UI Editor
- **Comments**: Nested commenting system
- **Authentication**: JWT-based auth with cookie management
- **Admin**: User approval system for new registrations
- **Search**: Full-text search with tag filtering
- **User Management**: Profile pages, user posts, likes tracking
- **Responsive Design**: Mobile-first with Tailwind CSS

### Styling & UI
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: Component library built on Radix UI
- **Toast UI Editor**: Markdown editor for blog posts
- **Next Themes**: Dark/light mode support
- **Pretendard Font**: Korean typography

### API Integration
- **Generated Client**: TypeScript client auto-generated from OpenAPI spec
- **Centralized Services**: Each feature has a service layer (`*Service.ts`) that wraps the API client
- **Type Definitions**: All API types are generated and imported from `@/generated/api`

### Performance Optimizations
- **Bundle Analysis**: Available via `build:analyze` command
- **Image Optimization**: WebP/AVIF support with optimized sizes
- **Package Optimization**: Experimental package imports optimization for large libraries
- **Caching**: Aggressive caching headers for static assets

### Development Notes
- **Lint Configuration**: Uses Naver ESLint config with Prettier
- **SSL Support**: Local HTTPS development with custom certificates
- **Hot Reload**: Standard Next.js development experience
- **TypeScript**: Strict mode enabled with proper type checking

The application follows modern React patterns with server and client components, leveraging Next.js 15 features for optimal performance and user experience.

## Git Workflow Guide

### Branch Naming Convention
When creating branches for new work, always use **English** with the following format:

**Format**: `<type>/<short-description>`

**Types**:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `style/` - Code style changes (formatting, missing semicolons, etc.)
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks (dependencies, config, etc.)
- `perf/` - Performance improvements

**Examples**:
```bash
feat/add-user-profile
fix/auth-token-expiry
docs/update-readme
refactor/post-service-layer
style/format-components
chore/update-dependencies
```

### Commit Message Convention
Write commit messages in **Korean** using the following format:

**Format**: `<type>: <subject>`

**Additional body (optional)**: Provide detailed explanation with bullet points

**Types** (same as branch types):
- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `docs:` - 문서 수정
- `style:` - 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 코드 추가 또는 수정
- `chore:` - 빌드 업무, 패키지 매니저 설정 등
- `perf:` - 성능 개선

**Examples**:
```bash
feat: 사용자 프로필 페이지 추가

- 프로필 정보 조회 API 연동
- 프로필 이미지 업로드 기능 구현
- 반응형 레이아웃 적용
```

```bash
fix: 로그인 토큰 만료 처리 오류 수정

- 토큰 갱신 로직 개선
- 만료 시 자동 로그아웃 처리
```

```bash
docs: README.md 작성 및 프로젝트 소개 추가

- 프로젝트 개요 및 주요 기능 설명
- 설치 및 개발 가이드 작성
- 감자 동아리 소개 추가
```

### Commit Guidelines
1. **Atomic commits**: Each commit should represent a single logical change
2. **Clear subject**: Keep the subject line concise (50 characters or less)
3. **Detailed body**: Use bullet points to explain what and why (not how)
4. **Present tense**: Use present tense in Korean ("추가한다" not "추가했다")
5. **Reference issues**: Include issue numbers if applicable (e.g., `#123`)
6. **No Co-Authored-By**: Never include `Co-Authored-By: Claude` or any AI attribution in commit messages

### Workflow Example
```bash
# 1. Create a new branch from main (English)
git checkout main
git pull origin main
git checkout -b feat/add-comment-system

# 2. Make changes and commit (Korean)
git add .
git commit -m "feat: 댓글 시스템 추가

- 댓글 작성 및 수정 기능 구현
- 중첩 댓글 지원
- 실시간 댓글 업데이트"

# 3. Push to remote
git push origin feat/add-comment-system

# 4. Create Pull Request with Korean description
```

## GitHub Issue & PR Workflow

**이 프로젝트는 모든 작업에 대해 이슈 → 브랜치 → PR 순서를 반드시 따른다.**
작업의 맥락과 결정 근거를 문서로 남기는 것을 최우선으로 한다.

### 필수 워크플로우 순서

```
1. Issue 생성  →  2. Branch 생성  →  3. 작업 & 커밋  →  4. PR 생성  →  5. Merge
```

모든 코드 변경은 반드시 이 순서를 거쳐야 한다. 이슈 없이 브랜치를 만들거나, PR 없이 main에 직접 push하는 것은 금지한다.

---

### Step 1. Issue 생성

작업을 시작하기 전에 **반드시 GitHub Issue를 먼저 생성**한다.

**Issue 작성 형식**:
```
제목: [type] 작업 내용을 간결하게 (한국어)
예시: [feat] 댓글 시스템 추가
      [fix] 로그인 토큰 만료 처리 오류
      [chore] next 패키지 보안 취약점 업데이트
```

**Issue 본문 구조**:
```markdown
## 개요
이 작업이 필요한 이유와 해결하려는 문제를 설명한다.

## 작업 내용
- [ ] 구체적인 작업 항목 1
- [ ] 구체적인 작업 항목 2

## 참고 사항
관련 링크, CVE 번호, 관련 이슈 등 (선택)
```

**gh CLI로 이슈 생성**:
```bash
gh issue create --title "[feat] 댓글 시스템 추가" --body "..."
```

---

### Step 2. Branch 생성

이슈 번호를 브랜치명에 반드시 포함한다.

**형식**: `<type>/<issue-number>-<short-description>`

> **중요**: 브랜치는 **반드시 `main` 브랜치에서** 분기한다. 현재 체크아웃된 브랜치와 관계없이 항상 최신 `main`을 기준으로 생성한다.

```bash
# 항상 main에서 분기
git checkout main
git pull origin main
git checkout -b feat/42-add-comment-system

# 이슈 번호 포함 예시
git checkout -b fix/38-auth-token-expiry
git checkout -b chore/55-update-next-security
```

---

### Step 3. 작업 & 커밋

커밋 메시지 본문에 이슈 번호를 참조한다.

```bash
git commit -m "feat: 댓글 작성 기능 구현

- 댓글 API 연동
- 중첩 댓글 UI 구현

ref #42"
```

---

### Step 4. PR 생성

PR은 반드시 연결된 이슈를 닫도록 `Closes #N`을 본문에 포함한다.

**PR 제목**: 이슈 제목과 동일하게 작성 (한국어)

**PR 본문 구조**:
```markdown
## 개요
이 PR이 해결하는 문제와 접근 방식을 설명한다.

## 변경 사항
- 변경된 주요 내용 1
- 변경된 주요 내용 2

## 테스트
- [ ] 빌드 성공 확인 (`yarn build`)
- [ ] 주요 기능 동작 확인

Closes #42
```

**gh CLI로 PR 생성**:
```bash
gh pr create \
  --title "[feat] 댓글 시스템 추가" \
  --body "..." \
  --base main
```

---

### Claude Code 작업 시 필수 규칙

Claude가 이 프로젝트에서 작업할 때 반드시 따라야 할 순서:

1. **작업 전**: `gh issue create`로 이슈 먼저 생성
2. **브랜치 생성**: 이슈 번호 포함한 브랜치명 사용
3. **작업 완료 후**: `gh pr create`로 PR 생성 (Closes #N 포함)
4. **PR URL을 사용자에게 반드시 공유**

이슈와 PR 없이 "브랜치명: xxx, 커밋 메시지: yyy" 형태로만 안내하는 것은 불충분하다.
실제로 이슈와 PR을 생성하거나, 사용자에게 생성을 요청해야 한다.

## Coding Standards

### Type Safety
- **Avoid `any` type**: Almost never use `any` type. Use proper types, generics, or `unknown` instead.
  - ❌ Bad: `const data: any = response.data`
  - ✅ Good: `const data: ResponseType = response.data`
  - ✅ Acceptable: `const data: unknown = response.data` (with type guards)

### Code Design Principles
- **Single Responsibility Principle**: Each function, component, and module should have one clear purpose.
  - Functions should do one thing well
  - Components should have a single, well-defined responsibility
  - Services should handle one domain of logic
  - Keep functions small and focused (ideally under 20 lines)

### Loading State & Skeleton Components

#### shadcn Skeleton 사용 원칙
- **항상 shadcn Skeleton 사용**: 커스텀 `animate-pulse` + `bg-gray-200` 사용 금지
  - ❌ Bad: `<div className="animate-pulse"><div className="h-4 w-full bg-gray-200 rounded"></div></div>`
  - ✅ Good: `<Skeleton className="h-4 w-full" />`
- **컴포넌트 분리**: 로딩 상태는 별도 `*Skeleton.tsx` 컴포넌트로 분리
  - ❌ Bad: 인라인으로 skeleton 작성
  - ✅ Good: `<PostListSkeleton count={5} />`
- **일관성**: 기존 skeleton 패턴 따르기
  - `count` prop으로 반복 개수 제어
  - `Array.from({ length: count })` 패턴 사용 (not `[...Array(count)]`)
- **테마 토큰**: 하드코딩된 색상 대신 테마 토큰 사용
  - ❌ Bad: `bg-gray-200`, `bg-gray-300`
  - ✅ Good: shadcn Skeleton (자동으로 `bg-accent` 사용)

#### Skeleton 컴포넌트 구조
- **위치**:
  - 기능별: `src/features/[feature]/components/skeletons/`
  - 공통: `src/components/shared/skeletons/`
- **명명**: `[ComponentName]Skeleton.tsx`
- **Props**: `count`, `showAvatar`, `showImage` 등으로 유연성 제공
- **JSDoc**: 모든 skeleton 컴포넌트에 사용 예시 포함

#### 공통 Skeleton 패턴
프로젝트에서 제공하는 재사용 가능한 skeleton 컴포넌트:

- **CardSkeleton**: 카드 레이아웃 로딩 (게시글 카드, 프로필 카드 등)
  ```tsx
  import { CardSkeleton } from "@/components/shared/skeletons";
  <CardSkeleton count={5} showImage={true} showMeta={true} />
  ```

- **ListSkeleton**: 리스트 레이아웃 로딩 (댓글 목록, 사용자 목록 등)
  ```tsx
  import { ListSkeleton } from "@/components/shared/skeletons";
  <ListSkeleton items={5} showAvatar={true} avatarSize="md" />
  ```

- **FormSkeleton**: 폼 레이아웃 로딩 (수정, 작성 페이지 등)
  ```tsx
  import { FormSkeleton } from "@/components/shared/skeletons";
  <FormSkeleton fields={4} showButtons={true} showTitle={true} />
  ```

#### 사용 예시
```tsx
// ❌ 나쁜 예: 인라인 커스텀 skeleton
{isLoading && (
  <div className="animate-pulse">
    <div className="h-4 w-full bg-gray-200 rounded"></div>
  </div>
)}

// ✅ 좋은 예: 분리된 shadcn Skeleton 컴포넌트
import PostListSkeleton from "./skeletons/PostListSkeleton";

{isLoading && <PostListSkeleton count={5} />}

// ✅ 더 좋은 예: 공통 패턴 재사용
import { CardSkeleton } from "@/components/shared/skeletons";

{isLoading && <CardSkeleton count={5} />}
```

## Claude Code Instructions

When working on this project and completing tasks:

1. **Issue → Branch → PR 워크플로우 필수 준수**: 모든 작업은 이슈 생성으로 시작하고 PR 생성으로 마무리한다
2. **Always create GitHub Issue first**: `gh issue create`로 이슈를 생성한 후 작업을 시작한다
3. **Always include issue number in branch name**: `feat/42-add-comment-system` 형식으로 브랜치를 생성한다
4. **Always create PR with `Closes #N`**: 작업 완료 후 `gh pr create`로 PR을 생성하고 이슈를 연결한다
5. **Always share PR URL with the user**: PR 생성 후 URL을 반드시 사용자에게 전달한다
6. **Always recommend branch names in English** following the convention above
7. **Always recommend commit messages in Korean** following the convention above
8. **Include detailed commit body** with bullet points explaining the changes
9. **Use appropriate commit type** based on the nature of the changes
10. **Keep branch names concise** but descriptive enough to understand the purpose
11. **Enforce type safety**: Avoid using `any` type unless absolutely necessary
12. **Follow Single Responsibility Principle**: Design code with clear, focused purposes
13. **Always run build test after completing a task**: Run `yarn build` to verify no breaking changes
14. **Provide appropriate complexity solutions**: Consider user context (4th year university student, graduation pending)

### Build Testing Protocol

**IMPORTANT**: Always run build test after completing any task to ensure no breaking changes.

```bash
# Clean build test
rm -rf .next && yarn build

# If build succeeds, proceed with commit
# If build fails, fix errors before committing
```

**When to run build test**:
- ✅ After completing any feature implementation
- ✅ After refactoring code
- ✅ Before creating a commit
- ✅ Before creating a pull request
- ✅ After resolving merge conflicts

### Solution Complexity Guidelines

**User Context**: 4th year university student, graduation pending

**Approach Strategy**:
1. **Prefer Simple Solutions First**: Start with straightforward approaches
   - Direct implementation over complex patterns
   - Built-in features over custom abstractions
   - Clear code over clever code

2. **Offer Multiple Complexity Levels**: Provide options from simple to advanced
   ```
   Option 1 (Simple): Inline solution with clear logic
   Option 2 (Moderate): Extracted function with better organization
   Option 3 (Advanced): Pattern-based approach with scalability
   ```

3. **Explain Trade-offs Clearly**: Help understand pros/cons
   - Time to implement vs. long-term maintainability
   - Complexity vs. flexibility
   - Current needs vs. future scalability

4. **Recommend Advanced Patterns When Justified**:
   - **DO recommend** complex patterns for:
     - Core business logic requiring scalability
     - Repeated patterns across multiple features
     - Performance-critical operations
     - Security-sensitive implementations
   - **DON'T over-engineer** for:
     - One-off features
     - Prototype/experimental code
     - Simple CRUD operations
     - UI components with limited scope

**Example Recommendations**:

```typescript
// ✅ Good: Simple solution for one-time use
// User asks: "How do I format this date?"
const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR');

// ✅ Good: Moderate solution when used in 3+ places
// User asks: "I need this date format in multiple components"
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR');
};

// ✅ Good: Advanced solution when justified
// User asks: "I need flexible date formatting across the app with i18n"
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: string, formatString: string = 'PPP') => {
  return format(new Date(date), formatString, { locale: ko });
};

// ❌ Bad: Over-engineering for simple case
// User asks: "How do I format this date?"
// DON'T immediately suggest: date-fns library, custom date service layer,
// date formatting factory pattern, etc.
```

**Decision Framework**:
- **Simple**: Will this be used once or twice? → Direct implementation
- **Moderate**: Used 3-5 times? → Extract to utility function
- **Advanced**: Core feature used everywhere? → Consider pattern/abstraction

### Example Task Completion Message
```
작업이 완료되었습니다.

✅ 빌드 테스트 완료: yarn build 성공

브랜치명: feat/add-search-filter
커밋 메시지:
feat: 검색 필터 기능 추가

- 태그 기반 필터링 구현
- 날짜 범위 검색 추가
- 검색 결과 정렬 옵션 제공
```

## Rules

- 너는 10년 이상의 프론트엔드 시니어 개발자라는 것을 명심할 것.
- 코드 수정 시, 단순히 현재의 문제를 해결하는 것이 아닌 근본적인 문제를 파악한 후, 해당 근본적 오류를 수정하는 방향으로 진행.
- 코드는 항상 보기 좋게, 이해하기 쉽도록 작성할 것.
- 스타일링이나 레이아웃 수정에 대한 언급이 없다면, 로직 수정 중에 스타일링이나 레이아웃에 관련된 스타일링 코드는 수정하지 말 것.
- **문제 분석 및 해결 프로세스**:
  1. 사용자가 문제를 질문하면, 먼저 문제 원인을 분석하고 설명
  2. 해결 방법을 제시하고 적용 여부를 사용자에게 확인
  3. 사용자의 승인을 받은 후에만 코드 수정 진행
  4. 긴급하거나 명확한 버그 수정 요청이 아닌 한, 자동으로 코드를 수정하지 말 것
- **모든 작업은 반드시 Issue → Branch → PR 순서를 따를 것**: 이슈 없이 작업 시작 금지, PR 없이 main 직접 push 금지
- 항상 어떤 작업이 끝나면 브렌치 명을 추천 (이슈 번호 포함: `feat/42-description`)
- 항상 어떤 작업이 끝나면 커밋 컨벤션 규칙에 따라 한국어로 내용 추천
- 항상 어떤 작업이 끝나면 PR을 생성하고 URL을 사용자에게 공유할 것
