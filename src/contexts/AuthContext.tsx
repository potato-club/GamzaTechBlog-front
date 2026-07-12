"use client";

import type { UserProfileResponse } from "@/generated/api/models";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthContextValue {
  userRole: string | null;
  userProfile: UserProfileResponse | null;
  /** /api/users/me 부트스트랩 조회가 진행 중인지 (초기 마운트 시 true) */
  isLoading: boolean;
  /** 인증 상태를 다시 조회한다 (로그인/로그아웃/프로필 수정 후) */
  refetch: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface MeResponse {
  role: string | null;
  profile: UserProfileResponse | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchMe(): Promise<MeResponse> {
  const response = await fetch("/api/users/me", { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch auth state (status ${response.status}).`);
  }
  return (await response.json()) as MeResponse;
}

/**
 * 인증 상태 클라이언트 부트스트랩 Provider
 *
 * 서버 렌더 시점에는 인증 정보를 알지 못한 채 "로딩" 상태로 HTML을 만든다(→ 정적/ISR 캐시 가능).
 * 마운트 후 /api/users/me(BFF)로 현재 사용자를 조회해 컨텍스트를 채운다.
 * 개인화 조회를 서버 렌더에서 분리하는 것이 이 Provider의 존재 이유다.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { role, profile } = await fetchMe();
      setUserRole(role);
      setUserProfile(profile);
    } catch (error) {
      console.warn(
        "Auth bootstrap failed:",
        error instanceof Error ? `${error.name}: ${error.message}` : String(error)
      );
      setUserRole(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({ userRole, userProfile, isLoading, refetch }),
    [userRole, userProfile, isLoading, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  return (
    context ?? {
      userRole: null,
      userProfile: null,
      isLoading: false,
      refetch: async () => {},
    }
  );
}
