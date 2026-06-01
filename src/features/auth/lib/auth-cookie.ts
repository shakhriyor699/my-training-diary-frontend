import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

import type { AuthResponse } from "./auth-response";

type ProxyAuthResponseOptions = {
  status: number;
  accessToken: string;
  forwardedCookies?: string[];
};

export function createAuthResponse({
  status,
  accessToken,
  forwardedCookies = [],
}: ProxyAuthResponseOptions) {
  const response = NextResponse.json<AuthResponse>(
    {
      accessToken,
    },
    { status },
  );

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  });

  for (const cookie of forwardedCookies) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}
