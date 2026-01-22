import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserApprovalTable from "@/features/admin/components/UserApprovalTable";
import { createAdminServiceServer } from "@/features/admin/services/adminService.server";
import type { PendingUserResponse } from "@/generated/orval/models";

export default async function AdminPage() {
  let users: PendingUserResponse[] = [];
  let errorMessage: string | null = null;

  try {
    const adminService = createAdminServiceServer();
    users = await adminService.getPendingUsers();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  }

  // 권한 체크는 layout.tsx에서 서버 사이드로 처리됨

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>관리자 대시보드</CardTitle>
          <CardDescription>가입 승인 대기중인 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <p>에러: {errorMessage}</p>
          ) : users.length > 0 ? (
            <UserApprovalTable users={users} />
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-2 text-lg">승인 대기중인 사용자가 없습니다.</p>
              <p className="text-sm">모든 사용자가 승인되었습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
