"use client";

import type { ToastEditorHandle } from "@/components/ToastEditor";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { useForm } from "react-hook-form";

const ToastEditor = dynamic(() => import("@/components/ToastEditor"), {
  ssr: false,
});

type FormValues = {
  title: string;
  content: string;
};

export default function WritePage() {
  const editorRef = useRef<ToastEditorHandle>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const tags = ["# java", "# javascript", "# react", "# nextjs"];

  const onSubmit = (data: FormValues) => {
    const markdown = editorRef.current?.getMarkdown() || "";
    console.log("제목:", data.title);
    console.log("내용:", markdown);

    // 예시: fetch("/api/posts", { method: "POST", body: JSON.stringify({ ...data, content: markdown }) })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-32 flex flex-col gap-6">
      <input
        {...register("title", { required: "제목은 필수입니다." })}
        placeholder="제목을 입력해주세요."
        className="w-full h-11 focus:outline-none text-3xl"
      />
      {errors.title && <span className="text-red-500">{errors.title.message}</span>}

      <ToastEditor ref={editorRef} />

      <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
          >
            <span>{tag}</span>
            <Image
              src="/tagDeleteBtn.svg"
              alt="태그 삭제 버튼"
              className="cursor-pointer hover:opacity-70"
              width={10}
              height={10}
            />
          </div>
        ))}
        <input type="text" placeholder="#태그입력" />
      </div>

      <button
        type="submit"
        className="self-end px-5 py-2 bg-[#FAA631] text-white rounded-4xl"
      >
        완료
      </button>
    </form>
  );
}