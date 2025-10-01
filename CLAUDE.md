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
- **TanStack Query (React Query)**: Server state management and caching
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

### Workflow Example
```bash
# 1. Create a new branch (English)
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

## Claude Code Instructions

When working on this project and completing tasks:

1. **Always recommend branch names in English** following the convention above
2. **Always recommend commit messages in Korean** following the convention above
3. **Include detailed commit body** with bullet points explaining the changes
4. **Use appropriate commit type** based on the nature of the changes
5. **Keep branch names concise** but descriptive enough to understand the purpose
6. **Enforce type safety**: Avoid using `any` type unless absolutely necessary
7. **Follow Single Responsibility Principle**: Design code with clear, focused purposes

### Example Task Completion Message
```
작업이 완료되었습니다.

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
- 항상 어떤 작업이 끝나면 브렌치 명을 추천
- 항상 어떤 작업이 끝나면 커밋 컨벤션 규칙에 따라 한국어로 내용 추천
