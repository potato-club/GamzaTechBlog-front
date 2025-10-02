# GitHub Issue: shadcn Skeleton 마이그레이션

## 제목
```
refactor: shadcn Skeleton 컴포넌트로 마이그레이션
```

---

## 내용

### 📋 개요
프로젝트 전반에 걸쳐 커스텀 `animate-pulse` 스타일로 구현된 로딩 상태를 shadcn/ui의 Skeleton 컴포넌트로 마이그레이션하여 디자인 시스템 일관성을 확보하고자 합니다.

### 🎯 목표
- 모든 로딩 상태를 shadcn Skeleton 컴포넌트로 통일
- 하드코딩된 `bg-gray-200` 제거 및 테마 토큰(`bg-accent`) 사용
- 다크모드 자동 지원 및 유지보수성 향상
- 재사용 가능한 Skeleton 패턴 라이브러리 구축

### 📊 현황 분석

**총 47개 파일 분석 완료:**
- ✅ shadcn Skeleton 사용 중: **15개 (31.9%)**
- ⚠️ 커스텀 animate-pulse 사용: **10개 (21.3%)** - 마이그레이션 필요
- ⚠️ 텍스트만 표시: **3개 (6.4%)** - 개선 필요
- ✅ 최적화 완료: **19개 (40.4%)**

**총 마이그레이션 예상 시간**: ~90분 (테스트 포함 1-2일)

---

## 🎯 마이그레이션 대상 파일

### 🔴 Week 1: High Priority (3개)

#### 1. PostListSkeleton ⭐
- **파일**: `src/features/posts/components/skeletons/PostListSkeleton.tsx`
- **영향도**: 높음 - 메인 게시글 목록
- **예상 시간**: 5분

**Before**:
```tsx
<div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
```

**After**:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="mb-6 h-8 w-32" />
```

#### 2. SearchPageContent ⭐
- **파일**: `src/features/search/components/SearchPageContent.tsx`
- **영향도**: 높음 - 검색 결과 페이지
- **예상 시간**: 10분

#### 3. loading.tsx (root) ⭐
- **파일**: `src/app/loading.tsx`
- **영향도**: 높음 - 앱 전역 로딩
- **복잡도**: Medium
- **예상 시간**: 20분

---

### 🟡 Week 2: Medium Priority (4개)

#### 4. SkeletonContent (Chatbot)
- **파일**: `src/features/chatbot/components/messages/SkeletonContent.tsx`
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

#### 5. IntroList
- **파일**: `src/features/intro/components/IntroList.tsx`
- **예상 시간**: 10분

#### 6. Dashboard loading.tsx
- **파일**: `src/app/(dashboard)/loading.tsx`
- **예상 시간**: 10분

#### 7. Admin Page
- **파일**: `src/app/admin/page.tsx`
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

### 🟢 Week 3: Low Priority (4개)

- **CommentsSkeleton**: `src/features/comments/components/skeletons/CommentsSkeleton.tsx`
- **SidebarSkeleton**: `src/components/shared/layout/skeletons/SidebarSkeleton.tsx`
- **PopularPostListSkeleton**: `src/features/posts/components/skeletons/PopularPostListSkeleton.tsx`
- **TagsSkeleton**: `src/features/tags/components/skeletons/TagsSkeleton.tsx`

**예상 시간**: 각 5분

---

## 📅 4주 마이그레이션 로드맵

### Week 1: High-Impact Files
- [ ] PostListSkeleton 마이그레이션
- [ ] SearchPageContent 마이그레이션
- [ ] loading.tsx (root) 마이그레이션
- [ ] 테스트 및 검증

**예상 소요**: 35분 작업 + 25분 테스트 = **1시간**

---

### Week 2: Medium-Impact Files
- [ ] SkeletonContent (챗봇) 마이그레이션
- [ ] IntroList 마이그레이션
- [ ] Dashboard loading.tsx 마이그레이션
- [ ] Admin 페이지 마이그레이션
- [ ] 테스트 및 검증

**예상 소요**: 30분 작업 + 20분 테스트 = **50분**

---

### Week 3: Low-Impact Files
- [ ] CommentsSkeleton 마이그레이션
- [ ] SidebarSkeleton 마이그레이션
- [ ] PopularPostListSkeleton 마이그레이션
- [ ] TagsSkeleton 마이그레이션
- [ ] 테스트 및 검증

**예상 소요**: 20분 작업 + 10분 테스트 = **30분**

---

### Week 4: 정리 및 문서화
- [ ] 재사용 가능한 Skeleton 패턴 라이브러리 생성
  - CardSkeleton
  - TableSkeleton
  - ListSkeleton
- [ ] 사용하지 않는 커스텀 skeleton 코드 제거
- [ ] CLAUDE.md에 Skeleton 사용 가이드라인 추가
- [ ] 컴포넌트 문서화 업데이트
- [ ] 전체 회귀 테스트

**예상 소요**: **2-3시간**

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

- [ ] 시각적 외관이 원래 레이아웃과 일치하는지 확인
- [ ] 모바일/태블릿/데스크탑 반응형 디자인 정상 작동
- [ ] 접근성 속성 유지 (`role="status"`, `aria-label`)
- [ ] 애니메이션 성능 부드러움 확인
- [ ] 다크모드에서 정상 표시 (해당 시)
- [ ] 로딩 완료 시 레이아웃 시프트 없음
- [ ] Skeleton이 데이터 로드 시 올바르게 제거됨

---

## 💡 기대 효과

### 정량적 효과
- 코드 라인 수: **100-150줄 감소**
- 디자인 시스템 일관성: **100% 통일**
- 유지보수성: 단일 컴포넌트 수정으로 전역 업데이트

### 정성적 효과
- ✅ 디자인 시스템 통일 (`bg-accent` 테마 토큰 사용)
- ✅ 다크모드 자동 지원 (하드코딩된 `bg-gray-200` 제거)
- ✅ 코드 간결화 (`animate-pulse` 반복 제거)
- ✅ 테마 커스터마이징 용이

---

## 📝 참고 자료
- 상세 분석 리포트: `claudedocs/shadcn-skeleton-migration-plan.md`
- shadcn Skeleton 컴포넌트: `src/components/ui/skeleton.tsx`
- 우수 구현 예시: `src/features/posts/components/skeletons/PostDetailSkeleton.tsx`

---

## 🏷️ Labels
`refactor`, `shadcn`, `ui-components`, `design-system`, `code-quality`, `enhancement`

## 👥 Assignees
프로젝트 팀원

## 📌 Milestone
v2.0 - UI/UX Improvements
