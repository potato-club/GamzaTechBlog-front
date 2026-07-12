import { createLikeServiceServer } from "@/features/likes/services/likeService.server";
import { NextResponse } from "next/server";

/**
 * 게시글 좋아요 상태 조회 BFF 라우트
 *
 * 좋아요 초기 상태는 요청자별(개인화) 데이터라 서버 렌더에 두면 상세 라우트가 정적화되지 못한다.
 * 그래서 상세 페이지 캐시(ISR) 성립을 위해 이 조회를 렌더 이후 클라이언트(PostStats)로 분리하고,
 * 토큰 취급은 이 서버 라우트에 격리한다.
 *
 * 응답: { liked: boolean }
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  const { postId } = await params;
  const id = Number(postId);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ liked: false }, { status: 400 });
  }

  try {
    const likeService = createLikeServiceServer();
    const liked = await likeService.checkLikeStatus(id, { cache: "no-store" });
    return NextResponse.json({ liked });
  } catch (error) {
    // 비로그인/에러는 좋아요하지 않은 것으로 처리
    console.warn(
      `Like status fetch failed for post ${id}:`,
      error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    );
    return NextResponse.json({ liked: false });
  }
}
