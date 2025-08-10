export const API_PATHS = {
  posts: {
    base: "/api/v1/posts",
    byId: (id: number) => `/api/v1/posts/${id}`,
    popular: "/api/v1/posts/popular",
    byTag: (tagName: string) => `/api/v1/posts/tags/${tagName}`,
    search: "/api/v1/posts/search",
    me: "/api/v1/posts/me",
    images: "/api/v1/posts/images",
  },
  tags: {
    base: "/api/v1/tags",
  },
  likes: {
    me: "/api/v1/likes/me",
    like: (postId: number) => `/api/v1/likes/${postId}`,
    status: (postId: number) => `/api/v1/likes/${postId}/liked`,
  },
  admin: {
    pendingUsers: "/api/admin/users/pending",
    approveUser: (userId: number) => `/api/admin/users/${userId}/approve`,
  },
  comments: {
    byPostId: (postId: number) => `/api/v1/comment/${postId}/comments`,
    byId: (commentId: number) => `/api/v1/comment/${commentId}`,
    me: "/api/v1/comment/me/comments",
  },
  users: {
    profile: "/api/v1/users/me/get/profile",
    logout: "/api/auth/me/logout",
    completeSignup: "/api/v1/users/me/complete",
    completeProfile: "/api/v1/users/me/complete/profile",
    withdraw: "/api/v1/users/me/withdraw",
    activity: "/api/v1/users/me/activity",
    role: "/api/v1/users/me/role",
    profileImage: "/api/v1/profile-images",
    updateProfile: "/api/v1/users/me/update/profile",
  },
} as const;
