import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createAuthResponse } from "@/src/features/auth/lib/auth-cookie";
import { env } from "@/src/shared/config/env";

export async function POST() {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");

  if (!cookie) {
    return NextResponse.json(
      { message: "Refresh cookie is required." },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  const responseBody = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        message:
          (responseBody &&
            typeof responseBody === "object" &&
            "message" in responseBody &&
            typeof responseBody.message === "string" &&
            responseBody.message) ||
          "Unable to refresh access token.",
      },
      { status: upstreamResponse.status },
    );
  }

  const accessToken =
    responseBody &&
    typeof responseBody === "object" &&
    "accessToken" in responseBody &&
    typeof responseBody.accessToken === "string"
      ? responseBody.accessToken
      : null;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Access token is missing in the refresh response." },
      { status: 502 },
    );
  }

  const forwardedCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : [];

  return createAuthResponse({
    status: upstreamResponse.status,
    accessToken,
    forwardedCookies,
  });
}
