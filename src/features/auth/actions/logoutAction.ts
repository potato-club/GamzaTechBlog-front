"use server";

import { cookies, headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function logoutAction(): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("authorization")?.value;

  const requestHeaders = new Headers();

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  if (accessToken) {
    requestHeaders.set("authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me/logout`, {
    method: "POST",
    headers: requestHeaders,
    redirect: "manual",
  });

  cookieStore.delete("authorization");
  cookieStore.delete("refreshToken");

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}
