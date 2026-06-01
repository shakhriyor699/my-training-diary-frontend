import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/src/shared/config/cookies";
import { routing } from "@/src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const AUTH_PAGES = new Set(["/login", "/register"]);
const PRIVILEGED_ROLES = new Set(["admin", "moderator"]);
const PRIVILEGED_ROUTES = ["/dashboard/users", "/dashboard/moderation"];
const USER_ONLY_EXACT_ROUTES = ["/dashboard/my-coach"];
const USER_ONLY_PREFIX_ROUTES = ["/dashboard/nutrition"];
export default async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);
  const normalizedPathname = getNormalizedPathname(pathname, locale);
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  let refreshedSession: RefreshedSession | null = null;

  if (!accessToken && refreshToken && shouldAttemptSessionRefresh(normalizedPathname)) {
    refreshedSession = await refreshSession(request);

    if (refreshedSession) {
      accessToken = refreshedSession.accessToken;
      applySetCookies(intlResponse, refreshedSession.setCookies);
    }
  }

  if (AUTH_PAGES.has(normalizedPathname)) {
    const authenticatedSession = await ensureAuthenticatedSession({
      request,
      accessToken,
      refreshToken,
      refreshedSession,
      response: intlResponse,
    });

    if (authenticatedSession.accessToken && authenticatedSession.role) {
      return createRedirectResponse(
        request,
        `/${locale}/dashboard`,
        authenticatedSession.refreshedSession?.setCookies,
      );
    }

    if (accessToken && !authenticatedSession.accessToken) {
      clearSessionCookies(intlResponse);
    }

    return intlResponse;
  }

  if (normalizedPathname.startsWith("/dashboard") && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (normalizedPathname.startsWith("/dashboard") && accessToken) {
    const authenticatedSession = await ensureAuthenticatedSession({
      request,
      accessToken,
      refreshToken,
      refreshedSession,
      response: intlResponse,
    });

    if (!authenticatedSession.accessToken || !authenticatedSession.role) {
      const response = createRedirectResponse(
        request,
        `/${locale}/login`,
        authenticatedSession.refreshedSession?.setCookies,
      );
      clearSessionCookies(response);
      return response;
    }

    accessToken = authenticatedSession.accessToken;
    refreshedSession = authenticatedSession.refreshedSession;

    if (
      isPrivilegedRoute(normalizedPathname) &&
      !PRIVILEGED_ROLES.has(authenticatedSession.role)
    ) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    if (
      isUserOnlyRoute(normalizedPathname) &&
      authenticatedSession.role !== "user" &&
      authenticatedSession.role !== "admin"
    ) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

function getLocaleFromPathname(pathname: string) {
  const [, maybeLocale] = pathname.split("/");

  return routing.locales.includes(maybeLocale as (typeof routing.locales)[number])
    ? maybeLocale
    : routing.defaultLocale;
}

function getNormalizedPathname(pathname: string, locale: string) {
  if (pathname === `/${locale}`) {
    return "/";
  }

  return pathname.startsWith(`/${locale}/`)
    ? pathname.slice(locale.length + 1)
    : pathname;
}

function isPrivilegedRoute(pathname: string) {
  return PRIVILEGED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isUserOnlyRoute(pathname: string) {
  return (
    USER_ONLY_EXACT_ROUTES.includes(pathname) ||
    USER_ONLY_PREFIX_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  );
}

function shouldAttemptSessionRefresh(pathname: string) {
  return pathname.startsWith("/dashboard") || AUTH_PAGES.has(pathname);
}

async function getUserRole(accessToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001"}/users/me`,
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      role?: string;
    };

    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

type RefreshedSession = {
  accessToken: string;
  setCookies: string[];
};

type AuthenticatedSession = {
  accessToken: string | null;
  role: string | null;
  refreshedSession: RefreshedSession | null;
};

async function refreshSession(request: NextRequest): Promise<RefreshedSession | null> {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    return null;
  }

  try {
    const response = await fetch(new URL("/api/auth/refresh", request.url), {
      method: "POST",
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | { accessToken?: string }
      | null;

    if (!payload?.accessToken) {
      return null;
    }

    return {
      accessToken: payload.accessToken,
      setCookies:
        typeof response.headers.getSetCookie === "function"
          ? response.headers.getSetCookie()
          : [],
    };
  } catch {
    return null;
  }
}

function applySetCookies(response: NextResponse, setCookies: string[]) {
  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }
}

function createRedirectResponse(
  request: NextRequest,
  pathname: string,
  setCookies?: string[],
) {
  const response = NextResponse.redirect(new URL(pathname, request.url));

  if (setCookies?.length) {
    applySetCookies(response, setCookies);
  }

  return response;
}

async function ensureAuthenticatedSession({
  request,
  accessToken,
  refreshToken,
  refreshedSession,
  response,
}: {
  request: NextRequest;
  accessToken?: string;
  refreshToken?: string;
  refreshedSession: RefreshedSession | null;
  response: NextResponse;
}): Promise<AuthenticatedSession> {
  if (!accessToken) {
    return {
      accessToken: null,
      role: null,
      refreshedSession,
    };
  }

  let role = await getUserRole(accessToken);

  if (role) {
    return {
      accessToken,
      role,
      refreshedSession,
    };
  }

  if (!refreshToken || refreshedSession) {
    return {
      accessToken: null,
      role: null,
      refreshedSession,
    };
  }

  const nextRefreshedSession = await refreshSession(request);

  if (!nextRefreshedSession) {
    return {
      accessToken: null,
      role: null,
      refreshedSession: null,
    };
  }

  applySetCookies(response, nextRefreshedSession.setCookies);
  role = await getUserRole(nextRefreshedSession.accessToken);

  return {
    accessToken: role ? nextRefreshedSession.accessToken : null,
    role,
    refreshedSession: nextRefreshedSession,
  };
}

function clearSessionCookies(response: NextResponse) {
  const expiredAt = new Date(0);

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiredAt,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiredAt,
  });
}
