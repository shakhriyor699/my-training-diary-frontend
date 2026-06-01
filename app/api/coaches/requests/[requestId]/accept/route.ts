import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { requestId } = await context.params;
  const parsedRequestId = Number.parseInt(requestId, 10);

  if (!Number.isFinite(parsedRequestId) || parsedRequestId < 1) {
    return NextResponse.json({ message: "Request id is invalid." }, { status: 400 });
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/coaches/requests/${parsedRequestId}/accept`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

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
          "Unable to accept coach request.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
