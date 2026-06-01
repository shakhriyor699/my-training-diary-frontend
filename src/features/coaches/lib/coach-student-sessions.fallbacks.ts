import type {
  CoachStudentSessionsQuery,
  CoachStudentSessionsResponse,
} from "./coach-student-sessions.types";

export function createEmptyCoachStudentSessionsResponse(
  query: CoachStudentSessionsQuery,
): CoachStudentSessionsResponse {
  return {
    data: [],
    meta: {
      total: 0,
      page: query.page,
      limit: query.limit,
      totalPages: 1,
    },
  };
}
