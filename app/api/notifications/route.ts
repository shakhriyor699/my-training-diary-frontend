import { NextResponse } from "next/server";

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

type NotificationsResponse = {
  data: unknown[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const upstreamSearchParams = new URLSearchParams();

  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";
  const isRead = searchParams.get("isRead");

  upstreamSearchParams.set("page", page);
  upstreamSearchParams.set("limit", limit);

  if (isRead === "true" || isRead === "false") {
    upstreamSearchParams.set("isRead", isRead);
  }

  try {
    const response = await serverApiFetch<NotificationsResponse>(
      `/notifications?${upstreamSearchParams.toString()}`,
      {
        authenticated: true,
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load notifications.";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
