import { ResponseDtoUserProfileResponse } from "@/generated/api";
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
  /**
   * `authorize` 콜백에서 반환해야 하는 User 객체 타입입니다.
   * next-auth의 기본 User의 id가 string이므로, 우리 서비스의 id 타입(number)과 충돌을 피하기 위해
   * 필요한 모든 속성을 명시적으로 재정의합니다.
   */
  interface User {
    id: number;
    name?: string;
    email: string;
    image?: string;
    githubId?: string;
    nickname: string;
    profileImageUrl?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    authorization: string;
    refreshToken: string;
  }

  /**
   * `useSession` 등으로 반환되는 Session 객체 타입입니다.
   */
  interface Session {
    user: User; // 위에서 재정의한 User 타입을 사용합니다.
    authorization?: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 콜백의 `token` 파라미터 타입입니다.
   */
  interface JWT extends BackendUserProfile {
    authorization: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}

/**
 * 만료된 액세스 토큰을 재발급하는 함수입니다.
 * @param token - 기존 JWT 객체
 * @returns 재발급된 토큰 정보를 포함한 새로운 JWT 객체
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newAccessToken = refreshedTokens.data?.authorization;
    if (!newAccessToken) {
      throw new Error("New access token not found");
    }

    // 새 토큰의 만료 시간을 현재 시간으로부터 1시간으로 설정합니다.
    const now = new Date();
    const newExpiry = now.setHours(now.getHours() + 1);

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: newExpiry,
      error: undefined, // 에러 상태 초기화
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError", // 에러 발생 시 토큰에 에러 상태를 기록합니다.
    };
  }
}

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      // `credentials` 옵션은 로그인 폼 자동 생성에 사용되지만,
      // 우리는 커스텀 로그인 페이지를 사용하므로 `authorize` 로직에 집중합니다.
      credentials: {
        authorization: { label: "Authorization Token", type: "text" },
        // refreshToken: { label: "Refresh Token", type: "text" }, // refreshToken은 HttpOnly 쿠키에서 직접 읽을 것이므로 제거
      },
      async authorize(credentials, req): Promise<User | null> {
        // req 매개변수 추가
        // credentials 객체의 유효성을 검사합니다.
        if (typeof credentials.authorization !== "string") {
          // refreshToken 검사 제거
          console.error("Invalid authorization credential provided to authorize function.");
          return null;
        }

        const { authorization } = credentials;

        // HttpOnly refreshToken 쿠키에서 직접 읽기
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
          console.error("Refresh token not found in cookies.");
          return null;
        }

        try {
          // 액세스 토큰을 이용해 백엔드에서 사용자 프로필 정보를 가져옵니다.
          const profileResponse = await fetch(`${BASE_URL}/api/v1/users/me/get/profile`, {
            headers: {
              Authorization: `Bearer ${authorization}`,
            },
          });

          // --- 여기에 추가 ---
          console.log("Profile API Response:", profileResponse);
          // --- 여기까지 추가 ---

          if (!profileResponse.ok) {
            console.error(
              `Failed to fetch user profile. Status: ${profileResponse.status}`,
              await profileResponse.text()
            );
            return null;
          }

          const userProfile: ResponseDtoUserProfileResponse = await profileResponse.json();

          // --- 여기에 추가 ---
          console.log("Parsed User Profile:", userProfile);
          // --- 여기까지 추가 ---

          // 프로필 정보가 유효하면 User 객체를 구성하여 반환합니다.
          if (userProfile && userProfile.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profile = userProfile.data as any;

            // 필수 필드(id 포함)들이 존재하는지 확인합니다.
            if (!profile.githubId || !profile.nickname || !profile.email || !profile.role) {
              console.error(
                "Required user profile fields (githubId, nickname, email, role) are missing.",
                profile
              );
              return null;
            }

            return {
              id: profile.githubId,
              name: profile.name,
              email: profile.email,
              image: profile.profileImageUrl,
              githubId: profile.githubId,
              nickname: profile.nickname,
              profileImageUrl: profile.profileImageUrl,
              role: profile.role,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
              authorization,
              refreshToken,
            };
          }

          console.error("User profile data is missing in the API response.");
          return null;
        } catch (error) {
          console.error("An error occurred during the authorize process:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * JWT가 생성되거나 업데이트될 때마다 호출됩니다.
     * 반환된 값은 암호화되어 쿠키에 저장됩니다.
     */
    async jwt({ token, user }) {
      console.log("JWT Callback Token:", token); // Added for debugging
      console.log("JWT Callback User:", user); // Added for debugging

      // 최초 로그인 시 (user 객체가 존재할 때)
      if (user) {
        const now = new Date();
        // 토큰에 필요한 정보들을 담습니다.
        return {
          ...token,
          ...user,
          accessTokenExpires: now.setHours(now.getHours() + 1),
        } as JWT;
      }

      // 페이지 이동 등 다음 요청에서는 user 객체가 없습니다.
      // 액세스 토큰이 만료되지 않았다면, 기존 토큰을 그대로 반환합니다.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // 액세스 토큰이 만료되었다면, 재발급을 시도합니다.
      return refreshAccessToken(token as JWT);
    },
    /**
     * 세션이 확인될 때마다 호출됩니다. (예: `useSession`, `getSession`)
     * 여기서 반환하는 값이 클라이언트에서 확인할 수 있는 세션 정보가 됩니다.
     */
    async session({ session, token }) {
      // token 객체에서 필요한 정보를 session.user에 담습니다.

      console.log("Session Callback Token:", token); // Added for debugging
      console.log("Session Callback Session:", session); // Added for debugging
      if (token) {
        const user = session.user as User; // session.user를 User 타입으로 캐스팅
        user.id = token.id;
        session.user.name = token.name ?? "";
        session.user.nickname = token.nickname ?? "";
        session.user.email = token.email ?? "";
        session.user.image = token.profileImageUrl;
        session.user.role = token.role ?? "";
        session.authorization = token.authorization ?? ""; // 클라이언트에서 API 요청 시 사용할 수 있도록 accessToken을 전달합니다.
        session.error = token.error;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // 세션 관리 전략으로 JWT를 사용합니다.
  },
  pages: {
    // 커스텀 로그인 페이지 경로를 설정할 수 있습니다.
    // signIn: '/login',
  },
};

// NextAuth 설정 객체를 기반으로 핸들러와 유틸 함수들을 export합니다.
export const { handlers, auth, signIn, signOut } = NextAuth(config);
