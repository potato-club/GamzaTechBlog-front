# 🥔 감자 기술 블로그 (Gamza Tech Blog)

> "감자에서 시작되는 진짜 개발 이야기"

감자 기술 블로그는 개발자들이 지식을 공유하고 소통할 수 있는 현대적인 기술 블로그 플랫폼입니다. Next.js와 TypeScript를 기반으로 구축되어 빠르고 안정적인 사용자 경험을 제공합니다.

![Gamza Tech Blog](https://github.com/user-attachments/assets/82540a59-3b6c-4209-bf56-f97f2b436c20)

## 🌟 프로젝트 하이라이트

- **🚀 최신 기술 스택**: Next.js 15, React 19, TypeScript로 구축된 모던 웹 애플리케이션
- **📱 완전 반응형**: 모바일부터 데스크톱까지 모든 디바이스에서 최적화된 경험
- **⚡ 빠른 성능**: App Router와 서버 컴포넌트를 활용한 뛰어난 성능
- **🎨 아름다운 UI**: TailwindCSS와 Shadcn/UI로 구현된 모던하고 직관적인 인터페이스
- **🔒 안전한 인증**: GitHub OAuth를 통한 보안성 높은 로그인 시스템

## ✨ 주요 기능

### 📝 콘텐츠 관리
- **마크다운 에디터**: Toast UI Editor를 활용한 실시간 마크다운 편집
- **코드 하이라이팅**: 다양한 프로그래밍 언어 문법 지원
- **수학 공식**: KaTeX를 통한 수학 공식 렌더링
- **이미지 업로드**: AWS S3를 통한 안전한 이미지 관리
- **태그 시스템**: 게시글 분류 및 검색 최적화

### 👥 사용자 관리
- **GitHub 소셜 로그인**: 간편한 인증 시스템
- **프로필 관리**: 개인 정보 및 활동 기록 관리
- **권한 관리**: 일반 사용자와 관리자 권한 분리

### 🔍 검색 및 탐색
- **실시간 검색**: 제목, 내용, 태그 기반 통합 검색
- **태그 필터링**: 관심 분야별 게시글 필터링
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

### 🎨 사용자 경험
- **무한 스크롤**: 부드러운 콘텐츠 탐색
- **로딩 스켈레톤**: 향상된 사용자 피드백
- **접근성**: WCAG 가이드라인 준수
- **SEO 최적화**: 검색 엔진 친화적인 메타데이터 관리
- **성능 최적화**: 이미지 최적화, 코드 스플리팅, 캐싱 전략

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.3.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4, Shadcn/UI
- **UI Components**: Radix UI, Lucide React
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Editor**: Toast UI Editor
- **Markdown**: React Markdown, Remark, Rehype

### Development Tools
- **Package Manager**: Yarn
- **Linting**: ESLint (Airbnb Config)
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Build Tool**: Next.js Compiler

### Infrastructure
- **Image Storage**: AWS S3
- **Authentication**: GitHub OAuth
- **Deployment**: Vercel (추정)

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- Yarn 1.22+
- Git

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/potato-club/GamzaTechBlog-front.git
cd GamzaTechBlog-front
```

2. **의존성 설치**
```bash
yarn install
```

3. **환경 변수 설정**
```bash
# .env.local 파일 생성 후 필요한 환경 변수 설정
cp .env.example .env.local
```

필요한 환경 변수:
```bash
# GitHub OAuth 설정
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AWS S3 설정 (이미지 업로드용)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=your_bucket_name

# 백엔드 API URL
NEXT_PUBLIC_API_URL=https://api.gamzatech.site
```

4. **개발 서버 실행**
```bash
# 일반 개발 서버
yarn dev

# HTTPS 로컬 개발 서버
yarn dev:https:local

# 프로덕션용 HTTPS 서버
yarn dev:https
```

5. **브라우저에서 확인**
- 일반: http://localhost:3000
- HTTPS: https://dev.gamzatech.site:3000

### 빌드 및 배포

```bash
# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# 코드 품질 검사
yarn lint
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (content)/         # 콘텐츠 페이지
│   ├── (dashboard)/       # 대시보드 페이지
│   └── admin/             # 관리자 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── features/          # 기능별 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 라이브러리
├── providers/             # Context Providers
├── services/              # API 서비스
├── types/                 # TypeScript 타입 정의
└── utils/                 # 헬퍼 함수
```

## 💻 사용법

### 기본 사용법

1. **회원가입/로그인**
   - GitHub 계정으로 간편 로그인
   - 프로필 정보 설정

2. **게시글 작성**
   - `/posts/new`에서 새 게시글 작성
   - 마크다운 문법으로 작성
   - 태그 추가로 분류

3. **게시글 관리**
   - 내가 작성한 게시글 수정/삭제
   - 마이페이지에서 활동 기록 확인

4. **콘텐츠 탐색**
   - 메인 페이지에서 최신 게시글 확인
   - 태그별 필터링
   - 검색 기능 활용

### 관리자 기능

- **사용자 관리**: 사용자 권한 설정
- **콘텐츠 관리**: 부적절한 콘텐츠 관리
- **시스템 모니터링**: 사이트 통계 및 성능 모니터링

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 다음 단계를 따라주세요:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 개발 가이드라인

- **코드 스타일**: ESLint + Prettier 설정 준수
- **커밋 메시지**: [Conventional Commits](https://conventionalcommits.org/) 형식 사용
- **테스팅**: 새로운 기능에 대한 테스트 작성 권장
- **문서화**: 주요 변경사항은 문서 업데이트 필요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🔗 관련 링크

- **백엔드 저장소**: [GamzaTechBlog-back](https://github.com/potato-club/GamzaTechBlog-back)
- **이슈 트래커**: [GitHub Issues](https://github.com/potato-club/GamzaTechBlog-front/issues)
- **위키**: [프로젝트 위키](https://github.com/potato-club/GamzaTechBlog-front/wiki)

## 🔧 문제 해결

### 자주 발생하는 문제

**1. 의존성 설치 오류**
```bash
# node_modules와 yarn.lock 삭제 후 재설치
rm -rf node_modules yarn.lock
yarn install
```

**2. 빌드 오류**
```bash
# TypeScript 타입 검사
yarn tsc --noEmit

# 캐시 삭제 후 다시 빌드
rm -rf .next
yarn build
```

**3. 개발 서버 실행 오류**
```bash
# 포트 충돌 시 다른 포트 사용
yarn dev -p 3001
```

**4. 환경 변수 문제**
- `.env.local` 파일이 올바른 위치(프로젝트 루트)에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_` 접두사 주의)

## 📸 스크린샷

### 메인 페이지
![Main Page](https://github.com/user-attachments/assets/82540a59-3b6c-4209-bf56-f97f2b436c20)

*깔끔하고 직관적인 메인 페이지 디자인으로 사용자들이 쉽게 콘텐츠를 탐색할 수 있습니다.*

## 📞 문의

- **팀**: Potato Club
- **이메일**: contact@potatoclub.dev (예시)
- **GitHub**: [@potato-club](https://github.com/potato-club)

---

**감자 기술 블로그**로 여러분의 개발 지식을 공유하고, 함께 성장해보세요! 🚀
