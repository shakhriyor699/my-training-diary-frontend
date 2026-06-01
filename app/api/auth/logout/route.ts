import { headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

export async function POST() {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");

  if (cookie) {
    try {
      await fetch(`${env.API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          cookie,
        },
        cache: "no-store",
      });
    } catch {
      // Even if backend logout fails, clear local cookies to end the session.
    }
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
