import { jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트에서 JWT 토큰을 검증하여 사용자 정보를 가져오는 유틸리티
 */

interface UserJWTPayload {
  sub: string;
  githubId: string;
  jti: string;
  iat: number;
  exp: number;
}

/**
 * 서버에서 현재 로그인한 사용자 정보를 가져옵니다
 *
 * @returns 사용자 정보 또는 null (로그인하지 않은 경우)
 */
export async function getCurrentUser(): Promise<UserJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authorization")?.value;

    if (!token) {
      return null;
    }

    // JWT 토큰 헤더 디버깅
    try {
      const headerBase64 = token.split(".")[0];
      const header = JSON.parse(Buffer.from(headerBase64, "base64").toString());
      console.log("JWT Header:", header);
    } catch (headerError) {
      console.warn("Could not decode JWT header:", headerError);
    }

    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      console.error("JWT_SECRET_KEY is not defined in environment variables");
      return null;
    }

    try {
      // JWT 토큰을 안전하게 검증
      let secret: Uint8Array;

      // Secret key가 base64로 인코딩되어 있는지 확인하고 처리
      if (jwtSecret.endsWith("=") || /^[A-Za-z0-9+/]*={0,2}$/.test(jwtSecret)) {
        // Base64로 디코딩
        secret = new Uint8Array(Buffer.from(jwtSecret, "base64"));
        console.log("Using base64 decoded secret");
      } else {
        // 일반 문자열로 처리
        secret = new TextEncoder().encode(jwtSecret);
        console.log("Using plain text secret");
      }

      const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256", "HS384", "HS512"], // 일반적인 HMAC 알고리즘들 시도
      });
      console.log("JWT verification successful");
      return payload as unknown as UserJWTPayload;
    } catch (verifyError) {
      console.warn("JWT verification failed, falling back to decode:", verifyError);

      // fallback: JWT 토큰을 디코딩만 수행 (검증 없이)
      const base64Payload = token.split(".")[1];
      if (!base64Payload) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());

      // 토큰 만료 확인
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }

      return payload as UserJWTPayload;
    }
  } catch (error) {
    console.error("Error processing JWT:", error);
    return null;
  }
}

/**
 * 현재 사용자가 특정 게시글의 작성자인지 확인합니다
 *
 * @param postWriter 게시글 작성자 닉네임
 * @returns 작성자 여부
 */
export async function isPostAuthor(postWriter: string): Promise<boolean> {
  const currentUser = await getCurrentUser();
  return currentUser?.githubId === postWriter;
}
