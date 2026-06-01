import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { UpdateUserInput } from "../lib/update-user.schema";

type UpdatedUser = {
  id: number;
  email: string;
  role: string;
};

export function updateUser(id: number, payload: UpdateUserInput) {
  return clientApiFetch<UpdatedUser>(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to update user.",
  });
}
