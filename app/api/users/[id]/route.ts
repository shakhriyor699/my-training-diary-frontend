import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";
import {
  updateUserSchema,
} from "@/src/features/users/lib/update-user.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const json = await request.json().catch(() => null);
  const parsedBody = updateUserSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed.",
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const body = Object.fromEntries(
    Object.entries(parsedBody.data).filter(([, value]) => value !== undefined),
  );

  const upstreamResponse = await fetch(`${env.API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
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
          "Unable to update user.",
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}
