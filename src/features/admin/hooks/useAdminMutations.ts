"use client";

import type { ActionResult } from "@/lib/actionResult";
import { useMutation } from "@tanstack/react-query";
import { approveUserAction } from "../actions/adminActions";

export function useApproveUser() {
  return useMutation<ActionResult<void>, Error, number>({
    mutationFn: (userId: number) => approveUserAction(userId),
  });
}
