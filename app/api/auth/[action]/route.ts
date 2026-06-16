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
    const approvalStatus = resolveApprovalStatus(
      responseBody,
      action as AuthMode,
      upstreamResponse.status,
    );
    const rejectionReason = resolveRejectionReason(responseBody);
    const message = resolveAuthErrorMessage(responseBody, approvalStatus);

    return NextResponse.json(
      {
        message,
        approvalStatus,
        rejectionReason,
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

function getObjectValue(payload: unknown) {
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : null;
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function resolveApprovalStatus(
  responseBody: unknown,
  action: AuthMode,
  status: number,
) {
  const value = getObjectValue(responseBody);
  const directApprovalStatus = getStringValue(value?.approvalStatus);

  if (directApprovalStatus) {
    return directApprovalStatus;
  }

  const message = getStringValue(value?.message)?.toLowerCase() ?? "";
  const rejectionReason = resolveRejectionReason(responseBody);

  if (message.includes("reject") || rejectionReason) {
    return "rejected";
  }

  if (message.includes("pending") || message.includes("approval")) {
    return "pending";
  }

  if (action === "login" && status === 403) {
    return "pending";
  }

  return undefined;
}

function resolveRejectionReason(responseBody: unknown) {
  const value = getObjectValue(responseBody);
  return getStringValue(value?.rejectionReason);
}

function resolveAuthErrorMessage(
  responseBody: unknown,
  approvalStatus?: string,
) {
  const value = getObjectValue(responseBody);
  const directMessage = getStringValue(value?.message);

  if (approvalStatus === "pending") {
    return (
      directMessage ??
      "Registration request created. Wait for admin approval."
    );
  }

  return directMessage ?? "Authentication request failed.";
}
