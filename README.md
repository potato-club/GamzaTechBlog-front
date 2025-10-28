# 🥔 감자 기술 블로그 (Gamza Tech Blog) - Frontend

<div align="center">
  <img src="docs/images/hero.png" alt="GamzaTechBlog" width="100%" />
</div>

<br />

> 한세대학교 IT학부 코딩 웹 동아리 "감자" 부원들을 위한 기술 블로그 플랫폼입니다.

이 프로젝트의 핵심은, 앱에서 작성한 모든 기술 문서를 사용자의 **개인 GitHub 저장소에 자동으로 동기화(Commit)**하여, 모든 기여를 **포트폴리오 자산으로 축적**해 주는 것입니다.

## 🔗 링크 (Links)

* **배포 주소:** <https://app.gamzatech.site/>
* **GitHub (Frontend):** <https://github.com/potato-club/GamzaTechBlog-front>
* **GitHub (Backend):** <https://github.com/potato-club/GamzaTechBlog-back>
* **Figma (Design):** <https://www.figma.com/design/tAaM7sfEPIKtYA1GFfthjk/%EA%B0%90%EC%9E%90-%EA%B8%B0%EC%88%A0-%EB%B8%94%EB%A1%9C%EA%B7%B8?node-id=716-1029&t=yQ5Cnu74UDqrRU7d-1>

## 🛠️ 기술 스택 (Tech Stack)

이 프로젝트는 다음과 같은 기술로 구성되어 있습니다.

| 구분 | 기술 |
| --- | --- |
| **Frontend** | Next.js (App Router), TypeScript, Tanstack-Query, Tailwind CSS, Shadcn/UI, Toast UI Editor |
| **Backend** | Java 21, Spring Boot 3.x, Spring Data JPA, MySQL, Redis |
| **Tools & CI/CD**| OpenAPI-Generator, Vercel, GitHub Actions |

## ✨ 주요 기능 (Key Features)

* **콘텐츠:** `Toast UI Editor`를 활용한 마크다운 기반 포스트 작성 (CRUD)
* **GitHub 동기화:** 앱에서 작성/수정 시, 개인 GitHub 레포지토리로 자동 커밋
* **인증:** HttpOnly 쿠키 기반 JWT 인증/인가
* **데이터:** `Tanstack-Query`를 활용한 서버 상태 관리 및 페이지네이션
* **소통:** 포스트별 댓글 기능 (낙관적 업데이트 적용)

## 🚀 시작하기

### 사전 요구사항

- Node.js 20.x 이상
- Yarn (권장) 또는 npm
- 백엔드 API 서버 실행 중 (선택사항)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/potato-club/GamzaTechBlog-front.git
cd GamzaTechBlog-front

# 의존성 설치
yarn install

# HTTP 개발 서버
yarn dev

# HTTPS 개발 서버 (로컬)
yarn dev:https:local

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 편집하여 필요한 환경 변수 설정
```

### 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정하세요:

| 변수명 | 설명 | 필수 여부 | 기본값 | 예시 |
|--------|------|-----------|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API 서버 주소 | 필수 | - | `https://gamzatech.site` |
| `JWT_SECRET_KEY` | JWT 토큰 검증용 시크릿 키 (백엔드와 동일한 값 사용) | 필수 | - | `your-secret-key-here` |


## 📁 프로젝트 구조

