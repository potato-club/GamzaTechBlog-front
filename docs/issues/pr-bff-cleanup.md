## 📝 PR 요약 (Summary)

BFF 마이그레이션 cleanup 단계로 좋아요 도메인을 분리하고 체크리스트 결론을 반영했습니다.

## 🔗 관련 이슈 (Related Issues)

- closes #

## 🛠 작업 내용 (Changes)

- 좋아요 기능을 `src/features/likes`로 분리하고 사용처 import를 정리
- posts 배럴/훅 export에서 좋아요 항목 제거 및 feature re-export 업데이트
- 마무리 체크리스트 완료/결정 사항 반영

## 🎯 변경 유형 (Change Type)

- [ ] ✨ 새로운 기능 (Feature)
- [ ] 🐛 버그 수정 (Bug Fix)
- [x] 🛠 리팩토링 (Refactoring)
- [ ] 🎨 UI/스타일 변경 (UI/Style)
- [x] 📝 문서 수정 (Documentation)
- [ ] ⚙️ 설정 변경 (Configuration)
- [ ] 🧪 테스트 추가/수정 (Test)
- [ ] 🔧 빌드/의존성 (Build/Dependencies)

## 📸 스크린샷 (Screenshots)

| Before | After |
| ------ | ----- |
| N/A    | N/A   |

## ✅ 체크리스트 (Checklist)

- [ ] 코드가 정상적으로 빌드됩니다 (`npm run build` or `yarn build`)
- [ ] 린트 에러가 없습니다 (`npm run lint` or `yarn lint`)
- [x] 관련된 테스트가 통과합니다 (`npm run test` or `yarn test`)
- [ ] 새로운 코드에 대한 테스트를 추가했습니다 (필요한 경우)
- [ ] 로컬에서 기능을 직접 테스트했습니다
- [ ] 반응형(모바일/데스크톱)을 확인했습니다 (UI 변경 시)

## 💬 참고 사항 (Notes)

- 실행 테스트: `set JEST_SKIP_MSW=true && yarn test --testPathPattern "src/features/.*/actions/__tests__/.*\\.test\\.(ts|tsx)$"`

## 🔍 리뷰 요청 사항 (Review Focus)

- likes 도메인 분리 이후 import/배럴 export 누락 여부
- 마무리 체크리스트 결정 사항 반영 내용 확인
