import { z } from "zod";

export const adminCreateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.string().min(1, "Role is required."),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
