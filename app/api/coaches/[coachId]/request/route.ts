import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createCoachRequestSchema } from "@/src/features/coaches/lib/create-coach-request.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ coachId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { coachId } = await context.params;
  const parsedCoachId = Number.parseInt(coachId, 10);

  if (!Number.isFinite(parsedCoachId) || parsedCoachId < 1) {
    return NextResponse.json({ message: "Coach id is invalid." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = createCoachRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed.",
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/coaches/${parsedCoachId}/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(parsedBody.data),
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
          "Unable to send coach request.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
