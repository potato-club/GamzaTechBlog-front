"use client";


import dynamic from "next/dynamic";
import Image from "next/image";
import tagDeleteBtn from "../../../public/tagDeleteBtn.svg";


export default function WritePage() {
  const tags = [
    "# java",
    "# javascript",
    "# react",
    "# nextjs",
  ];

  const ToastEditor = dynamic(() => import("@/components/ToastEditor"), {
    ssr: false,
  });

  return (
    <div className="mt-32 flex flex-col">
      <input type="text" placeholder="제목을 입력해주세요." className="w-full" />
      <ToastEditor />

      <div className="mt-7 flex flex-wrap gap-2 text-[14px]">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className=""
          >
            <div
              key={idx}
              className="flex items-center gap-1 w-fit rounded-2xl bg-[#F2F4F6] px-2 py-1.5 text-[#848484]"
            >
              <span>{tag}</span>
              <Image
                src={tagDeleteBtn}
                alt="태그 삭제 버튼"
                className="cursor-pointer hover:opacity-70"
              />
            </div>

          </div>
        ))}
        <input type="text" placeholder="#태그입력" />
      </div>
    </div>
  );
}
