import { canEditPost, isAdmin, canCreatePost } from "@/lib/auth";
import type { UserProfileResponse } from "@/generated/api/models";

const user = (over: Partial<UserProfileResponse>): UserProfileResponse => ({
  nickname: "someone",
  role: "USER",
  ...over,
});

describe("canEditPost — 작성자 본인만 수정/삭제 가능", () => {
  it("작성자 본인이면 true", () => {
    expect(canEditPost(user({ nickname: "writer" }), "writer")).toBe(true);
  });

  it("관리자여도 타인 글이면 false (백엔드가 작성자만 허용하므로)", () => {
    expect(canEditPost(user({ nickname: "admin", role: "ADMIN" }), "writer")).toBe(false);
  });

  it("관리자가 자기 글이면 true (닉네임 일치)", () => {
    expect(canEditPost(user({ nickname: "admin", role: "ADMIN" }), "admin")).toBe(true);
  });

  it("타인(비작성자)이면 false", () => {
    expect(canEditPost(user({ nickname: "other" }), "writer")).toBe(false);
  });

  it("비로그인(프로필 없음)이면 false", () => {
    expect(canEditPost(null, "writer")).toBe(false);
    expect(canEditPost(undefined, "writer")).toBe(false);
  });
});

describe("isAdmin — canEditPost 변경과 무관하게 유지", () => {
  it("role이 ADMIN이면 true", () => {
    expect(isAdmin(user({ role: "ADMIN" }))).toBe(true);
  });
  it("일반 사용자면 false", () => {
    expect(isAdmin(user({ role: "USER" }))).toBe(false);
  });
});

describe("canCreatePost", () => {
  it("인증 사용자면 true", () => {
    expect(canCreatePost(user({ role: "USER" }))).toBe(true);
  });
  it("PRE_REGISTER면 false", () => {
    expect(canCreatePost(user({ role: "PRE_REGISTER" }))).toBe(false);
  });
});
