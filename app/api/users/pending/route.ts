import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const upstreamResponse = await fetch(`${env.API_BASE_URL}/users/pending`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const responseBody = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        message:
          responseBody &&
          typeof responseBody === "object" &&
          "message" in responseBody &&
          typeof responseBody.message === "string"
            ? responseBody.message
            : "Unable to load pending users.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
