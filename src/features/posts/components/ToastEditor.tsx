"use client";

// 서버 환境에서는 아무것도 import하지 않음
const isClient = typeof window !== "undefined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Editor: any;
if (isClient) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Editor = require("@toast-ui/react-editor").Editor;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@toast-ui/editor/dist/toastui-editor.css");
}

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { uploadImageForEditor } from "../hooks/useImageQueries";

export type ToastEditorHandle = {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  togglePreview: () => void;
};

interface ToastEditorProps {
  initialValue?: string;
}

const TuiEditor = forwardRef<ToastEditorHandle, ToastEditorProps>(({ initialValue }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        editor.changePreviewStyle("tab");
        editor.changeMode("markdown");
      } else {
        // 미리보기 보이기: vertical 모드로 변경
        editor.changePreviewStyle("vertical");
      }
      setIsPreviewVisible(!isPreviewVisible);
    },
  }));

  // CSS 스타일을 동적으로 추가/제거하는 함수
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    const styleId = "toast-editor-custom-style";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
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
      styleElement.textContent = "";
    }
  }, [isPreviewVisible]);

  return (
    <>
      {!isMounted ? (
        <div className="h-[600px] animate-pulse rounded bg-gray-200" />
      ) : (
        <Editor
          ref={editorRef}
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          initialValue={initialValue || ""}
          hooks={{
            addImageBlobHook: uploadImageForEditor,
          }}
        />
      )}
    </>
  );
});

TuiEditor.displayName = "TuiEditor";

export default TuiEditor;
