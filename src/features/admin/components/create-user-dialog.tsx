"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createUser } from "@/src/features/admin/api/create-user";
import {
  adminCreateUserSchema,
  type AdminCreateUserInput,
} from "@/src/features/admin/lib/admin-create-user.schema";
import type { RoleOption } from "@/src/features/admin/lib/admin-roles.types";

type CreateUserDialogProps = {
  roleOptions: RoleOption[];
  labels: {
    trigger: string;
    title: string;
    description: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    role: string;
    submit: string;
    submitting: string;
    cancel: string;
    fallbackRole: string;
    errorFallback: string;
    success: string;
  };
};

export function CreateUserDialog({
  roleOptions,
  labels,
}: CreateUserDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminCreateUserInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: roleOptions[0]?.value ?? "user",
    },
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset();
        toast.success(labels.success);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      setFormError(message);
      toast.error(message);
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = adminCreateUserSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.email?.[0]) {
        setError("email", { message: fieldErrors.email[0] });
      }

      if (fieldErrors.name?.[0]) {
        setError("name", { message: fieldErrors.name[0] });
      }

      if (fieldErrors.password?.[0]) {
        setError("password", { message: fieldErrors.password[0] });
      }

      if (fieldErrors.role?.[0]) {
        setError("role", { message: fieldErrors.role[0] });
      }

      return;
    }

    await mutation.mutateAsync(parsed.data);
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-[24px] border border-white/8 bg-[#090909] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.42)]">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {labels.title}
              </h2>
              <p className="text-sm text-white/48">{labels.description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <Field label={labels.name} htmlFor="create-user-name">
                <input
                  id="create-user-name"
                  type="text"
                  placeholder={labels.namePlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.name.message}</p>
                ) : null}
              </Field>

              <Field label={labels.email} htmlFor="create-user-email">
                <input
                  id="create-user-email"
                  type="email"
                  placeholder={labels.emailPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("email")}
                />
                {errors.email?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.email.message}</p>
                ) : null}
              </Field>

              <Field label={labels.password} htmlFor="create-user-password">
                <input
                  id="create-user-password"
                  type="password"
                  placeholder={labels.passwordPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.password.message}</p>
                ) : null}
              </Field>

              <Field label={labels.role} htmlFor="create-user-role">
                <select
                  id="create-user-role"
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("role")}
                >
                  {roleOptions.length > 0 ? (
                    roleOptions.map((roleOption) => (
                      <option
                        key={roleOption.value}
                        value={roleOption.value}
                        className="bg-[#090909] text-white"
                      >
                        {roleOption.label}
                      </option>
                    ))
                  ) : (
                    <option value="user" className="bg-[#090909] text-white">
                      {labels.fallbackRole}
                    </option>
                  )}
                </select>
                {errors.role?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.role.message}</p>
                ) : null}
              </Field>

              {formError ? (
                <div className="rounded-2xl border border-[#ff7b72]/18 bg-[#ff7b72]/8 px-4 py-3 text-sm text-[#ff7b72]">
                  {formError}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending || isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60"
                >
                  {mutation.isPending || isPending
                    ? labels.submitting
                    : labels.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className="space-y-2">
      <span className="block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}
