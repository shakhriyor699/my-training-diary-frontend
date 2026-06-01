import { NextResponse } from "next/server";

import { normalizeTrainingSession } from "@/src/features/training-plans/lib/training-session.utils";
import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

type RawMyTrainingSessionsResponse = {
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
  const date = searchParams.get("date");

  upstreamSearchParams.set("page", page);
  upstreamSearchParams.set("limit", limit);

  if (date) {
    upstreamSearchParams.set("date", date);
  }

  try {
    const response = await serverApiFetch<RawMyTrainingSessionsResponse>(
      `/training-plans/sessions/my?${upstreamSearchParams.toString()}`,
      {
        authenticated: true,
      },
    );

    const detailedSessions = await Promise.all(
      response.data.map(async (session) => {
        const normalizedSession = normalizeTrainingSession(
          session as Parameters<typeof normalizeTrainingSession>[0],
        );

        if (!normalizedSession.id) {
          return normalizedSession;
        }

        try {
          const detailedSession = await serverApiFetch<unknown>(
            `/training-plans/sessions/${normalizedSession.id}`,
            {
              authenticated: true,
            },
          );

          return normalizeTrainingSession(
            detailedSession as Parameters<typeof normalizeTrainingSession>[0],
          );
        } catch {
          return normalizedSession;
        }
      }),
    );

    return NextResponse.json({
      ...response,
      data: detailedSessions,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load your training sessions.";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
