/**
 * 403 Forbidden 에러 페이지
 *
 * 관리자 권한이 없는 사용자가 관리자 페이지에 접근할 때 표시되는 페이지입니다.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">접근 권한이 없습니다</CardTitle>
          <CardDescription className="text-base">
            이 페이지에 접근할 권한이 없습니다.
            <br />
            관리자 권한이 필요합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="muted-foreground text-sm">
            <p>요청하신 페이지는 관리자만 접근할 수 있습니다.</p>
            <p>권한이 필요하시다면 관리자에게 문의해주세요.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/mypage">내 프로필</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
