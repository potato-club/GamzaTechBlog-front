# Skeleton 마이그레이션 테스트 체크리스트

shadcn Skeleton 컴포넌트로의 마이그레이션 완료 후 테스트를 위한 체크리스트입니다.

## 📋 전체 페이지 로딩 테스트

### 메인 페이지 (/)
- [ ] 게시글 목록 로딩 (`PostListSkeleton`)
- [ ] 인기 게시글 로딩 (`PopularPostListSkeleton`)
- [ ] 사이드바 로딩 (`SidebarSkeleton`)
- [ ] 태그 섹션 로딩 (`TagsSkeleton`)
- [ ] 로고 영역 로딩 (`LogoSkeleton`)

### 검색 페이지 (/search)
- [ ] 검색 결과 로딩 (`SearchResultsSkeleton`)
- [ ] 검색 사이드바 로딩 (`SearchSidebarSkeleton`)

### 게시글 상세 페이지 (/posts/[id])
- [ ] 게시글 내용 로딩 (`PostDetailSkeleton`)
- [ ] 댓글 섹션 로딩 (`PostCommentsSectionSkeleton`, `CommentsSkeleton`)
- [ ] 마크다운 뷰어 로딩 (`MarkdownViewerSkeleton`)

### 대시보드 (/dashboard)
- [ ] 대시보드 컨텐츠 로딩 (loading.tsx)
- [ ] 사용자 프로필 섹션 로딩 (`IntroListSkeleton`)

### 관리자 페이지 (/admin)
- [ ] 사용자 승인 목록 로딩 (admin page skeleton)

### 에디터 페이지 (/posts/write, /posts/[id]/edit)
- [ ] 에디터 로딩 (`EditorSkeleton`)
- [ ] Toast 에디터 로딩 (`ToastEditorSkeleton`)

### 챗봇
- [ ] 챗봇 응답 로딩 (`SkeletonContent`)

---

## 🎨 시각적 검증

### 데스크탑 (1920x1080)
- [ ] 모든 skeleton이 원래 레이아웃과 일치
- [ ] 애니메이션이 부드럽게 작동 (60fps)
- [ ] Skeleton 너비/높이가 실제 컨텐츠와 유사
- [ ] 간격(spacing)이 실제 컨텐츠와 일치

### 태블릿 (768x1024)
- [ ] 반응형 레이아웃 정상 작동
- [ ] 브레이크포인트 전환 시 깨짐 없음
- [ ] 터치 인터랙션 문제 없음

### 모바일 (375x667)
- [ ] 모바일 레이아웃 정상 작동
- [ ] 좁은 화면에서 skeleton이 깨지지 않음
- [ ] 스크롤 성능 정상

---

## 🎭 다크모드 테스트

### 라이트 모드
- [ ] 모든 skeleton이 라이트 모드에서 정상 표시
- [ ] 색상이 테마와 조화로움 (`bg-accent` 적용)
- [ ] 배경색과 skeleton 색상 대비가 적절함

### 다크 모드
- [ ] 모든 skeleton이 다크 모드에서 정상 표시
- [ ] 하드코딩된 `bg-gray-200` 없음 (테마 토큰 사용)
- [ ] 다크 모드 skeleton이 눈에 부담되지 않음

### 테마 전환
- [ ] 라이트 ↔ 다크 전환 시 깜빡임 없음
- [ ] 테마 전환 시 skeleton이 즉시 업데이트됨
- [ ] 로딩 중 테마 전환 시에도 정상 작동

---

## ⚡ 상태 전환 테스트

### Skeleton → 실제 데이터
- [ ] 전환이 자연스럽고 부드러움
- [ ] 레이아웃 시프트(CLS) 없음
- [ ] 데이터 로드 완료 시 skeleton이 즉시 사라짐
- [ ] 전환 시 깜빡임이나 깨짐 없음

### 실제 데이터 → Skeleton (재로딩)
- [ ] 재로딩 시 skeleton이 즉시 표시됨
- [ ] 기존 컨텐츠가 자연스럽게 skeleton으로 변경
- [ ] 스크롤 위치 유지

### 에러 상태
- [ ] 에러 발생 시 skeleton이 사라지고 에러 메시지 표시
- [ ] 재시도 시 skeleton이 다시 표시됨

---

## ♿ 접근성 테스트

### 스크린 리더
- [ ] `role="status"` 속성이 적절히 적용됨
- [ ] `aria-label` 속성으로 로딩 상태 설명
- [ ] 스크린 리더가 "로딩 중" 상태를 알림
- [ ] Skeleton이 사라질 때 새 컨텐츠 안내

### 키보드 네비게이션
- [ ] Skeleton 표시 중에도 키보드 네비게이션 정상
- [ ] Tab 키로 포커스 이동 시 문제 없음
- [ ] Skeleton이 키보드 트랩을 발생시키지 않음

