"use client";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type ToastEditorHandle = {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
};

interface ToastEditorProps {
  initialValue?: string;
}

const ToastEditor = forwardRef<ToastEditorHandle, ToastEditorProps>(({ initialValue }, ref) => {
  const editorRef = useRef<Editor>(null);

  useImperativeHandle(ref, () => ({
    getMarkdown: () => editorRef.current?.getInstance().getMarkdown() || "",
    setMarkdown: (markdown: string) => {
      editorRef.current?.getInstance().setMarkdown(markdown);
    },
  }));

  return (
    <Editor
      ref={editorRef}
      previewStyle="vertical"
      height="500px"
      initialEditType="markdown"
      useCommandShortcut={true}
      initialValue={initialValue || ""}
    />
  );
});

export default ToastEditor;
