"use client";

/**
 * 게시글 작성 페이지
 * 
 * TanStack Query의 useCreatePost 뮤테이션을 사용하여
 * 게시글 작성을 효율적으로 처리하고 캐시를 자동 관리합니다.
 */

import type { ToastEditorHandle } from "@/components/ToastEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "@/hooks/queries/usePostQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const ToastEditor = dynamic(() => import("@/components/ToastEditor"), {
  ssr: false,
});

// Zod 스키마 정의
const formSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수입니다." }).max(100, { message: "제목은 100자 이내로 입력해주세요." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function WritePage() {
  const editorRef = useRef<ToastEditorHandle>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [uploadingDots, setUploadingDots] = useState("");

  /**
   * TanStack Query 뮤테이션을 사용한 게시글 생성
   * 
   * 이 훅의 장점:
   * - 자동 캐시 무효화: 게시글 목록이 자동으로 갱신됨
   * - 로딩 상태 관리: isPending을 통한 버튼 비활성화
   * - 에러 처리: 실패 시 자동 에러 핸들링
   * - 성공 후 리디렉션: onSuccess 콜백을 통한 페이지 이동
   */
  const createPostMutation = useCreatePost();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const markdown = editorRef.current?.getMarkdown() || "";

    if (!markdown.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // TanStack Query 뮤테이션 실행
    try {
      const result = await createPostMutation.mutateAsync({
        title: data.title,
        content: markdown,
        tags: tags,
        commitMessage: `새 게시글: ${data.title}`,
      });

      // 성공 시 게시글 상세 페이지로 이동
      router.push(`/posts/${result.postId}`);

    } catch (error) {
      // 에러는 TanStack Query의 onError에서 이미 처리됨
      // 추가 사용자 피드백이 필요하면 여기에 추가
      console.error('게시글 작성 중 오류:', error);
      alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleAddTag = () => {
    const tagWithoutHash = currentTag.startsWith("#") ? currentTag.slice(1) : currentTag;
    const trimmedTag = tagWithoutHash.trim();

    if (trimmedTag !== "" && tags.length < 2) { // 태그 개수 제한 추가
      const capitalizedTag =
        trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1).toLowerCase();
      const newTag = `${capitalizedTag}`;

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
    }
    if (tags.length < 2) { // 태그가 2개 미만일 때만 입력 필드 초기화
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      handleAddTag();
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    // TanStack Query의 isPending 상태를 사용하여 로딩 애니메이션 처리
    if (createPostMutation.isPending) {
      interval = setInterval(() => {
        setUploadingDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
      }, 500); // 0.5초마다 점 변경
    } else {
      setUploadingDots(""); // 제출 중이 아니면 점 초기화
    }
    return () => clearInterval(interval);
  }, [createPostMutation.isPending]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-32 flex flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          // rules prop은 zodResolver 사용 시 필요 없음
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="px-4 text-4xl mb-10">글 작성하기</FormLabel> */}
              <FormControl>
                <Input
                  {...field}
                  placeholder="제목을 입력해주세요."
                  className="w-full h-11 focus:outline-none text-3xl border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ToastEditor ref={editorRef} />

        <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
            >
              <span># {tag}</span> {/* #이 이미 포함된 태그를 표시 */}
              <Image
                src="/tagDeleteBtn.svg"
                alt="태그 삭제 버튼"
                className="cursor-pointer hover:opacity-70"
                width={10}
                height={10}
                onClick={() => handleRemoveTag(tag)}
              />
            </div>
          ))}
          <Input
            type="text"
            placeholder="태그 입력 후 Enter (최대 2개)"
            value={currentTag}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            disabled={tags.length >= 2} // 태그가 2개 이상이면 입력 비활성화
            className="h-auto p-1.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent w-auto flex-grow" // w-auto, flex-grow 추가
          />
        </div>        <Button
          type="submit"
          className={`self-end px-4 py-2 bg-[#20242B] text-white rounded-4xl transition-colors duration-150 ${createPostMutation.isPending ? "cursor-not-allowed opacity-70" : "hover:bg-[#33373E]/90 hover:cursor-pointer"
            }`}
          disabled={createPostMutation.isPending} // TanStack Query 로딩 상태 사용
        >
          {createPostMutation.isPending ? `게시글 업로드 중${uploadingDots}` : "완료"}
        </Button>
      </form>
    </Form>
  );
}