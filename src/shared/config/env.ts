// const DEFAULT_API_BASE_URL = "https://api.training-diary.uz";
const DEFAULT_API_BASE_URL = "http://localhost:3001";

function normalizeApiBaseUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  try {
    const url = new URL(trimmedValue);

    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmedValue.replace(/\/$/, "") || DEFAULT_API_BASE_URL;
  }
}

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const env = {
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
