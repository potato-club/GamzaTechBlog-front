"use client";

import UserApprovalTable from "@/components/features/admin/UserApprovalTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingUsers } from "@/hooks/queries/useAdminQueries";
import { useAuth } from "@/hooks/queries/useUserQueries";

export default function AdminPage() {
  const { data: users, isLoading, isError, error } = usePendingUsers();
  const { userProfile, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>권한 확인 중...</p>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== "ADMIN") {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card>
          <CardHeader>
            <CardTitle>접근 불가</CardTitle>
            <CardDescription>관리자만 접근할 수 있습니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
