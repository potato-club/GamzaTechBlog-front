import { API_CONFIG } from './api';

export const AUTH_CONFIG = {
  OAUTH_LOGIN_URL: process.env.NEXT_PUBLIC_OAUTH_LOGIN_URL ||
    `${API_CONFIG.BASE_URL}/login/oauth2/code/github`,
  COOKIE_NAME: 'refreshToken',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24시간
} as const;