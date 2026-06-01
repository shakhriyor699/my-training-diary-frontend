import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyUserStats } from "@/src/features/dashboard/lib/dashboard.fallbacks";
import type { UserStats } from "@/src/features/dashboard/lib/dashboard.types";

export type CoachStudentStatsResult = {
  stats: UserStats;
  hasError: boolean;
  errorMessage: string | null;
};

export function getCoachStudentStats(studentId: number) {
  return serverApiFetch<UserStats>(`/coaches/students/${studentId}/stats`, {
    authenticated: true,
  });
}

export async function getCoachStudentStatsSafe(
  studentId: number,
): Promise<CoachStudentStatsResult> {
  try {
    const stats = await getCoachStudentStats(studentId);

    return {
      stats,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      stats: createEmptyUserStats(),
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load student stats.",
    };
  }
}
