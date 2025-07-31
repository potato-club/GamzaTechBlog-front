"use client";

import { uploadImageForEditor } from "@/hooks/queries/useImageQueries";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type ToastEditorHandle = {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  togglePreview: () => void;
};

interface ToastEditorProps {
  initialValue?: string;
}

const ToastEditor = forwardRef<ToastEditorHandle, ToastEditorProps>(({ initialValue }, ref) => {
  const editorRef = useRef<Editor>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  useImperativeHandle(ref, () => ({
    getMarkdown: () => editorRef.current?.getInstance().getMarkdown() || "",
    setMarkdown: (markdown: string) => {
      editorRef.current?.getInstance().setMarkdown(markdown);
    },
    togglePreview: () => {
      const editor = editorRef.current?.getInstance();
      if (!editor) return;

      if (isPreviewVisible) {
        // 미리보기 숨기기: tab 모드로 변경하고 markdown 탭만 활성화
        editor.changePreviewStyle('tab');
        editor.changeMode('markdown');
      } else {
        // 미리보기 보이기: vertical 모드로 변경
        editor.changePreviewStyle('vertical');
      }
      setIsPreviewVisible(!isPreviewVisible);
    },
  }));

  // CSS 스타일을 동적으로 추가/제거하는 함수
  useEffect(() => {
    const styleId = 'toast-editor-custom-style';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    if (!isPreviewVisible) {
      styleElement.textContent = `
        .toastui-editor-mode-switch {
          display: none !important;
        }
      `;
    } else {
      styleElement.textContent = '';
    }
  }, [isPreviewVisible]);

  return (
    <Editor
      ref={editorRef}
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
      initialValue={initialValue || ""}
      hooks={{
        addImageBlobHook: uploadImageForEditor
      }}
    />
  );
});

export default ToastEditor;
