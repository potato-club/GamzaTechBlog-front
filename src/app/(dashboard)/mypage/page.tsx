/**
 * 마이페이지 메인 컴포넌트 (서버 컴포넌트)
 *
 * 서버 컴포넌트로 빠른 초기 렌더링을 제공합니다.
 * 대시보드 loading.tsx에서 페이지 레벨 로딩 UI를 담당하므로
 * 추가적인 Suspense fallback은 불필요합니다.
 *
 * ProfileLayout을 사용하여 공개 프로필 페이지와 일관된 구조를 유지합니다.
 */

import { ProfileLayout } from "@/components/shared";
import { createServerApiClient } from "@/lib/apiClient";

export default async function MyPage() {
  console.log("Rendering MyPage Server Component");

  // 인증 상태 확인 - 서버 API 클라이언트 사용
  try {
    const api = createServerApiClient();
    await api.getCurrentUserProfile();
  } catch (error) {
    console.error("Authentication failed:", error);
  }

  return <ProfileLayout mode="mypage" />;
}
