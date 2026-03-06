"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import type { UserProfileResponse } from "@/generated/api/models";

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
    <AuthProvider initialUserRole={initialUserRole} initialUserProfile={initialUserProfile}>
      {children}
    </AuthProvider>
  );
}
