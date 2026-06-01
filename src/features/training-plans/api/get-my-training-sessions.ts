import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  MyTrainingSessionsQuery,
  MyTrainingSessionsResponse,
  MyTrainingSessionsResult,
} from "../lib/training-plans.types";
import { normalizeTrainingSessions } from "../lib/training-session.utils";

type RawMyTrainingSessionsResponse = {
  data: unknown[];
  meta: MyTrainingSessionsResponse["meta"];
};

export async function getMyTrainingSessions(query: MyTrainingSessionsQuery) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.date) {
    searchParams.set("date", query.date);
  }

  const response = await serverApiFetch<RawMyTrainingSessionsResponse>(
    `/training-plans/sessions/my?${searchParams.toString()}`,
    {
      authenticated: true,
    },
  );

  return {
    ...response,
    data: normalizeTrainingSessions(
      response.data as Parameters<typeof normalizeTrainingSessions>[0],
    ),
  } satisfies MyTrainingSessionsResponse;
}

export async function getMyTrainingSessionsSafe(
  query: MyTrainingSessionsQuery,
): Promise<MyTrainingSessionsResult> {
  try {
    const response = await getMyTrainingSessions(query);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: {
        data: [],
        meta: {
          total: 0,
          page: query.page,
          limit: query.limit,
          totalPages: 1,
        },
      },
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load your training sessions.",
    };
  }
}
