import { ApiError, requestJson } from "./base";

export function clientApiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { message?: string; redirectOnAuthError?: boolean },
) {
  const { redirectOnAuthError = true, ...requestInit } = init ?? {};

  return requestJson<T>(input, {
    credentials: "same-origin",
    ...requestInit,
  }).catch((error) => {
    if (
      redirectOnAuthError &&
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirectToLogin();
    }

    throw error;
  });
}

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  const [, maybeLocale] = window.location.pathname.split("/");
  const locale = maybeLocale || "en";

  window.location.replace(`/${locale}/login`);
}
