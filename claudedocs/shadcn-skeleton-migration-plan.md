# shadcn Skeleton 컴포넌트 마이그레이션 계획

## 📊 분석 요약

**총 47개 파일 분석 완료** (2025-10-02)

| 상태 | 파일 수 | 비율 |
|------|---------|------|
| ✅ shadcn Skeleton 사용 중 | 15개 | 31.9% |
| ⚠️ 커스텀 animate-pulse 사용 | 10개 | 21.3% |
| ⚠️ 텍스트만 표시 | 3개 | 6.4% |
| ✅ 최적화 완료 | 19개 | 40.4% |

**총 마이그레이션 예상 시간**: ~90분 (작업 + 테스트 포함 1-2일)

---

## 🎯 마이그레이션 대상 파일

### 🔴 High Priority (Week 1)

#### 1. PostListSkeleton ⭐ HIGH IMPACT
- **파일**: `src/features/posts/components/skeletons/PostListSkeleton.tsx`
- **라인**: 14-24
- **영향도**: 높음 - 메인 게시글 목록 로딩
- **예상 시간**: 5분

**Before**:
```tsx
export default function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <div className="flex-3">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
      <div className="mt-8 flex flex-col gap-8">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <div className="flex-3">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="mt-8 flex flex-col gap-8">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

#### 2. SearchPageContent ⭐ HIGH IMPACT
- **파일**: `src/features/search/components/SearchPageContent.tsx`
- **라인**: 69-76, 82-89
- **영향도**: 높음 - 검색 결과 페이지
- **예상 시간**: 10분

**Before**:
```tsx
<div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8">
  {[...Array(3)].map((_, index) => (
    <div key={index} className="animate-pulse">
      <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 md:h-6"></div>
      <div className="mb-2 h-3 w-1/2 rounded bg-gray-200 md:h-4"></div>
      <div className="h-3 w-full rounded bg-gray-200 md:h-4"></div>
    </div>
  ))}
</div>
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8">
  {Array.from({ length: 3 }, (_, index) => (
    <div key={index} className="space-y-2">
      <Skeleton className="h-5 w-3/4 md:h-6" />
      <Skeleton className="h-3 w-1/2 md:h-4" />
      <Skeleton className="h-3 w-full md:h-4" />
    </div>
  ))}
</div>
```

---

#### 3. loading.tsx (root) ⭐ HIGH IMPACT
- **파일**: `src/app/loading.tsx`
- **라인**: 14-69
- **영향도**: 높음 - 앱 전역 로딩
- **복잡도**: Medium
- **예상 시간**: 20분

**Before**:
```tsx
// 광범위한 커스텀 animate-pulse skeleton
<div className="animate-pulse">
  <div className="h-10 w-48 rounded bg-gray-200"></div>
  {/* ... 많은 커스텀 skeleton 코드 */}
</div>
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="space-y-4">
  <Skeleton className="h-10 w-48" />
  {/* shadcn Skeleton으로 전환 */}
</div>
```

---

### 🟡 Medium Priority (Week 2)

#### 4. SkeletonContent (Chatbot) ⭐ MEDIUM IMPACT
- **파일**: `src/features/chatbot/components/messages/SkeletonContent.tsx`
- **라인**: 1-9
- **영향도**: 중간 - 챗봇 응답 로딩
- **예상 시간**: 5분

**Before**:
```tsx
const SkeletonContent = () => (
  <div className="space-y-2">
    <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
    <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
    <div className="h-4 w-[200px] animate-pulse rounded bg-gray-200"></div>
  </div>
);
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonContent = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
);
```

---

#### 5. IntroList ⭐ MEDIUM IMPACT
- **파일**: `src/features/intro/components/IntroList.tsx`
- **라인**: 28-45
- **영향도**: 중간 - 사용자 프로필 섹션
- **예상 시간**: 10분

**수정 내용**: 여러 커스텀 animate-pulse div를 Skeleton 컴포넌트로 교체

---

#### 6. Dashboard loading.tsx ⭐ MEDIUM IMPACT
- **파일**: `src/app/(dashboard)/loading.tsx`
- **라인**: 24-42
- **영향도**: 중간 - 대시보드 로딩
- **예상 시간**: 10분
- **특이사항**: `!bg-gray-200` (important flag) 사용 중

---

#### 7. Admin Page ⭐ MEDIUM IMPACT
- **파일**: `src/app/admin/page.tsx`
- **라인**: 19
- **영향도**: 중간 - 관리자 페이지
- **예상 시간**: 5분

**Before**:
```tsx
{isLoading && <p>로딩 중...</p>}
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

