import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createNutritionDaySchema } from "@/src/features/nutrition/lib/create-nutrition-day.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ planId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { planId } = await context.params;
  const parsedPlanId = Number.parseInt(planId, 10);

  if (!Number.isFinite(parsedPlanId) || parsedPlanId < 1) {
    return NextResponse.json({ message: "Invalid plan id." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody = createNutritionDaySchema.safeParse(json);

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
    `${env.API_BASE_URL}/nutrition/plans/${parsedPlanId}/days`,
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
          "Unable to add nutrition day.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