```
GamzaTechBlog-front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   ├── (content)/         # 콘텐츠 페이지
│   │   ├── (dashboard)/       # 대시보드
│   │   ├── admin/             # 관리자 페이지
│   │   ├── 403/               # 권한 오류 페이지
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈 페이지
│   ├── components/            # 공유 컴포넌트
│   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   ├── shared/           # 공통 컴포넌트
│   │   └── dynamic/          # 동적 컴포넌트
│   ├── features/             # 기능별 모듈
│   │   ├── admin/           # 관리자 기능
│   │   ├── auth/            # 인증
│   │   ├── chatbot/         # AI 챗봇
│   │   ├── comments/        # 댓글
│   │   ├── intro/           # 소개 페이지
│   │   ├── posts/           # 게시글
│   │   ├── search/          # 검색
│   │   ├── tags/            # 태그
│   │   └── user/            # 사용자
│   ├── generated/            # 자동 생성 코드
│   │   └── api/             # OpenAPI 클라이언트
│   ├── hooks/                # 공유 커스텀 훅
│   ├── lib/                  # 유틸리티 라이브러리
│   ├── providers/            # Context Providers
│   ├── types/                # TypeScript 타입 정의
│   ├── constants/            # 상수
│   └── enums/                # Enum 정의
├── middleware.ts             # Next.js 미들웨어
├── next.config.ts            # Next.js 설정
├── tailwind.config.ts        # Tailwind CSS 설정
├── tsconfig.json             # TypeScript 설정
└── components.json           # shadcn/ui 설정
```
## 💡 주요 문제 해결 (Problem Solving)

이 프로젝트를 진행하며 겪었던 주요 기술적 문제와 결정 사항입니다.

### 1. [HttpOnly 쿠키] 로컬(http) 환경에서의 인증 문제

* **[문제]**
    백엔드에서 보안 강화를 위해 JWT를 `HttpOnly`, `Secure` 플래그가 적용된 쿠키로 전송하기로 했습니다. 하지만 `Secure` 플래그는 HTTPS 환경에서만 쿠키를 전송하므로, 로컬 개발 환경(`http://localhost`)에서는 API 요청 시 인증 쿠키가 담기지 않는 문제가 발생했습니다.

* **[해결]**
    로컬에서도 `https` 환경을 구축하고, 백엔드와 협의하여 '부모 도메인' 쿠키 설정을 통해 로컬과 배포 환경 모두에서 인증 쿠키가 정상적으로 전송되도록 문제를 해결했습니다.

### 2. [OpenAPI-Generator] 백엔드 협업 효율성 및 타입 안정성

* **[문제]**
    백엔드 API 명세가 변경될 때마다 프론트엔드의 `interface` 타입을 수동으로 수정하며 오타나 누락으로 인한 **휴먼 에러(Human Error)**가 발생했습니다.

* **[해결]**
    `openapi-generator`를 도입하여, 백엔드 API 명세 파일(`swagger.json`)만 업데이트하면 모든 API 요청 함수와 타입을 자동으로 생성하도록 워크플로우를 구축했습니다.

* **[결과]**
    개발 효율성을 향상시키고, API 관련 휴먼 에러를 0에 가깝게 줄여 **타입-세이프(Type-Safe)한 코드**를 완성할 수 있었습니다.

### 3. [UX 개선] 낙관적 업데이트(Optimistic Update) 적용

* **[문제]**
    사용자가 댓글을 작성하면, 서버 응답이 올 때까지 UI에 아무런 변화가 없어 서비스가 느리게 느껴지는 문제가 있었습니다.

* **[해결]**
    `Tanstack-Query`의 `onMutate` 옵션을 활용하여 **낙관적 업데이트**를 구현했습니다. 사용자가 '등록' 버튼을 누르는 즉시 서버 응답을 기다리지 않고, UI에 먼저 댓글이 등록된 것처럼 보여주었습니다.

* **[결과]**
    사용자에게는 서버 딜레이 없는 즉각적인 피드백을 제공하여 UX를 크게 개선했습니다.


## 🔒 인증 시스템

### JWT 토큰 관리

- **AccessToken**: 짧은 만료 시간으로 API 요청 인증
- **RefreshToken**: HTTP-only 쿠키에 저장하여 XSS 공격 방어
  - `Secure` 플래그: HTTPS 환경에서만 전송
  - `SameSite` 속성: CSRF 공격 방어
  - JavaScript 접근 불가능으로 보안 강화
- 클라이언트에서 자동 토큰 갱신

### 보안 특징

- **XSS 방어**: RefreshToken을 HttpOnly 쿠키로 저장하여 JavaScript 접근 차단
- **CSRF 방어**: SameSite 쿠키 속성 적용
- **토큰 자동 갱신**: AccessToken 만료 시 RefreshToken으로 자동 갱신


---

**Made with ❤️ by Potato Club**
