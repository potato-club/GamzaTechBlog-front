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
import { useApproveUser } from "@/features/admin";
import { PendingUserResponse } from "@/generated/api/models";

interface UserApprovalTableProps {
  users: PendingUserResponse[];
}

export default function UserApprovalTable({ users }: UserApprovalTableProps) {
  const approveUserMutation = useApproveUser();

  const handleApprove = (userId: number) => {
    approveUserMutation.mutate(userId);
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
            <TableCell>{user.userId}</TableCell>
            <TableCell>{user.gamjaBatch}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.position}</TableCell>
            <TableCell className="space-x-2 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(user.userId ?? 0)}
                disabled={approveUserMutation.isPending}
              >
                {approveUserMutation.isPending ? "승인 중..." : "승인"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