### 색상 대비
- [ ] WCAG AA 기준 충족 (대비율 4.5:1 이상)
- [ ] 저시력 사용자가 skeleton을 인식 가능
- [ ] 고대비 모드에서도 정상 표시

---

## 🚀 성능 테스트

### 렌더링 성능
- [ ] Skeleton 렌더링 시 60fps 유지
- [ ] 다수의 skeleton 동시 렌더링 시 버벅임 없음
- [ ] CPU 사용률이 과도하게 증가하지 않음

### 애니메이션 성능
- [ ] `animate-pulse` 애니메이션이 부드러움
- [ ] GPU 가속 정상 작동
- [ ] 저사양 기기에서도 정상 작동

### 메모리 사용
- [ ] Skeleton 컴포넌트 마운트/언마운트 시 메모리 누수 없음
- [ ] 장시간 페이지 사용 시 메모리 증가 없음

---

## 🧪 기능 테스트

### Count Prop
- [ ] `count` prop으로 skeleton 개수 조절 가능
- [ ] `count={0}` 시 아무것도 렌더링되지 않음
- [ ] 큰 count 값(50+)에서도 정상 작동

### 조건부 렌더링
- [ ] `showImage`, `showAvatar` 등 조건부 prop 정상 작동
- [ ] 공통 skeleton 컴포넌트 (CardSkeleton, ListSkeleton, FormSkeleton) props 동작 확인

### React Query 통합
- [ ] `isLoading` 상태에서 skeleton 표시
- [ ] `isFetching` 시 적절한 skeleton 표시
- [ ] Suspense boundary와 정상 작동

---

## 📐 레이아웃 테스트

### Cumulative Layout Shift (CLS)
- [ ] Skeleton → 컨텐츠 전환 시 CLS 점수 0.1 미만
- [ ] 이미지 로드 시 레이아웃 깨짐 없음
- [ ] 동적 컨텐츠 로드 시 주변 요소 이동 없음

### Flexbox/Grid 레이아웃
- [ ] Flex 컨테이너 내 skeleton 정상 배치
- [ ] Grid 레이아웃 내 skeleton 정상 배치
- [ ] 반응형 grid 전환 시 skeleton도 적절히 조정

---

## 🔍 코드 품질 검증

### ESLint 검증
- [ ] `yarn lint` 통과
- [ ] 새로운 warning 없음
- [ ] Prettier 포맷팅 규칙 준수

### TypeScript 검증
- [ ] 타입 에러 없음
- [ ] Props 인터페이스 정의 완료
- [ ] `any` 타입 사용 없음

### 코드 일관성
- [ ] 모든 skeleton이 `Array.from({ length: count })` 패턴 사용
- [ ] 모든 skeleton이 shadcn `<Skeleton>` 컴포넌트 사용
- [ ] `animate-pulse`, `bg-gray-200` 완전 제거
- [ ] JSDoc 주석 완비

---

## 📚 문서화 검증

### JSDoc
- [ ] 모든 skeleton 컴포넌트에 JSDoc 작성
- [ ] `@description`, `@param`, `@returns` 태그 포함
- [ ] `@example` 코드 블록 포함

### CLAUDE.md
- [ ] Skeleton 사용 가이드라인 추가 완료
- [ ] 공통 패턴 컴포넌트 문서화 완료
- [ ] 사용 예시 코드 포함

### README 또는 프로젝트 문서
- [ ] 프로젝트 문서에 skeleton 사용법 안내 (선택사항)

---

## ✅ 최종 체크리스트

### 마이그레이션 완료
- [ ] 모든 커스텀 `animate-pulse` 제거
- [ ] 모든 `bg-gray-200`, `bg-gray-300` 제거
- [ ] shadcn Skeleton으로 100% 전환

### 재사용성
- [ ] CardSkeleton, ListSkeleton, FormSkeleton 생성 완료
- [ ] 공통 skeleton을 `@/components/shared/skeletons`에서 export

### 품질 보증
- [ ] 모든 테스트 항목 통과
- [ ] 시각적 회귀 테스트 완료
- [ ] 성능 지표 개선 또는 유지

---

## 🐛 알려진 이슈

이슈가 발견되면 여기에 기록하고 추적합니다.

- 없음

---

## 📝 테스트 실행 날짜

- **테스트 실행일**: YYYY-MM-DD
- **테스트 담당자**:
- **브라우저**: Chrome, Safari, Firefox
- **테스트 환경**: macOS, Windows, iOS, Android

---

## 🎯 성공 기준

- ✅ 모든 체크리스트 항목 완료
- ✅ 접근성 기준 충족 (WCAG AA)
- ✅ 성능 저하 없음 (또는 개선)
- ✅ 시각적 일관성 유지
- ✅ 0개의 ESLint 에러
- ✅ 모든 TypeScript 타입 에러 해결
