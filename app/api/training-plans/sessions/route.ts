import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createTrainingSessionSchema,
} from "@/src/features/training-plans/lib/create-training-session.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = createTrainingSessionSchema.safeParse(json);

  if (!parsedBody.success) {
    console.error("[training-session.create] Validation failed", {
      errors: parsedBody.error.flatten(),
      body: json,
    });

    return NextResponse.json(
      {
        message: "Validation failed.",
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(`${env.API_BASE_URL}/training-plans/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(parsedBody.data),
    cache: "no-store",
  });

  const responseBody = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    console.error("[training-session.create] Upstream request failed", {
      status: upstreamResponse.status,
      payload: parsedBody.data,
      responseBody,
    });

    return NextResponse.json(
      {
        message:
          (responseBody &&
            typeof responseBody === "object" &&
            "message" in responseBody &&
            typeof responseBody.message === "string" &&
            responseBody.message) ||
          "Unable to record training session.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