{isLoading && (
  <div className="space-y-3">
    <Skeleton className="h-12 w-full" /> {/* Table header */}
    {Array.from({ length: 5 }, (_, i) => (
      <Skeleton key={i} className="h-16 w-full" /> {/* Table rows */}
    ))}
  </div>
)}
```

---

### 🟢 Low Priority (Week 3)

#### 8. CommentsSkeleton
- **파일**: `src/features/comments/components/skeletons/CommentsSkeleton.tsx`
- **라인**: 13-25
- **예상 시간**: 5분

#### 9. SidebarSkeleton
- **파일**: `src/components/shared/layout/skeletons/SidebarSkeleton.tsx`
- **라인**: 10-33
- **예상 시간**: 5분

#### 10. PopularPostListSkeleton
- **파일**: `src/features/posts/components/skeletons/PopularPostListSkeleton.tsx`
- **라인**: 12-21
- **예상 시간**: 5분

#### 11. TagsSkeleton
- **파일**: `src/features/tags/components/skeletons/TagsSkeleton.tsx`
- **라인**: 12-22
- **예상 시간**: 5분

---

## 📅 4주 마이그레이션 로드맵

### Week 1: High-Impact Files (우선순위 1)
**목표**: 주요 사용자 대면 로딩 상태 개선

- [ ] PostListSkeleton 마이그레이션
- [ ] SearchPageContent 마이그레이션
- [ ] loading.tsx (root) 마이그레이션
- [ ] 테스트 및 검증

**예상 소요 시간**: 35분 작업 + 25분 테스트 = **1시간**

---

### Week 2: Medium-Impact Files (우선순위 2)
**목표**: 보조 로딩 상태 개선

- [ ] SkeletonContent (챗봇) 마이그레이션
- [ ] IntroList 마이그레이션
- [ ] Dashboard loading.tsx 마이그레이션
- [ ] Admin 페이지 마이그레이션
- [ ] 테스트 및 검증

**예상 소요 시간**: 30분 작업 + 20분 테스트 = **50분**

---

### Week 3: Low-Impact Files (우선순위 3)
**목표**: 모든 로딩 상태 일관성 확보

- [ ] CommentsSkeleton 마이그레이션
- [ ] SidebarSkeleton 마이그레이션
- [ ] PopularPostListSkeleton 마이그레이션
- [ ] TagsSkeleton 마이그레이션
- [ ] 테스트 및 검증

**예상 소요 시간**: 20분 작업 + 10분 테스트 = **30분**

---

### Week 4: 정리 및 문서화
**목표**: 재사용 가능한 패턴 구축 및 표준화

- [ ] 재사용 가능한 Skeleton 패턴 라이브러리 생성
- [ ] 사용하지 않는 커스텀 skeleton 코드 제거
- [ ] CLAUDE.md에 Skeleton 사용 가이드라인 추가
- [ ] 컴포넌트 문서화 업데이트
- [ ] 전체 회귀 테스트

**예상 소요 시간**: **2-3시간**

---

## 🔧 재사용 가능한 Skeleton 패턴

### Pattern 1: CardSkeleton

```tsx
// src/components/shared/skeletons/CardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
```

**사용 예시**:
```tsx
import { CardSkeleton } from "@/components/shared/skeletons/CardSkeleton";

{isLoading && <CardSkeleton count={5} />}
```

---

### Pattern 2: TableSkeleton

```tsx
// src/components/shared/skeletons/TableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
```

**사용 예시**:
```tsx
import { TableSkeleton } from "@/components/shared/skeletons/TableSkeleton";

{isLoading && <TableSkeleton rows={10} columns={5} />}
```

---

### Pattern 3: ListSkeleton

```tsx
// src/components/shared/skeletons/ListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export function ListSkeleton({ items = 5, showAvatar = true }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ 테스트 체크리스트

각 마이그레이션 완료 후:

- [ ] **시각적 외관**: 원래 레이아웃과 일치하는지 확인
- [ ] **반응형 디자인**: 모바일/태블릿/데스크탑에서 정상 작동
- [ ] **접근성**: `role="status"`, `aria-label` 속성 유지
- [ ] **애니메이션 성능**: 부드러운 애니메이션 확인
- [ ] **다크모드**: 다크모드에서 정상 표시 (해당 시)
- [ ] **레이아웃 시프트**: 로딩 완료 시 레이아웃 깨짐 없음
- [ ] **상태 전환**: Skeleton이 데이터 로드 시 올바르게 제거됨

