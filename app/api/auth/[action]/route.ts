import { NextResponse } from "next/server";

import {
  loginCredentialsSchema,
  registerCredentialsSchema,
  type AuthMode,
} from "@/src/features/auth/lib/auth.schema";
import { createAuthResponse } from "@/src/features/auth/lib/auth-cookie";
import type { RegisterAuthResponse } from "@/src/features/auth/lib/auth-response";
import { env } from "@/src/shared/config/env";

type RouteContext = {
  params: Promise<{ action: string }>;
};

const AUTH_ACTIONS = new Set<AuthMode>(["login", "register"]);

export async function POST(request: Request, context: RouteContext) {
  const { action } = await context.params;

  if (!AUTH_ACTIONS.has(action as AuthMode)) {
    return NextResponse.json({ message: "Unsupported auth action." }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsedBody =
    action === "register"
      ? registerCredentialsSchema.safeParse(json)
      : loginCredentialsSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed.",
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(`${env.API_BASE_URL}/auth/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedBody.data),
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
          "Authentication request failed.",
        approvalStatus:
          responseBody &&
          typeof responseBody === "object" &&
          "approvalStatus" in responseBody &&
          typeof responseBody.approvalStatus === "string"
            ? responseBody.approvalStatus
            : undefined,
        rejectionReason:
          responseBody &&
          typeof responseBody === "object" &&
          "rejectionReason" in responseBody &&
          typeof responseBody.rejectionReason === "string"
            ? responseBody.rejectionReason
            : undefined,
      },
      { status: upstreamResponse.status },
    );
  }

  if (action === "register") {
    return NextResponse.json<RegisterAuthResponse>(
      {
        message:
          responseBody &&
          typeof responseBody === "object" &&
          "message" in responseBody &&
          typeof responseBody.message === "string"
            ? responseBody.message
            : "Registration request created. Wait for admin approval.",
        user:
          responseBody &&
          typeof responseBody === "object" &&
          "user" in responseBody &&
          responseBody.user &&
          typeof responseBody.user === "object"
            ? {
                id:
                  "id" in responseBody.user && typeof responseBody.user.id === "number"
                    ? responseBody.user.id
                    : 0,
                email:
                  "email" in responseBody.user && typeof responseBody.user.email === "string"
                    ? responseBody.user.email
                    : parsedBody.data.email,
                role:
                  "role" in responseBody.user && typeof responseBody.user.role === "string"
                    ? responseBody.user.role
                    : "user",
                approvalStatus:
                  "approvalStatus" in responseBody.user &&
                  typeof responseBody.user.approvalStatus === "string"
                    ? responseBody.user.approvalStatus
                    : "pending",
                rejectionReason:
                  "rejectionReason" in responseBody.user &&
                  typeof responseBody.user.rejectionReason === "string"
                    ? responseBody.user.rejectionReason
                    : null,
              }
            : {
                id: 0,
                email: parsedBody.data.email,
                role: "user",
                approvalStatus: "pending",
                rejectionReason: null,
              },
      },
      { status: upstreamResponse.status },
    );
  }

  const accessToken =
    responseBody &&
    typeof responseBody === "object" &&
    "accessToken" in responseBody &&
    typeof responseBody.accessToken === "string"
      ? responseBody.accessToken
      : null;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Access token is missing in the auth response." },
      { status: 502 },
    );
  }

  const forwardedCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : [];

  return createAuthResponse({
    status: upstreamResponse.status,
    accessToken,
    forwardedCookies,
  });
}
