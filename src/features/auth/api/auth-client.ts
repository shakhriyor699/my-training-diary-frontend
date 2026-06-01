import type {
  LoginCredentials,
  RegisterCredentials,
} from "@/src/features/auth/lib/auth.schema";
import type {
  AuthResponse,
  RegisterAuthResponse,
} from "@/src/features/auth/lib/auth-response";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function submitLoginRequest(payload: LoginCredentials) {
  return clientApiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Authentication request failed.",
    redirectOnAuthError: false,
  });
}

export function submitRegisterRequest(payload: RegisterCredentials) {
  return clientApiFetch<RegisterAuthResponse>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Registration request failed.",
    redirectOnAuthError: false,
  });
}
