import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // 서버사이드에서는 쿠키 헤더 접근 가능
  const cookieHeader = request.headers.get('cookie');

  const response = await fetch('https://gamzatech.site/api/v1/users/me/get/profile', {
    headers: {
      'Cookie': cookieHeader || '', // 서버가 쿠키를 백엔드에 전달
    },
  });

  return Response.json(await response.json());
}