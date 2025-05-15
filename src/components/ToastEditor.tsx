"use client";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type ToastEditorHandle = {
  getMarkdown: () => string;
};

const ToastEditor = forwardRef<ToastEditorHandle>((_, ref) => {
  const editorRef = useRef<Editor>(null);

  useImperativeHandle(ref, () => ({
    getMarkdown: () => editorRef.current?.getInstance().getMarkdown() || "",
  }));

  return (
    <Editor
      ref={editorRef}
      previewStyle="vertical"
      height="500px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  );
});

export default ToastEditor;
