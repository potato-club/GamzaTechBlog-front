export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  ENDPOINTS: {
    AUTH: {
      LOGOUT: "/api/v1/auth/logout",
    },
    USER: {
      // TEST: '/login/oauth2/code/github',
      PROFILE: "/api/v1/users/me/get/profile",
      UPDATE_PROFILE: "/api/v1/users/me/update/profile",
      COMPLETE_PROFILE: "/api/v1/users/me/complete",
      WITHDRAW: "/api/v1/users/me/withdraw",
    },
  },
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
  REQUEST_CONFIG: {
    credentials: "include" as RequestCredentials,
  },
} as const;
