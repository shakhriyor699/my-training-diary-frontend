import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  AdminUserTrainingOverviewQuery,
  AdminUserTrainingOverviewResult,
} from "../lib/admin-user-training-overview.types";
import { normalizeAdminUserTrainingOverview } from "../lib/admin-user-training-overview.utils";

export async function getUserTrainingOverview(
  userId: number,
  query: AdminUserTrainingOverviewQuery,
) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.date) {
    searchParams.set("date", query.date);
  }

  const response = await serverApiFetch<unknown>(
    `/users/${userId}/training-overview?${searchParams.toString()}`,
    {
      authenticated: true,
    },
  );

  return normalizeAdminUserTrainingOverview(response, query.page, query.limit);
}

export async function getUserTrainingOverviewSafe(
  userId: number,
  query: AdminUserTrainingOverviewQuery,
): Promise<AdminUserTrainingOverviewResult> {
  try {
    return {
      overview: await getUserTrainingOverview(userId, query),
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      overview: normalizeAdminUserTrainingOverview(null, query.page, query.limit),
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load the user training overview.",
    };
  }
}
