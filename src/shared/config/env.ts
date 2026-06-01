const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001";

export const env = {
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
