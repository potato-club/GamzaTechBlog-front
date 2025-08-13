import { postService } from "@/services/postService";
import InteractiveTagSection from "../client/InteractiveTagSection";

/**
 * 태그 섹션 서버 컴포넌트
 *
 * 단일 책임: 태그 데이터 페칭 및 클라이언트 컴포넌트에 전달만
 */
export default async function TagsSection() {
  // 태그만 페칭 (독립적 캐싱 전략 적용 가능)
  const tags = await postService.getTags();

  return <InteractiveTagSection tags={tags || []} />;
}
