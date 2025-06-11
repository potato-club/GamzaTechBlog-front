'use client';

import CommentList from "@/components/CommentList";
import Image from 'next/image';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { commentService } from "../../../services/commentService";
import { postService } from "../../../services/postService";
import { PostDetailData } from "../../../types/comment";

interface UiComment {
  commentId: number;
  writer: string;
  content: string;
  createdAt: string;
  replies: string[];
}

export default function PostPage() {
  const params = useParams(); // URL 파라미터 가져오기
  const postId = params.id ? Number(params.id) : null;

  const [post, setPost] = useState<PostDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [displayComments, setDisplayComments] = useState<UiComment[]>([]);


  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const postData = await postService.getPostById(postId);
          setPost(postData);
          // API에서 가져온 댓글을 UI용 댓글 형식으로 변환
          const fetchedCommentsForUi: UiComment[] = postData.comments.map(comment => ({
            commentId: comment.commentId,
            writer: comment.writer,
            content: comment.content,
            createdAt: new Date(comment.createdAt).toLocaleDateString(), // 날짜 형식 변환
            replies: comment.replies,
          }));
          setDisplayComments(fetchedCommentsForUi);
        } catch (err) {
          console.error("Failed to fetch post:", err);
          setError(err instanceof Error ? err.message : "게시물을 불러오는데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    } else {
      setError("유효한 게시물 ID가 없습니다.");
      setIsLoading(false);
    }
  }, [postId]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    const form = event.currentTarget;
    const commentInput = form.querySelector<HTMLInputElement>("#comment-input");
    if (!commentInput || !commentInput.value.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const newComment = {
      content: commentInput.value.trim(),
      parentCommentId: null, // 부모 댓글 ID가 없으므로 null로 설정
    };

    // 여기에 댓글 작성 API 호출 로직을 추가할 수 있습니다.
    if (postId === null) {
      alert("유효한 게시물 ID가 없습니다.");
      return;
    }

    console.log("new comment", newComment);

    commentService.registerComment(postId, newComment)
      .then((comment) => {
        // 댓글 작성 성공 시 UI에 추가
        const newUiComment = {
          commentId: comment.commentId,
          writer: comment.writer,
          content: comment.content,
          createdAt: comment.createdAt.split("T")[0],
          replies: comment.replies,
        };
        setDisplayComments((prevComments) => [...prevComments, newUiComment]);
        commentInput.value = ""; // 입력 필드 초기화
      })
      .catch((err) => {
        console.error("댓글 작성 실패:", err);
        alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
      });


  };

  // 이곳에 댓글 작성 로직을 추가할 수 있습니다.
  return (
    <main className="mx-16 my-16">
      <article className="border-b border-[#D5D9E3] py-8">
        <header>
          <h1 className="text-[32px] font-extrabold text-[#1C222E]">
            {post?.title}
          </h1>

          <div className="flex h-12 items-center gap-4 text-[14px]">
            <div className="flex h-5 items-center border-r border-[#B5BBC7] pr-1.5">
              <Image
                src="/profileSVG.svg"
                alt="GyeongHwan Lee의 프로필 이미지"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="ml-2 font-medium text-[#798191]">
                {post?.writer}
              </span>
            </div>
            <time dateTime="2025-04-28" className="text-[#B5BBC7]">
              {post?.createdAt.split("T")[0]}
            </time>
          </div>

          <ul className="flex gap-2 text-[14px]" role="list">
            <li className="rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]">
              {post?.tags.map((tag, index) => (
                <span key={index} className="mr-1">
                  # {tag}
                  {index < post.tags.length - 1 && ", "}
                </span>
              ))}
            </li>
          </ul>
        </header>

        <div className="my-6 text-[17px] text-[#474F5D] leading-relaxed">
          {post?.content}
        </div>
      </article>

      <section className="mt-40 text-[#353841] text-[17px]" aria-label="댓글 섹션">
        <h2 className="mt-7 text-lg font-semibold">댓글 {post?.comments.length}개</h2>

        {/* 댓글 작성 */}
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} aria-label="댓글 작성">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src="/profileSVG.svg"
              alt="현재 사용자의 프로필 이미지"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          <label htmlFor="comment-input" className="sr-only">
            댓글 내용
          </label>
          <input
            id="comment-input"
            type="text"
            placeholder="댓글을 남겨주세요."
            className="border border-[#E7EEFE] rounded-xl w-full px-5 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FAA631]/50 transition"
            aria-required="true"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-[63px] bg-[#20242B] px-3 py-1.5 text-white hover:bg-[#1C222E] hover:cursor-pointer text-[12px]"
            >
              등록
            </Button>
          </div>
        </form>

        <CommentList comments={displayComments} />
      </section>
    </main>
  );
}