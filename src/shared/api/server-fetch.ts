import { cookies } from "next/headers";

import type { AuthResponse } from "@/src/features/auth/lib/auth-response";
import { ApiError, requestJson } from "@/src/shared/api/base";
import { ACCESS_TOKEN_COOKIE } from "@/src/shared/config/cookies";
import { env } from "@/src/shared/config/env";

type ServerApiFetchOptions = RequestInit & {
  authenticated?: boolean | "optional";
  message?: string;
};

export async function serverApiFetch<T>(
  path: string,
  options?: ServerApiFetchOptions,
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const authMode = options?.authenticated;
  let accessToken = authMode
    ? cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
    : undefined;

  if (authMode && !accessToken) {
    const refreshedToken = await refreshAccessToken(cookieHeader);

    if (refreshedToken) {
      accessToken = refreshedToken;
    } else if (authMode !== "optional") {
      throw new ApiError("Unauthorized.", 401);
    }
  }

  try {
    return await requestJson<T>(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: createRequestHeaders(options, accessToken),
      cache: options?.cache ?? "no-store",
    });
  } catch (error) {
    if (!shouldAttemptTokenRefresh(error, authMode)) {
      throw error;
    }

    const refreshedToken = await refreshAccessToken(cookieHeader);

    if (!refreshedToken) {
      if (authMode === "optional") {
        return requestJson<T>(`${env.API_BASE_URL}${path}`, {
          ...options,
          headers: createRequestHeaders(options),
          cache: options?.cache ?? "no-store",
        });
      }

      throw new ApiError("Unauthorized.", 401);
    }

    accessToken = refreshedToken;

    return requestJson<T>(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: createRequestHeaders(options, accessToken),
      cache: options?.cache ?? "no-store",
    });
  }
}

function createRequestHeaders(
  options: ServerApiFetchOptions | undefined,
  accessToken?: string,
) {
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type") && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function refreshAccessToken(cookieHeader: string) {
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await requestJson<AuthResponse>(
      `${env.API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
        message: "Unable to refresh access token.",
      },
    );

    return response.accessToken;
  } catch {
    return null;
  }
}

function shouldAttemptTokenRefresh(
  error: unknown,
  authMode: ServerApiFetchOptions["authenticated"],
) {
  if (!authMode || !(error instanceof ApiError)) {
    return false;
  }

  return error.status === 401 || error.status === 403 || error.status >= 500;
}
