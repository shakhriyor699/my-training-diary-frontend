import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ exerciseId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { exerciseId } = await context.params;
  const parsedExerciseId = Number.parseInt(exerciseId, 10);

  if (!Number.isFinite(parsedExerciseId) || parsedExerciseId < 1) {
    return NextResponse.json({ message: "Exercise id is invalid." }, { status: 400 });
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/training-plans/exercises/${parsedExerciseId}/recommendation`,
    {
      method: "GET",
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
          "Unable to load exercise recommendation.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
