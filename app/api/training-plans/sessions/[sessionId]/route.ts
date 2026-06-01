import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { updateTrainingSessionSchema } from "@/src/features/training-plans/lib/create-training-session.schema";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { sessionId } = await context.params;
  const parsedSessionId = Number.parseInt(sessionId, 10);

  if (!Number.isFinite(parsedSessionId) || parsedSessionId < 1) {
    return NextResponse.json(
      { message: "Training session id is invalid." },
      { status: 400 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsedBody = updateTrainingSessionSchema.safeParse(json);

  if (!parsedBody.success) {
    console.error("[training-session.patch] Validation failed", {
      sessionId: parsedSessionId,
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

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/training-plans/sessions/${parsedSessionId}`,
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
    console.error("[training-session.patch] Upstream request failed", {
      sessionId: parsedSessionId,
      status: upstreamResponse.status,
      payload: parsedBody.data,
      responseBody,
    });

    return NextResponse.json(
      {
        message: extractErrorMessage(
          responseBody,
          "Unable to update training session.",
        ),
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { sessionId } = await context.params;
  const parsedSessionId = Number.parseInt(sessionId, 10);

  if (!Number.isFinite(parsedSessionId) || parsedSessionId < 1) {
    return NextResponse.json(
      { message: "Training session id is invalid." },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(
    `${env.API_BASE_URL}/training-plans/sessions/${parsedSessionId}`,
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
    console.error("[training-session.delete] Upstream request failed", {
      sessionId: parsedSessionId,
      status: upstreamResponse.status,
      responseBody,
    });

    return NextResponse.json(
      {
        message: extractErrorMessage(
          responseBody,
          "Unable to delete training session.",
        ),
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(responseBody, { status: upstreamResponse.status });
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  if ("message" in payload) {
    const message = payload.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const firstMessage = message.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      );

      if (firstMessage) {
        return firstMessage;
      }
    }
  }

  if ("error" in payload && typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return fallback;
}
