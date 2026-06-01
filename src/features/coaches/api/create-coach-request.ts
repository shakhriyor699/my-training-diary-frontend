import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { CreateCoachRequestInput } from "../lib/create-coach-request.schema";

type CoachRequestResponse = {
  id: number;
  studentId: number;
  coachId: number;
  status: "pending" | string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export function createCoachRequest(
  coachId: number,
  payload: CreateCoachRequestInput,
) {
  return clientApiFetch<CoachRequestResponse>(`/api/coaches/${coachId}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to send coach request.",
  });
}
