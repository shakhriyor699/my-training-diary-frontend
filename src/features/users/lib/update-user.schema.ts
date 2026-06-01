import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || value.length >= 6,
      "Password must be at least 6 characters.",
    ),
  role: z.string().trim().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
