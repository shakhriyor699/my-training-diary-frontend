import type {
  MyTrainingSessionsQuery,
  MyTrainingSessionsResponse,
} from "@/src/features/training-plans/lib/training-plans.types";
import { normalizeTrainingSessions } from "@/src/features/training-plans/lib/training-session.utils";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type RawMyTrainingSessionsResponse = {
  data: unknown[];
  meta: MyTrainingSessionsResponse["meta"];
};

export async function getMyTrainingSessionsClient(
  query: MyTrainingSessionsQuery,
): Promise<MyTrainingSessionsResponse> {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.date) {
    searchParams.set("date", query.date);
  }

  const response = await clientApiFetch<RawMyTrainingSessionsResponse>(
    `/api/training-plans/sessions/my?${searchParams.toString()}`,
    {
      message: "Unable to load your training sessions.",
    },
  );

  return {
    ...response,
    data: normalizeTrainingSessions(
      response.data as Parameters<typeof normalizeTrainingSessions>[0],
    ),
  };
}
