"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import type { RoleOption } from "@/src/features/admin/lib/admin-roles.types";
import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";
import { updateUser } from "@/src/features/users/api/update-user";
import {
  updateUserSchema,
  type UpdateUserInput,
} from "@/src/features/users/lib/update-user.schema";

type EditUserDialogProps = {
  user: UserProfile;
  roleOptions: RoleOption[];
  canEditRole: boolean;
  labels: {
    trigger: string;
    title: string;
    description: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    role: string;
    submit: string;
    submitting: string;
    cancel: string;
    errorFallback: string;
    success: string;
  };
};

export function EditUserDialog({
  user,
  roleOptions,
  canEditRole,
  labels,
}: EditUserDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      email: user.email,
      password: "",
      role: user.role,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserInput) => updateUser(user.id, payload),
    onSuccess: () => {
      startTransition(() => {
        setIsOpen(false);
        setFormError(null);
        reset({
          email: user.email,
          password: "",
          role: user.role,
        });
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

    const payload: UpdateUserInput = {
      email: values.email,
      password: values.password,
      role: canEditRole ? values.role : undefined,
    };

    const parsed = updateUserSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      if (fieldErrors.email?.[0]) {
        setError("email", { message: fieldErrors.email[0] });
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
        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
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
              <Field label={labels.email} htmlFor={`edit-user-email-${user.id}`}>
                <input
                  id={`edit-user-email-${user.id}`}
                  type="email"
                  placeholder={labels.emailPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("email")}
                />
                {errors.email?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.email.message}</p>
                ) : null}
              </Field>

              <Field
                label={labels.password}
                htmlFor={`edit-user-password-${user.id}`}
              >
                <input
                  id={`edit-user-password-${user.id}`}
                  type="password"
                  placeholder={labels.passwordPlaceholder}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className="text-sm text-[#ff7b72]">{errors.password.message}</p>
                ) : null}
              </Field>

              {canEditRole ? (
                <Field label={labels.role} htmlFor={`edit-user-role-${user.id}`}>
                  <select
                    id={`edit-user-role-${user.id}`}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                    {...register("role")}
                  >
                    {roleOptions.map((roleOption) => (
                      <option
                        key={roleOption.value}
                        value={roleOption.value}
                        className="bg-[#090909] text-white"
                      >
                        {roleOption.label}
                      </option>
                    ))}
                  </select>
                  {errors.role?.message ? (
                    <p className="text-sm text-[#ff7b72]">{errors.role.message}</p>
                  ) : null}
                </Field>
              ) : null}

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
