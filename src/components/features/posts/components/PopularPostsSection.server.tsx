import { postService } from "@/services/postService";
import PopularPost from "./PopularPost";

/**
 * 인기 게시글 섹션 서버 컴포넌트
 *
 * 단일 책임: 인기 게시글 데이터 페칭 및 표시만
 */
export default async function PopularPostsSection() {
  // 인기 게시글만 페칭 (독립적 캐싱 전략 적용 가능)
  const popularPosts = await postService.getPopularPosts();

  return (
    <section>
      <h3 className="mb-7 text-[18px] text-[#838C9D]">주간 인기 게시물</h3>

      {popularPosts && popularPosts.length > 0 ? (
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <PopularPost
              key={post.postId}
              postId={post.postId!}
              title={post.title!}
              author={post.writer!}
              profileImage={post.writerProfileImageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">인기 게시글이 없습니다</p>
        </div>
      )}
    </section>
  );
}