---

## 💡 개선 효과

### 정량적 효과
- **코드 라인 수 감소**: 예상 100-150줄 감소
- **일관성**: 모든 로딩 상태에 동일한 디자인 시스템 적용
- **유지보수성**: 단일 컴포넌트 수정으로 전역 스타일 업데이트 가능

### 정성적 효과
- ✅ **디자인 시스템 통일**: `bg-accent` 테마 토큰 사용으로 일관성 확보
- ✅ **다크모드 자동 지원**: 하드코딩된 `bg-gray-200` 제거
- ✅ **코드 간결화**: `animate-pulse` 반복 제거
- ✅ **테마 커스터마이징**: 중앙화된 Skeleton 컴포넌트로 쉬운 스타일 변경

---

## 📋 마이그레이션 복잡도

| 파일 | 우선순위 | 복잡도 | 예상 시간 | 영향도 |
|------|----------|--------|-----------|--------|
| PostListSkeleton | HIGH | Easy | 5분 | High - 메인 게시글 목록 |
| SearchPageContent | HIGH | Easy | 10분 | High - 검색 결과 |
| loading.tsx (root) | HIGH | Medium | 20분 | High - 앱 전역 |
| SkeletonContent (챗봇) | MEDIUM | Easy | 5분 | Medium - 챗봇 |
| IntroList | MEDIUM | Easy | 10분 | Medium - 프로필 |
| Dashboard loading.tsx | MEDIUM | Easy | 10분 | Medium - 대시보드 |
| Admin 페이지 | MEDIUM | Easy | 5분 | Medium - 관리자 |
| CommentsSkeleton | LOW | Easy | 5분 | Low - 댓글 |
| SidebarSkeleton | LOW | Easy | 5분 | Low - 사이드바 |
| PopularPostListSkeleton | LOW | Easy | 5분 | Low - 인기글 |
| TagsSkeleton | LOW | Easy | 5분 | Low - 태그 |

**총 예상 시간**: ~90분 (실제 작업 + 테스트: 1-2일)

---

## 🎯 성공 기준

1. **100% 마이그레이션**: 모든 커스텀 animate-pulse를 shadcn Skeleton으로 교체
2. **일관성**: 모든 로딩 상태가 동일한 디자인 패턴 사용
3. **접근성 유지**: 기존 접근성 속성 보존
4. **성능 유지**: 애니메이션 성능 저하 없음
5. **문서화 완료**: CLAUDE.md 및 컴포넌트 문서 업데이트

---

## 📚 참고 자료

### shadcn Skeleton 컴포넌트
- **위치**: `src/components/ui/skeleton.tsx`
- **기본 스타일**: `bg-accent animate-pulse rounded-md`
- **사용법**: `<Skeleton className="h-4 w-full" />`

### 현재 잘 구현된 예시
1. **PostDetailSkeleton** - `src/features/posts/components/skeletons/PostDetailSkeleton.tsx`
   - 우수한 접근성 구현 (`role="status"`, `aria-label`)
   - 완전한 shadcn Skeleton 활용

2. **TabContentSkeleton** - `src/components/shared/skeletons/TabContentSkeleton.tsx`
   - 다양한 Skeleton 변형 사용

3. **MainPageSkeleton** - `src/components/shared/skeletons/MainPageSkeleton.tsx`
   - 페이지 전체 skeleton 구조

---

## 🔄 업데이트 이력

- **2025-10-02**: 초기 분석 및 마이그레이션 계획 수립
- 총 47개 파일 분석 완료
- 11개 파일 마이그레이션 대상 식별
- 4주 단계별 마이그레이션 계획 수립

---

## 📌 다음 단계

1. Week 1 작업 시작: PostListSkeleton, SearchPageContent, loading.tsx (root)
2. GitHub Issue 생성하여 팀원과 공유
3. 브랜치 생성: `refactor/migrate-to-shadcn-skeleton`
4. 단계별 PR 생성 (주차별 또는 우선순위별)

---

## 🏷️ 관련 태그
`refactor`, `shadcn`, `ui-components`, `design-system`, `loading-states`, `skeleton`, `code-quality`
