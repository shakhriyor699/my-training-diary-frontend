import { NextResponse } from "next/server";

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { NotificationsReadAllResponse } from "@/src/features/notifications/lib/notifications.types";

export async function PATCH() {
  try {
    const response = await serverApiFetch<NotificationsReadAllResponse>(
      "/notifications/read-all",
      {
        method: "PATCH",
        authenticated: true,
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to mark all notifications as read.";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
