export const USER_QUERY_KEYS = {
  all: ["user"] as const,
  profile: () => [...USER_QUERY_KEYS.all, "profile"] as const,
  activityStats: () => [...USER_QUERY_KEYS.all, "activityStats"] as const,
  role: () => [...USER_QUERY_KEYS.all, "role"] as const,
  publicProfile: (username: string) => [...USER_QUERY_KEYS.all, "publicProfile", username] as const,
  publicActivityStats: (username: string) =>
    [...USER_QUERY_KEYS.all, "publicActivityStats", username] as const,
  publicPosts: (username: string) => [...USER_QUERY_KEYS.all, "publicPosts", username] as const,
} as const;
