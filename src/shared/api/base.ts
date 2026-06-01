export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestJsonOptions = RequestInit & {
  message?: string;
};

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestJsonOptions,
) {
  const response = await fetch(input, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message) ||
      init?.message ||
      "Request failed.";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
