"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApproveUser } from "@/hooks/queries/useAdminQueries";
import { PendingUser } from "@/types/user";

interface UserApprovalTableProps {
  users: PendingUser[];
}

export default function UserApprovalTable({ users }: UserApprovalTableProps) {
  const approveUserMutation = useApproveUser();

  const handleApprove = (userId: string) => {
    approveUserMutation.mutate(userId);
  };

  const handleReject = (userId: string) => {
    // TODO: Implement reject logic
    alert(`사용자 ${userId} 거절`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>아이디</TableHead>
          <TableHead>감자 기수</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>직군</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.userId}>
            <TableCell className="font-medium">{user.userId}</TableCell>
            <TableCell>{user.gamjaBatch}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.position}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(user.userId)}
                disabled={approveUserMutation.isPending}
              >
                {approveUserMutation.isPending ? "승인 중..." : "승인"}
              </Button>
              {/* <Button variant="destructive" size="sm" onClick={() => handleReject(user.userId)}>
                거절
              </Button> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
