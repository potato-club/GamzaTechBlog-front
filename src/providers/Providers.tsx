"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import type { UserProfileResponse } from "@/generated/api/models";
import { QueryProvider } from "./QueryProvider";

interface ProvidersProps {
  children: React.ReactNode;
  initialUserRole?: string | null;
  initialUserProfile?: UserProfileResponse | null;
}

export default function Providers({
  children,
  initialUserRole,
  initialUserProfile,
}: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider initialUserRole={initialUserRole} initialUserProfile={initialUserProfile}>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
