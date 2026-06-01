import { NextResponse } from "next/server";

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { NotificationReadResponse } from "@/src/features/notifications/lib/notifications.types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsedId = Number.parseInt(id, 10);

  if (!Number.isFinite(parsedId) || parsedId < 1) {
    return NextResponse.json({ message: "Notification id is invalid." }, { status: 400 });
  }

  try {
    const response = await serverApiFetch<NotificationReadResponse>(
      `/notifications/${parsedId}/read`,
      {
        method: "PATCH",
        authenticated: true,
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to mark notification as read.";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
