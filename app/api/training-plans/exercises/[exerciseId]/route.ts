import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createWorkoutExerciseSchema,
} from "@/src/features/training-plans/lib/create-workout-exercise.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ exerciseId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { exerciseId } = await context.params;
  const parsedExerciseId = Number.parseInt(exerciseId, 10);

  if (!Number.isFinite(parsedExerciseId) || parsedExerciseId < 1) {
    return NextResponse.json({ message: "Invalid exercise id." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = createWorkoutExerciseSchema.safeParse(json);

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
    `${env.API_BASE_URL}/training-plans/exercises/${parsedExerciseId}`,
    {
      method: "PATCH",
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
          "Unable to update exercise.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}

export async function DELETE(_: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { exerciseId } = await context.params;
  const parsedExerciseId = Number.parseInt(exerciseId, 10);

  if (!Number.isFinite(parsedExerciseId) || parsedExerciseId < 1) {
    return NextResponse.json({ message: "Invalid exercise id." }, { status: 400 });
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/training-plans/exercises/${parsedExerciseId}`,
    {
      method: "DELETE",
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
          "Unable to delete exercise.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
