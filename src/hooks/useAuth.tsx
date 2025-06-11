import { getCurrentUser, userService } from '@/services/userService'; // userService 경로 확인 필요
import { AuthResponse } from "@/types/auth";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProfileData } from "../types/user";

// 쿼리 키를 상수로 정의하면 오타 방지 및 재사용에 용이
const AUTH_QUERY_KEY = ['authStatus'];

interface UseAuthOptions {
  // 서버 컴포넌트 등에서 초기 데이터를 주입받을 수 있도록 옵션 추가 (선택 사항)
  initialData?: AuthResponse | undefined;
}

export function useAuth(options?: UseAuthOptions) {
  const queryClient = useQueryClient(); // QueryClient 인스턴스 가져오기

  const {
    data,
    isLoading,
    error,
    isError,
    refetch, // 수동으로 쿼리를 다시 실행하는 함수
  } = useQuery<AuthResponse, Error>({ // 첫 번째 제네릭: queryFn의 반환 타입, 두 번째 제네릭: 에러 타입
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<AuthResponse> => {
      console.log('Fetching auth status via React Query using getCurrentUser...'); // 디버깅 로그
      const userProfile: UserProfileData | null = await getCurrentUser();
      if (userProfile) {
        return { isAuthenticated: true, user: userProfile };
      } else {
        return { isAuthenticated: false, user: null };
      }
    },
    // staleTime, cacheTime 등은 QueryClientProvider에서 설정한 기본값을 따르거나,
    // 여기서 개별적으로 재정의할 수 있습니다.
    // staleTime: 5 * 60 * 1000, // 예: 5분 동안 fresh 상태로 간주
    // cacheTime: 15 * 60 * 1000, // 예: 15분 동안 캐시 유지 (비활성 시)
    initialData: options?.initialData, // 초기 데이터 설정 (SSR 또는 다른 소스에서 주입 시)
    // enabled: boolean, // 특정 조건에서만 쿼리 실행 (예: 토큰이 있을 때만)
    // refetchOnWindowFocus: true, // 기본값은 true, 필요에 따라 false로 설정 가능
  });

  // 로그인 성공 시 외부에서 호출하여 React Query 캐시를 업데이트하는 함수
  const login = (authData: AuthResponse) => {
    // 로그인 성공 시 수동으로 캐시 업데이트 (UI 즉시 반영)
    queryClient.setQueryData(AUTH_QUERY_KEY, authData);
    // 필요하다면 다른 관련 쿼리 무효화하여 최신 데이터로 갱신 유도
    // queryClient.invalidateQueries({ queryKey: ['userSpecificData'] });
    console.log('Auth status cache updated after login:', authData);
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    try {
      const response = await userService.logout(); // 실제 백엔드 로그아웃 API 호출
      console.log('Logout response:', response);
      // 로그아웃 성공 시 인증 상태 캐시 업데이트
      queryClient.setQueryData(AUTH_QUERY_KEY, { isAuthenticated: false, user: null });
      console.log('Auth status cache updated after logout.');
      // 또는 특정 쿼리를 무효화하여 다시 가져오도록 할 수 있습니다.
      // queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      // 모든 캐시를 지우고 싶다면 (강력하지만, 다른 데이터도 사라짐):
      // queryClient.clear();
    } catch (logoutError) {
      console.error("Logout failed:", logoutError);
      // 사용자에게 에러 알림 등의 추가 처리 가능
    }
  };

  return {
    // data가 undefined일 수 있으므로 (초기 로딩, 에러 등), 기본값을 제공합니다.
    isLoggedIn: data?.isAuthenticated ?? false,
    userProfile: data?.user ?? null,
    isLoading, // 데이터 로딩 중 여부
    error,     // 에러 객체 (Error 타입)
    isError,   // 에러 발생 여부 (boolean)
    refetchAuthStatus: refetch, // 인증 상태를 수동으로 다시 가져오는 함수
    login,     // 로그인 시 캐시 업데이트 함수
    logout,    // 로그아웃 처리 함수
  };
}