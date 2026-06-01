import type { AdminCreateUserInput } from "@/src/features/admin/lib/admin-create-user.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type CreatedUser = {
  id: number;
  email: string;
  role: string;
};

export function createUser(payload: AdminCreateUserInput) {
  return clientApiFetch<CreatedUser>("/api/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to create user.",
  });
}
