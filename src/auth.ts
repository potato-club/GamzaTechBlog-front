import { ResponseDtoUserProfileResponse, UserProfileResponse } from "@/generated/api";
import * as jose from "jose";
import type { NextAuthConfig, User } from "next-auth";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 백엔드 API에서 사용하는 사용자 프로필 타입
 * next-auth의 JWT 토큰에 포함될 기본 정보입니다.
 */
type BackendUserProfile = {
  id: string; // githubId를 사용
  name?: string;
  email: string;
  image?: string; // profileImageUrl을 사용
  nickname: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

// next-auth의 기본 타입을 확장하여 우리 서비스에 맞게 커스텀합니다.
declare module "next-auth" {
  /**
   * `session.user` 및 `useSession`에서 반환되는 사용자 객체 타입입니다.
   * 앱 전체에서 일관된 사용자 정보를 제공합니다.
   */
  interface User {
    id: string;
    name?: string;
    email: string;
    image?: string;
    nickname: string;
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
  /**
   * JWT 토큰의 타입입니다.
   * BackendUserProfile을 확장하여 세션 관리에 필요한 추가 정보를 포함합니다.
   */
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

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        authorization: { label: "Authorization Token", type: "text" },
        userProfile: { label: "User Profile", type: "text" },
      },
      async authorize(credentials, req): Promise<User | null> {
        console.warn("NextAuth authorize function called");

        if (typeof credentials.authorization !== "string" || !credentials.authorization) {
          console.error("Invalid or missing authorization credential");
          return null;
        }

        const { authorization } = credentials;

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
          let profile: UserProfileResponse;

          if (credentials.userProfile) {
            console.warn("Using pre-fetched user profile from route handler");
            profile = JSON.parse(credentials.userProfile as string);
          } else {
            console.warn("Fetching user profile with provided token");
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

          if (!profile.githubId || !profile.nickname || !profile.email || !profile.role) {
            console.error("Required user profile fields are missing");
            return null;
          }

          console.warn("User profile processed successfully");

          // API 응답을 next-auth의 User 모델에 맞게 매핑합니다.
          return {
            id: profile.githubId,
            name: profile.name,
            email: profile.email,
            image: profile.profileImageUrl,
            nickname: profile.nickname,
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

      // 토큰 만료 확인 - 만료되면 API 클라이언트에서 처리하도록 에러 표시
      if (Date.now() >= token.accessTokenExpires) {
        console.warn("Token expired, will be handled by API client");
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name ?? undefined;
        session.user.email = token.email ?? "";
        session.user.image = token.image ?? undefined;
        session.user.nickname = token.nickname;
        session.user.role = token.role;
        session.user.position = token.position;
        session.user.studentNumber = token.studentNumber;
        session.user.gamjaBatch = token.gamjaBatch;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
        session.authorization = token.authorization;
        session.error = token.error;
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
