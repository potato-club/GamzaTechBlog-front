"use client";

import type { UserProfileResponse } from "@/generated/orval/models";
import { createContext, useContext, useMemo } from "react";

export interface AuthContextValue {
  userRole: string | null;
  userProfile: UserProfileResponse | null;
}

interface AuthProviderProps {
  initialUserRole?: string | null;
  initialUserProfile?: UserProfileResponse | null;
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ initialUserRole, initialUserProfile, children }: AuthProviderProps) {
  const value = useMemo<AuthContextValue>(
    () => ({
      userRole: initialUserRole ?? null,
      userProfile: initialUserProfile ?? null,
    }),
    [initialUserRole, initialUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  return context ?? { userRole: null, userProfile: null };
}
