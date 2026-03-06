// Comments Domain Feature Exports
export * from "./actions/commentActions";
export * from "./components";
export * from "./hooks";
// Services export removed to avoid client-side apiClient usage.
// export * from "./types";

// ⚠️ Server Services는 barrel export에서 제외합니다.
// 직접 import하세요: import { createCommentServiceServer } from "@/features/comments/services/commentService.server";
