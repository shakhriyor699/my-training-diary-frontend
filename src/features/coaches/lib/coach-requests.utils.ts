import type { CoachRequest } from "./coach-requests.types";

export function countPendingCoachRequests(requests: CoachRequest[]) {
  return requests.filter((request) => request.status === "pending").length;
}
