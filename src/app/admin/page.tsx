"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePendingUsers, UserApprovalTable } from "@/features/admin";

export default function AdminPage() {
  const { data: users, isLoading, isError, error } = usePendingUsers();

  // 권한 체크는 layout.tsx에서 서버 사이드로 처리됨

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>관리자 대시보드</CardTitle>
          <CardDescription>가입 승인 대기중인 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
          {isError && <p>에러: {error.message}</p>}
          {users &&
            (users.length > 0 ? (
              <UserApprovalTable users={users} />
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p className="mb-2 text-lg">승인 대기중인 사용자가 없습니다.</p>
                <p className="text-sm">모든 사용자가 승인되었습니다.</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
