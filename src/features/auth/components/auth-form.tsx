"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  submitLoginRequest,
  submitRegisterRequest,
} from "@/src/features/auth/api/auth-client";
import type {
  LoginBlockedResponse,
  RegisterAuthResponse,
} from "@/src/features/auth/lib/auth-response";
import {
  type AuthMode,
  loginCredentialsSchema,
  registerCredentialsSchema,
} from "@/src/features/auth/lib/auth.schema";
import { ApiError } from "@/src/shared/api/base";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";

type AuthFormProps = {
  mode: AuthMode;
  locale: string;
  title: string;
  description: string;
  submitLabel: string;
  alternateLabel: string;
  alternateText: string;
  alternateHref: string;
};

type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

export function AuthForm({
  mode,
  locale,
  title,
  description,
  submitLabel,
  alternateLabel,
  alternateText,
  alternateHref,
}: AuthFormProps) {
  const t = useTranslations("Auth.form");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [registerState, setRegisterState] = useState<RegisterAuthResponse | null>(null);
  const [blockedLoginState, setBlockedLoginState] = useState<LoginBlockedResponse | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const authMutation = useMutation({
    mutationFn: async (payload: AuthFormValues) => {
      if (mode === "register") {
        return submitRegisterRequest({
          name: payload.name,
          email: payload.email,
          password: payload.password,
        });
      }

      return submitLoginRequest({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: (response) => {
      if (mode === "register") {
        setRegisterState(response as RegisterAuthResponse);
        return;
      }

      window.location.assign(`/${locale}/dashboard`);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.payload && typeof error.payload === "object") {
        const payload = error.payload as Partial<LoginBlockedResponse>;

        if (
          error.status === 403 &&
          typeof payload.approvalStatus === "string" &&
          (payload.approvalStatus === "pending" || payload.approvalStatus === "rejected")
        ) {
          setBlockedLoginState({
            message:
              typeof payload.message === "string"
                ? payload.message
                : t("approvalPendingTitle"),
            approvalStatus: payload.approvalStatus,
            rejectionReason:
              typeof payload.rejectionReason === "string"
                ? payload.rejectionReason
                : null,
          });
          return;
        }
      }

      setFormError(
        error instanceof Error ? error.message : t("unexpectedError"),
      );
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setBlockedLoginState(null);
    setRegisterState(null);

    if (mode === "register") {
      const parsed = registerCredentialsSchema.safeParse({
        name: values.name ?? "",
        email: values.email,
        password: values.password,
      });

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;

        if (fieldErrors.name?.[0]) {
          setError("name", { message: fieldErrors.name[0] });
        }

        if (fieldErrors.email?.[0]) {
          setError("email", { message: fieldErrors.email[0] });
        }

        if (fieldErrors.password?.[0]) {
          setError("password", { message: fieldErrors.password[0] });
        }

        return;
      }

      await authMutation.mutateAsync({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      return;
    }

    const parsed = loginCredentialsSchema.safeParse({
      email: values.email,
      password: values.password,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.email?.[0]) {
        setError("email", { message: fieldErrors.email[0] });
      }

      if (fieldErrors.password?.[0]) {
        setError("password", { message: fieldErrors.password[0] });
      }

      return;
    }

    await authMutation.mutateAsync({
      name: "",
      email: parsed.data.email,
      password: parsed.data.password,
    });
  });

  return (
    <Card className="mx-auto w-full max-w-[540px] border-white/8 bg-[linear-gradient(180deg,rgba(8,8,8,0.98),rgba(5,5,5,0.98))] px-6 py-7 text-white shadow-[0_30px_120px_rgba(0,0,0,0.42)] sm:px-8">
      {registerState ? (
        <ApprovalStateCard
          eyebrow={t("approvalEyebrow")}
          title={t("approvalPendingTitle")}
          description={t("approvalPendingDescription")}
          detail={registerState.message}
          accentLabel={t("approvalPendingBadge")}
          actionHref={`/${locale}/login`}
          actionLabel={t("approvalPrimaryAction")}
          secondaryHref={`/${locale}`}
          secondaryLabel={t("approvalSecondaryAction")}
        />
      ) : blockedLoginState ? (
        <ApprovalStateCard
          eyebrow={t("approvalEyebrow")}
          title={
            blockedLoginState.approvalStatus === "rejected"
              ? t("approvalRejectedTitle")
              : t("approvalPendingTitle")
          }
          description={
            blockedLoginState.approvalStatus === "rejected"
              ? t("approvalRejectedDescription")
              : t("approvalPendingDescription")
          }
          detail={blockedLoginState.message}
          reason={
            blockedLoginState.approvalStatus === "rejected"
              ? blockedLoginState.rejectionReason ?? null
              : null
          }
          reasonLabel={t("approvalRejectedReason")}
          accentLabel={
            blockedLoginState.approvalStatus === "rejected"
              ? t("approvalRejectedBadge")
              : t("approvalPendingBadge")
          }
          actionHref={`/${locale}/register`}
          actionLabel={
            blockedLoginState.approvalStatus === "rejected"
              ? t("approvalRejectedAction")
              : t("approvalSecondaryAction")
          }
          secondaryHref={`/${locale}`}
          secondaryLabel={t("approvalPrimaryAction")}
          destructive={blockedLoginState.approvalStatus === "rejected"}
        />
      ) : (
      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d8f76d,#a3e635_45%,#16a34a)] text-base font-semibold text-black">
              TD
            </span>
            <span className="text-[28px] font-semibold tracking-tight">
              Training Diary
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/48">
              {mode === "register" ? t("registerEyebrow") : t("loginEyebrow")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm leading-6 text-white/52 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <form
          className="space-y-5 rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_36%),#050505] p-5 sm:p-6"
          onSubmit={onSubmit}
        >
          <div className="space-y-1">
            <h2 className="text-[28px] font-semibold tracking-tight text-white">
              {mode === "register" ? t("createAccount") : t("welcomeBack")}
            </h2>
            <p className="text-sm text-white/42">
              {mode === "register"
                ? t("registerFormDescription")
                : t("loginFormDescription")}
            </p>
          </div>

          {mode === "register" ? (
            <div className="space-y-2">
              <Label htmlFor={`${mode}-name`}>{t("nameLabel")}</Label>
              <Input
                id={`${mode}-name`}
                type="text"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                {...register("name")}
              />
              {errors.name?.message ? (
                <p className="text-sm text-[#ff7b72]">{errors.name.message}</p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor={`${mode}-email`}>{t("emailLabel")}</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
            />
            {errors.email?.message ? (
              <p className="text-sm text-[#ff7b72]">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>{t("passwordLabel")}</Label>
            <div className="relative">
              <Input
                id={`${mode}-password`}
                type={isPasswordVisible ? "text" : "password"}
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                placeholder={t("passwordPlaceholder")}
                className="pr-12"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={
                  isPasswordVisible ? t("hidePassword") : t("showPassword")
                }
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((value) => !value)}
                className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-white/36 transition-colors hover:text-white/68"
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password?.message ? (
              <p className="text-sm text-[#ff7b72]">{errors.password.message}</p>
            ) : null}
          </div>

          {formError ? (
            <div className="rounded-2xl border border-[#ff7b72]/18 bg-[#ff7b72]/8 px-4 py-3 text-sm text-[#ff7b72]">
              {formError}
            </div>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full bg-[#1cc31c] text-black hover:bg-[#28d928]"
            disabled={authMutation.isPending}
          >
            {authMutation.isPending ? t("submitting") : submitLabel}
          </Button>

          <div className="border-t border-white/8 pt-5 text-center text-sm text-white/42">
            <span>{alternateText} </span>
            <Link
              href={alternateHref}
              className="font-semibold text-[#1cc31c] transition-opacity hover:opacity-80"
            >
              {alternateLabel}
            </Link>
          </div>
        </form>
      </div>
      )}
    </Card>
  );
}

type ApprovalStateCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  accentLabel: string;
  actionHref: string;
  actionLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  destructive?: boolean;
  reason?: string | null;
  reasonLabel?: string;
};

function ApprovalStateCard({
  eyebrow,
  title,
  description,
  detail,
  accentLabel,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
  destructive = false,
  reason,
  reasonLabel,
}: ApprovalStateCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_34%),#050505] p-6 sm:p-8">
      <div
        className={[
          "pointer-events-none absolute inset-x-10 top-0 h-28 rounded-full blur-3xl",
          destructive ? "bg-[#ff6b5d]/16" : "bg-[#1cc31c]/16",
        ].join(" ")}
      />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-white/42">{eyebrow}</p>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-white/60 sm:text-base">
              {description}
            </p>
          </div>
          <span
            className={[
              "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold shadow-[0_0_26px_rgba(0,0,0,0.16)]",
              destructive
                ? "border-[#ff6b5d]/20 bg-[#ff6b5d]/12 text-[#ffb4ad]"
                : "border-[#1cc31c]/20 bg-[#1cc31c]/12 text-[#7ee787]",
            ].join(" ")}
          >
            {accentLabel}
          </span>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-sm text-white/42">Status</p>
            <p className="mt-3 text-lg font-medium leading-7 text-white/88">{detail}</p>
          </div>

          {reason ? (
            <div className="rounded-[28px] border border-[#ff6b5d]/14 bg-[#ff6b5d]/8 p-5">
              <p className="text-sm text-[#ffb4ad]/72">{reasonLabel}</p>
              <p className="mt-3 text-sm leading-7 text-white/84">{reason}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={actionHref}
            className={[
              "inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold transition-all duration-200",
              destructive
                ? "bg-[#ff6b5d] text-white hover:-translate-y-0.5 hover:bg-[#ff7d70]"
                : "bg-[#1cc31c] text-black hover:-translate-y-0.5 hover:bg-[#28d928]",
            ].join(" ")}
          >
            {actionLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white/82 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
      />
      <circle cx="12" cy="12" r="3.25" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.58 10.58A2 2 0 0 0 10 12a2 2 0 0 0 3.42 1.42"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 5.1A10.94 10.94 0 0 1 12 4.88c6 0 9.75 7.12 9.75 7.12a20.46 20.46 0 0 1-4.09 4.93"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.61 6.61A20.65 20.65 0 0 0 2.25 12s3.75 6.75 9.75 6.75a10.7 10.7 0 0 0 5.39-1.44"
      />
    </svg>
  );
}
