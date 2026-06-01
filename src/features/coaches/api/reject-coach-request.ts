import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { CoachRequestStatusUpdateResponse } from "../lib/coach-requests.types";

export function rejectCoachRequest(requestId: number) {
  return clientApiFetch<CoachRequestStatusUpdateResponse>(
    `/api/coaches/requests/${requestId}/reject`,
    {
      method: "PATCH",
      message: "Unable to reject coach request.",
    },
  );
}
