import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { UpdateUserApprovalInput } from "../lib/update-user-approval.schema";

type UpdatedUserApprovalResponse = {
  id: number;
  status: "approved" | "rejected";
  reason?: string | null;
};

export function updateUserApproval(
  id: number,
  payload: UpdateUserApprovalInput,
) {
  return clientApiFetch<UpdatedUserApprovalResponse>(`/api/users/${id}/approval`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to update user approval status.",
  });
}
