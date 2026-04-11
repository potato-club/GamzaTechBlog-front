# GitHub Issue & PR Workflow

이 프로젝트의 코드 변경은 항상 **이슈 → 브랜치 → 작업 & 커밋 → PR → Merge** 순서를 따른다.  
이슈 없이 브랜치를 만들거나, PR 없이 `main`에 직접 push하는 것은 금지한다.

## 1. Issue 생성

작업 시작 전 반드시 GitHub Issue를 먼저 만든다.

### 제목 형식

```text
[type] 작업 내용을 간결하게 (한국어)
```

예시:

- `[feat] 댓글 시스템 추가`
- `[fix] 로그인 토큰 만료 처리 오류`
- `[chore] next 패키지 보안 취약점 업데이트`

### 본문 템플릿

```md
## 개요

이 작업이 필요한 이유와 해결하려는 문제를 설명한다.

## 작업 내용

- [ ] 구체적인 작업 항목 1
- [ ] 구체적인 작업 항목 2

## 참고 사항

관련 링크, CVE 번호, 관련 이슈 등 (선택)
```

### 예시 명령어

```bash
gh issue create --title "[fix] 로그인 토큰 만료 처리 오류" --body "..."
```

## 2. Branch 생성

브랜치는 항상 최신 `main`에서 분기한다.

형식:

```text
<type>/<issue-number>-<short-description>
```

예시:

```bash
git checkout main
git pull origin main
git checkout -b fix/38-auth-token-expiry
```

## 3. 작업 & 커밋

커밋 메시지 본문에는 이슈 번호를 참조한다.

```bash
git commit -m "fix: 로그인 토큰 만료 처리 개선

- refresh 경계 처리 보완
- 인증 상태 회귀 테스트 추가

ref #38"
```

## 4. PR 생성

PR 제목은 이슈 제목과 동일하게 맞추고, 본문에는 반드시 `Closes #N`을 넣는다.

### PR 본문 템플릿

```md
## 개요

이 PR이 해결하는 문제와 접근 방식을 설명한다.

## 변경 사항

- 변경된 주요 내용 1
- 변경된 주요 내용 2

## 테스트

- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] 주요 기능 동작 확인

Closes #38
```

### 예시 명령어

```bash
gh pr create \
  --title "[fix] 로그인 토큰 만료 처리 오류" \
  --body "..." \
  --base main
```

## 5. 작업 에이전트 규칙

- 작업 전 이슈를 먼저 생성한다.
- 브랜치명에 이슈 번호를 반드시 포함한다.
- 작업 완료 후 PR을 생성한다.
- PR URL을 최종 결과와 함께 사용자에게 공유한다.
