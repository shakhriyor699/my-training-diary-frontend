import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function requireAccessToken(locale: string) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect(`/${locale}/login`);
  }

  return accessToken;
}

export async function redirectIfAuthenticated(locale: string) {
  const accessToken = await getAccessToken();

  if (accessToken) {
    redirect(`/${locale}/dashboard`);
  }
}
