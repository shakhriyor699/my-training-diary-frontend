import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

export async function getGymCoinAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
}

export async function forwardGymCoinRequest(
  path: string,
  init: RequestInit & { accessToken: string },
) {
  const upstreamResponse = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: createHeaders(init.headers, init.accessToken, init.body),
    cache: "no-store",
  });

  const responseBody = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        ...(responseBody && typeof responseBody === "object" ? responseBody : {}),
        message:
          responseBody &&
          typeof responseBody === "object" &&
          "message" in responseBody &&
          typeof responseBody.message === "string"
            ? responseBody.message
            : "GymCoin request failed.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}

function createHeaders(
  headers: HeadersInit | undefined,
  accessToken: string,
  body: BodyInit | null | undefined,
) {
  const requestHeaders = new Headers(headers);

  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  return requestHeaders;
}
