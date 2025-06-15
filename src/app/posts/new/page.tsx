"use client";

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
import { zodResolver } from "@hookform/resolvers/zod"; // zodResolver 추가
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation"; // useRouter 추가
import React, { useRef, useState } from "react"; // useState 추가
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod"; // z 추가
import { postService } from "../../../services/postService";

const ToastEditor = dynamic(() => import("@/components/ToastEditor"), {
  ssr: false,
});

// Zod 스키마 정의
const formSchema = z.object({
  title: z.string().min(1, { message: "제목은 필수입니다." }).max(100, { message: "제목은 100자 이내로 입력해주세요." }),
  // content는 에디터에서 직접 가져오므로, 폼 스키마에서는 선택적으로 다루거나 제외할 수 있습니다.
  // 여기서는 폼 데이터에 포함시키지 않는다고 가정합니다.
});

// Zod 스키마로부터 타입 추론
type FormValues = z.infer<typeof formSchema>;

export default function WritePage() {
  const editorRef = useRef<ToastEditorHandle>(null);
  const router = useRouter(); // useRouter 훅 사용

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // zodResolver 사용
    defaultValues: {
      title: "",
    },
  });

  const [tags, setTags] = useState<string[]>([]); // 태그를 상태로 관리
  const [currentTag, setCurrentTag] = useState<string>("");

  const onSubmit: SubmitHandler<FormValues> = async (data) => { // async 추가
    const markdown = editorRef.current?.getMarkdown() || "";
    const commitMessage = ``;

    try {
      const response = await postService.createPost({
        title: data.title,
        content: markdown,
        tags: tags,
        commitMessage: commitMessage,
      });

      console.log("게시글 생성 성공:", response);
      // 성공 시 생성된 게시글 상세 페이지로 이동
      router.push(`/posts/${response.postId}`);
    } catch (error) {
      console.error("게시글 생성 실패:", error);
      alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
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
        </div>

        <Button
          type="submit"
          className="self-end px-4 py-2 bg-[#20242B] text-white rounded-4xl hover:bg-[#33373E]/90 hover:cursor-pointer" // shadcn Button 사용 및 hover 스타일 추가
        // variant="default" // shadcn/ui Button의 기본 variant를 사용하려면 명시
        >
          완료
        </Button>
      </form>
    </Form>
  );
}