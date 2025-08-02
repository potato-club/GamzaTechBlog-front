"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PendingUser } from "@/app/admin/page";

interface UserApprovalTableProps {
  users: PendingUser[];
}

export default function UserApprovalTable({ users }: UserApprovalTableProps) {
  const handleApprove = (userId: string) => {
    // TODO: Implement approve logic
    alert(`사용자 ${userId} 승인`);
  };

  const handleReject = (userId: string) => {
    // TODO: Implement reject logic
    alert(`사용자 ${userId} 거절`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.signupDate}</TableCell>
            <TableCell>
              <Badge variant={user.status === "pending" ? "secondary" : "default"}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleApprove(user.id)}>
                승인
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleReject(user.id)}>
                거절
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
