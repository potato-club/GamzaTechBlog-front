import { createUserServiceServer } from "@/features/user";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    const userService = createUserServiceServer();
    const profile = await userService.getProfile();

    if (!isAdmin(profile)) {
      redirect("/403");
    }
  } catch {
    redirect("/403");
  }

  return <>{children}</>;
}
