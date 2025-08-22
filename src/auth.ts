import { ResponseDtoUserProfileResponse } from "@/generated/api";
import { getCookie } from "cookies-next";
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
 * JWT 비밀 키를 환경 변수에서 가져와 올바른 형식(Uint8Array)으로 변환합니다.
 * 키가 Base64로 인코딩된 경우 디코딩하여 사용합니다.
 */
function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  // Secret key가 base64로 인코딩되어 있는지 확인하고 처리
  if (secret.endsWith("=") || /^[A-Za-z0-9+/]*={0,2}$/.test(secret)) {
    // Base64로 디코딩
    return Buffer.from(secret, "base64");
  } else {
    // 일반 문자열로 처리
    return new TextEncoder().encode(secret);
  }
}

/**
 * 만료된 액세스 토큰을 재발급하는 함수입니다.
 * @param token - 기존 JWT 객체
 * @returns 재발급된 토큰 정보를 포함한 새로운 JWT 객체
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log("refreshAccessToken called with token:", token);
  try {
    // Get the latest refreshToken from the cookie
    const latestRefreshTokenFromCookie = getCookie("refreshToken"); // Assuming "refreshToken" is the cookie name

    if (!latestRefreshTokenFromCookie) {
      console.error("Latest refresh token not found in cookies during refresh attempt.");
      return {
        ...token,
        error: "RefreshAccessTokenError", // Indicate failure
      };
    }

    const requestBody = JSON.stringify({ refreshToken: latestRefreshTokenFromCookie }); // Use the latest from cookie
    console.log("Reissue API request body:", requestBody);
    const response = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    const refreshedTokens = await response.json();
    console.log("Reissue API response:", refreshedTokens);

    if (!response.ok) {
      console.error("Reissue API returned an error:", refreshedTokens);
      throw refreshedTokens;
    }

    const newAccessToken = refreshedTokens.data?.authorization;
    if (!newAccessToken) {
      throw new Error("New access token not found");
    }

    const secretKey = getJwtSecretKey();
    const { payload } = await jose.jwtVerify(newAccessToken, secretKey);
    const newExpiry = (payload.exp as number) * 1000; // `exp`는 초 단위이므로 밀리초로 변환

    return {
      ...token,
      authorization: newAccessToken, // 새 액세스 토큰으로 교체
      // No need to update refreshToken here, as backend doesn't return new one
      accessTokenExpires: newExpiry, // 실제 만료 시간으로 업데이트
      error: undefined, // 에러 상태 초기화
    };
  } catch (error) {
    console.error("Error refreshing access token in catch block:", error);
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
      // 최초 로그인 시 (user 객체가 존재할 때)
      if (user) {
        const secretKey = getJwtSecretKey();
        const { payload } = await jose.jwtVerify(user.authorization, secretKey);
        const accessTokenExpires = (payload.exp as number) * 1000; // `exp`는 초 단위이므로 밀리초로 변환

        // 토큰에 필요한 정보들을 담습니다.
        return {
          ...token,
          ...user,
          accessTokenExpires,
        } as JWT;
      }

      // 페이지 이동 등 다음 요청에서는 user 객체가 없습니다.
      // 액세스 토큰이 만료되지 않았다면, 기존 토큰을 그대로 반환합니다.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // 액세스 토큰이 만료되었다면, 재발급을 시도합니다.
      console.log("Access token expired. Attempting to refresh...");
      const refreshedToken = await refreshAccessToken(token as JWT);
      console.log("Refreshed token result:", refreshedToken);
      return refreshedToken;
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
        user.name = token.name ?? "";
        user.nickname = token.nickname ?? "";
        user.email = token.email ?? "";
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
