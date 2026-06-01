import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyCoachStudentSessionsResponse } from "../lib/coach-student-sessions.fallbacks";
import { toCoachStudentSessionsSearchParams } from "../lib/coach-student-sessions.query";
import type {
  CoachStudentSessionsQuery,
  CoachStudentSessionsResponse,
  CoachStudentSessionsResult,
} from "../lib/coach-student-sessions.types";

export function getCoachStudentSessions(
  studentId: number,
  query: CoachStudentSessionsQuery,
) {
  const queryString = toCoachStudentSessionsSearchParams(query);

  return serverApiFetch<CoachStudentSessionsResponse>(
    `/coaches/students/${studentId}/sessions?${queryString}`,
    {
      authenticated: true,
    },
  );
}

export async function getCoachStudentSessionsSafe(
  studentId: number,
  query: CoachStudentSessionsQuery,
): Promise<CoachStudentSessionsResult> {
  try {
    const response = await getCoachStudentSessions(studentId, query);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: createEmptyCoachStudentSessionsResponse(query),
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load student sessions.",
    };
  }
}
