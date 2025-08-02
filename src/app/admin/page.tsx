import UserApprovalTable from "@/components/features/admin/UserApprovalTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  status: "pending" | "approved" | "rejected";
}

const mockUsers: PendingUser[] = [
  {
    id: "USR001",
    name: "김민준",
    email: "minjun.kim@example.com",
    signupDate: "2024-08-03",
    status: "pending",
  },
  {
    id: "USR002",
    name: "이서연",
    email: "seoyeon.lee@example.com",
    signupDate: "2024-08-02",
    status: "pending",
  },
  {
    id: "USR003",
    name: "박도윤",
    email: "doyoon.park@example.com",
    signupDate: "2024-08-02",
    status: "pending",
  },
  {
    id: "USR004",
    name: "최지우",
    email: "jiwoo.choi@example.com",
    signupDate: "2024-08-01",
    status: "pending",
  },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>관리자 대시보드</CardTitle>
          <CardDescription>가입 승인 대기중인 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserApprovalTable users={mockUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
