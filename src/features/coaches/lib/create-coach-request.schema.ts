import { z } from "zod";

export const createCoachRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be at most 1000 characters."),
});

export type CreateCoachRequestInput = z.infer<typeof createCoachRequestSchema>;
