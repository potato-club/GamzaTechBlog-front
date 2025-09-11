"use client";

import { DynamicToastEditor } from "@/components/dynamic/DynamicComponents";
import { Button } from "@/components/ui";
import { Form } from "@/components/ui/form";
import { UI_CONSTANTS } from "@/constants/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import PostTagManager from "./PostTagManager";
import PostTitleInput from "./PostTitleInput";
import type { ToastEditorHandle } from "./ToastEditor";

// Zod 스키마 정의
const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: UI_CONSTANTS.FORMS.VALIDATION_MESSAGES.REQUIRED_TITLE })
    .max(UI_CONSTANTS.BLOG.MAX_TITLE_LENGTH, {
      message: UI_CONSTANTS.FORMS.VALIDATION_MESSAGES.TITLE_TOO_LONG,
    }),
});

type FormValues = z.infer<typeof formSchema>;

export interface PostFormData {
  title: string;
  content: string;
  tags: string[];
  commitMessage: string;
}

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmitAction: (data: PostFormData) => Promise<void>;
  isLoading: boolean;
}

export default function PostForm({ mode, initialData, onSubmitAction, isLoading }: PostFormProps) {
  const editorRef = useRef<ToastEditorHandle>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
    },
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        title: initialData.title,
      });
      setTags(initialData.tags || []);
    }
  }, [initialData, mode, form]);

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    const markdown = editorRef.current?.getMarkdown() || "";

    if (!markdown.trim()) {
      alert(UI_CONSTANTS.FORMS.VALIDATION_MESSAGES.REQUIRED_CONTENT);
      return;
    }

    try {
      await onSubmitAction({
        title: data.title,
        content: markdown,
        tags: tags,
        commitMessage:
          mode === "create" ? `새 게시글: ${data.title}` : `게시글 수정: ${data.title}`,
      });
    } catch (error) {
      console.error(`게시글 ${mode === "create" ? "작성" : "수정"} 중 오류:`, error);
      alert(`게시글 ${mode === "create" ? "작성" : "수정"}에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  const togglePreview = () => {
    editorRef.current?.togglePreview();
    setIsPreviewVisible(!isPreviewVisible);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="my-10 flex flex-col gap-6">
        <PostTitleInput control={form.control} />

        {/* 미리보기 토글 버튼 */}
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {isPreviewVisible ? (
              <>
                <EyeOff size={16} />
                <span>미리보기 숨기기</span>
              </>
            ) : (
              <>
                <Eye size={16} />
                <span>미리보기 보기</span>
              </>
            )}
          </Button>
        </div>

        <DynamicToastEditor
          ref={editorRef}
          initialValue={mode === "edit" ? initialData?.content : undefined}
        />

        <PostTagManager
          tags={tags}
          onTagsChange={setTags}
          currentTag={currentTag}
          onCurrentTagChange={setCurrentTag}
        />

        <PostFormActions
          mode={mode}
          isLoading={isLoading}
          onSubmit={() => {}} // handleSubmit은 form의 onSubmit에서 처리됨
        />
      </form>
    </Form>
  );
}
