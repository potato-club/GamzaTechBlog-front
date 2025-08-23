import { ResponseDtoUserProfileResponse } from "@/generated/api";
import * as jose from "jose";
import type { NextAuthConfig, User } from "next-auth";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 백엔드 API에서 사용하는 사용자 프로필 타입
 */
type BackendUserProfile = {
  id: number;
  githubId?: string;
  nickname: string;
  name?: string;
  email: string;
  profileImageUrl?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

// next-auth의 기본 타입을 확장하여 우리 서비스에 맞게 커스텀합니다.
declare module "next-auth" {
  interface User {
    id: number;
    name?: string;
    email: string;
    image?: string;
    githubId?: string;
    nickname: string;
    profileImageUrl?: string;
    role: string;
    position?: string;
    studentNumber?: string;
    gamjaBatch?: number;
    createdAt?: string;
    updatedAt?: string;
    authorization: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
    authorization?: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends BackendUserProfile {
    authorization: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
    position?: string;
    studentNumber?: string;
    gamjaBatch?: number;
  }
}

/**
 * JWT 비밀 키를 환경 변수에서 가져와 올바른 형식(Uint8Array)으로 변환합니다.
 */
function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  if (secret.endsWith("=") || /^[A-Za-z0-9+/]*={0,2}$/.test(secret)) {
    return Buffer.from(secret, "base64");
  } else {
    return new TextEncoder().encode(secret);
  }
}

/**
 * 만료된 액세스 토큰을 재발급하는 함수입니다.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log("refreshAccessToken called - using internal session-check API");
  try {
    // 내부 session-check API를 사용하여 토큰 갱신
    // 이 API는 이미 쿠키 파싱과 프로필 조회를 처리함
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/session-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // refreshToken 쿠키를 전달
          Cookie: `refreshToken=${token.refreshToken}`,
        },
        credentials: "include",
      }
    );

    const result = await response.json();

    // session-check API가 실패한 경우 처리
    if (!response.ok || !result.success) {
      // refreshToken 만료는 정상적인 상황 (로그아웃 상태)
      if (result.code === "REFRESH_TOKEN_EXPIRED") {
        console.log("RefreshToken expired in session-check, marking for logout");
        const errorToken = {
          ...token,
          error: "RefreshAccessTokenError" as const,
        };
        console.log("Returning error token:", errorToken);
        return errorToken;
      }

      // 다른 에러들
      throw new Error(`Session check failed: ${result.message || "Unknown error"}`);
    }

    if (!result.authorization) {
      throw new Error("New access token not found in session check response");
    }

    const newAccessToken = result.authorization;
    const secretKey = getJwtSecretKey();
    const { payload } = await jose.jwtVerify(newAccessToken, secretKey);
    const newExpiry = (payload.exp as number) * 1000;

    console.log("Token refresh successful via session-check API");

    // refreshToken은 session-check API에서 쿠키로 자동 업데이트되므로
    // JWT에서는 기존 값을 유지 (실제 값은 쿠키에서 관리됨)

    return {
      ...token,
      authorization: newAccessToken,
      // refreshToken은 쿠키에서 관리되므로 기존 값 유지
      refreshToken: token.refreshToken,
      accessTokenExpires: newExpiry,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        authorization: { label: "Authorization Token", type: "text" },
        userProfile: { label: "User Profile", type: "text" }, // 선택적 프로필 정보
      },
      async authorize(credentials, req): Promise<User | null> {
        console.log("NextAuth authorize function called");

        // 라우트 핸들러에서 이미 유효한 토큰을 받았다고 가정
        if (typeof credentials.authorization !== "string" || !credentials.authorization) {
          console.error("Invalid or missing authorization credential");
          return null;
        }

        const { authorization } = credentials;

        // refreshToken은 HttpOnly 쿠키에서 읽어옵니다
        const cookieHeader = req.headers.get("cookie");
        let refreshToken: string | undefined;

        if (cookieHeader) {
          const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
          for (const cookie of cookies) {
            if (cookie.startsWith("refreshToken=")) {
              refreshToken = cookie.substring("refreshToken=".length);
              break;
            }
          }
        }

        if (!refreshToken) {
          console.error("Refresh token not found in cookies");
          return null;
        }

        try {
          let profile: any;

          // 이미 조회된 프로필 정보가 있는지 확인 (라우트 핸들러에서 전달된 경우)
          if (credentials.userProfile) {
            console.log("Using pre-fetched user profile from route handler");
            profile = JSON.parse(credentials.userProfile as string);
          } else {
            // 프로필 정보가 없으면 직접 조회 (일반 로그인의 경우)
            console.log("Fetching user profile with provided token");
            const profileResponse = await fetch(`${BASE_URL}/api/v1/users/me/get/profile`, {
              headers: {
                Authorization: `Bearer ${authorization}`,
              },
            });

            if (!profileResponse.ok) {
              console.error(`Failed to fetch user profile. Status: ${profileResponse.status}`);
              return null;
            }

            const userProfile: ResponseDtoUserProfileResponse = await profileResponse.json();

            if (!userProfile?.data) {
              console.error("User profile data is missing in the API response");
              return null;
            }

            profile = userProfile.data;
          }

          // 필수 필드 검증
          if (!profile.githubId || !profile.nickname || !profile.email || !profile.role) {
            console.error("Required user profile fields are missing");
            return null;
          }

          console.log("User profile processed successfully");
          return {
            id: profile.githubId,
            name: profile.name,
            email: profile.email,
            image: profile.profileImageUrl,
            githubId: profile.githubId,
            nickname: profile.nickname,
            profileImageUrl: profile.profileImageUrl,
            role: profile.role,
            position: profile.position,
            studentNumber: profile.studentNumber,
            gamjaBatch: profile.gamjaBatch,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
            authorization,
            refreshToken,
          };
        } catch (error) {
          console.error("An error occurred during the authorize process:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const secretKey = getJwtSecretKey();
        const { payload } = await jose.jwtVerify(user.authorization, secretKey);
        const accessTokenExpires = (payload.exp as number) * 1000;

        return {
          ...token,
          ...user,
          accessTokenExpires,
        } as JWT;
      }

      // 토큰 만료 체크 (5분 버퍼)
      const REFRESH_BUFFER = 5 * 60 * 1000;
      if (Date.now() < token.accessTokenExpires - REFRESH_BUFFER) {
        return token;
      }

      // 토큰 재발급
      return await refreshAccessToken(token as JWT);
    },
    async session({ session, token }) {
      if (token) {
        const user = session.user as User;
        user.id = token.id;
        user.name = token.name ?? "";
        user.nickname = token.nickname ?? "";
        user.email = token.email ?? "";
        user.githubId = token.githubId;
        user.profileImageUrl = token.profileImageUrl;
        user.position = token.position;
        user.studentNumber = token.studentNumber;
        user.gamjaBatch = token.gamjaBatch;
        user.createdAt = token.createdAt;
        user.updatedAt = token.updatedAt;
        session.user.image = token.profileImageUrl;
        session.user.role = token.role ?? "";
        session.authorization = token.authorization ?? "";
        session.error = token.error;

        if (token.error) {
          console.log("Session callback: Error detected in token:", token.error);
        }
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
