import { jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트에서 JWT 토큰을 검증하여 사용자 정보를 가져오는 유틸리티
 */

/**
 * JWT 시크릿 키를 Uint8Array로 변환합니다
 * @param jwtSecret 환경변수에서 가져온 JWT 시크릿 키
 * @returns 변환된 Uint8Array
 */
function createJWTSecret(jwtSecret: string): Uint8Array {
  try {
    // Secret key가 base64로 인코딩되어 있는지 확인하고 처리
    if (jwtSecret.endsWith("=") || /^[A-Za-z0-9+/]*={0,2}$/.test(jwtSecret)) {
      // Base64로 디코딩
      return new Uint8Array(Buffer.from(jwtSecret, "base64"));
    } else {
      // 일반 문자열로 처리
      return new TextEncoder().encode(jwtSecret);
    }
  } catch (error) {
    throw new Error(`Failed to process JWT secret: ${error}`);
  }
}

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

    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      console.error("JWT_SECRET_KEY is not defined in environment variables");
      return null;
    }

    // JWT 토큰을 안전하게 검증
    const secret = createJWTSecret(jwtSecret);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"], // 보안을 위해 단일 알고리즘만 허용
    });

    return payload as unknown as UserJWTPayload;
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
