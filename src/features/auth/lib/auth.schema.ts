import { z } from "zod";

const authBaseSchema = z.object({
  email: z.email("Введите корректный email."),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов.")
    .max(100, "Пароль слишком длинный."),
});

export const loginCredentialsSchema = authBaseSchema;

export const registerCredentialsSchema = authBaseSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа.")
    .max(100, "Имя слишком длинное."),
});

export const authCredentialsSchema = registerCredentialsSchema;

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
export type AuthCredentials = LoginCredentials | RegisterCredentials;
export type AuthMode = "register" | "login";
