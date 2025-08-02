"use client";

import UserApprovalTable from "@/components/features/admin/UserApprovalTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingUsers } from "@/hooks/queries/useAdminQueries";

export default function AdminPage() {
  const { data: users, isLoading, isError, error } = usePendingUsers();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>관리자 대시보드</CardTitle>
          <CardDescription>가입 승인 대기중인 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>로딩 중...</p>}
          {isError && <p>에러: {error.message}</p>}
          {users && <UserApprovalTable users={users.data} />}
        </CardContent>
      </Card>
    </div>
  );
}

