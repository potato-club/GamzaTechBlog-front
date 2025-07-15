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
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
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

export interface PostFormData {
  title: string;
  content: string;
  tags: string[];
  commitMessage: string;
}

interface PostFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (data: PostFormData) => Promise<void>;
  isLoading: boolean;
}

export default function PostForm({
  mode,
  initialData,
  onSubmit,
  isLoading
}: PostFormProps) {
  const editorRef = useRef<ToastEditorHandle>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
    },
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [uploadingDots, setUploadingDots] = useState("");

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        title: initialData.title,
      });
      setTags(initialData.tags || []);
    }
  }, [initialData, mode, form]);

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    const markdown = editorRef.current?.getMarkdown() || "";

    if (!markdown.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await onSubmit({
        title: data.title,
        content: markdown,
        tags: tags,
        commitMessage: mode === 'create'
          ? `새 게시글: ${data.title}`
          : `게시글 수정: ${data.title}`,
      });
    } catch (error) {
      console.error(`게시글 ${mode === 'create' ? '작성' : '수정'} 중 오류:`, error);
      alert(`게시글 ${mode === 'create' ? '작성' : '수정'}에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  const handleAddTag = () => {
    const tagWithoutHash = currentTag.startsWith("#") ? currentTag.slice(1) : currentTag;
    const trimmedTag = tagWithoutHash.trim();

    if (trimmedTag !== "" && tags.length < 2) {
      const capitalizedTag =
        trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1).toLowerCase();
      const newTag = `${capitalizedTag}`;

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
    }
    if (tags.length < 2) {
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
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setUploadingDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
      }, 500);
    } else {
      setUploadingDots("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const buttonText = isLoading
    ? `게시글 ${mode === 'create' ? '업로드' : '수정'} 중${uploadingDots}`
    : mode === 'create' ? "완료" : "수정 완료";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-32 flex flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
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

        <ToastEditor
          ref={editorRef}
          initialValue={mode === 'edit' ? initialData?.content : undefined}
        />

        <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
            >
              <span># {tag}</span>
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
            disabled={tags.length >= 2}
            className="h-auto p-1.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent w-auto flex-grow"
          />
        </div>

        <Button
          type="submit"
          className={`self-end px-4 py-2 bg-[#20242B] text-white rounded-4xl transition-colors duration-150 ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-[#33373E]/90 hover:cursor-pointer"
            }`}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}
