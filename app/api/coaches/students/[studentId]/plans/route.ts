import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createTrainingPlanSchema,
} from "@/src/features/training-plans/lib/create-training-plan.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ studentId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { studentId } = await context.params;
  const parsedStudentId = Number.parseInt(studentId, 10);

  if (!Number.isFinite(parsedStudentId) || parsedStudentId < 1) {
    return NextResponse.json({ message: "Student id is invalid." }, { status: 400 });
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/coaches/students/${parsedStudentId}/plans`,
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
          "Unable to load student training plans.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}

export async function POST(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { studentId } = await context.params;
  const parsedStudentId = Number.parseInt(studentId, 10);

  if (!Number.isFinite(parsedStudentId) || parsedStudentId < 1) {
    return NextResponse.json({ message: "Student id is invalid." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = createTrainingPlanSchema.safeParse(json);

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
    `${env.API_BASE_URL}/coaches/students/${parsedStudentId}/plans`,
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
          "Unable to create training plan for student.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
