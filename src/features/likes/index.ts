// Likes Domain Feature Exports
export * from "./actions/likeActions";
export * from "./hooks";

// ⚠️ Server Services는 barrel export에서 제외합니다.
// 직접 import하세요: import { createLikeServiceServer } from "@/features/likes/services/likeService.server";
