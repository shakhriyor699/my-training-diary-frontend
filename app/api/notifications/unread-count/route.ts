import { NextResponse } from "next/server";

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

type NotificationsUnreadCountResponse = {
  count: number;
};

export async function GET() {
  try {
    const response = await serverApiFetch<NotificationsUnreadCountResponse>(
      "/notifications/unread-count",
      {
        authenticated: true,
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load unread notifications count.";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
