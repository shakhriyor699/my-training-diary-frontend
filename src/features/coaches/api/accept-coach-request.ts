import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { CoachRequestStatusUpdateResponse } from "../lib/coach-requests.types";

export function acceptCoachRequest(requestId: number) {
  return clientApiFetch<CoachRequestStatusUpdateResponse>(
    `/api/coaches/requests/${requestId}/accept`,
    {
      method: "PATCH",
      message: "Unable to accept coach request.",
    },
  );
}
