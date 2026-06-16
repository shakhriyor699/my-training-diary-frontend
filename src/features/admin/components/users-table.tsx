import Link from "next/link";

import { EditUserDialog } from "@/src/features/users/components/edit-user-dialog";
import { formatDateLabel, formatRole } from "@/src/features/dashboard/lib/dashboard.utils";

import type { UsersListQuery, UsersListResponse } from "../lib/admin-users.types";
import { UsersTableHeader } from "./users-table-header";
import type { RoleOption } from "../lib/admin-roles.types";
import { UserApprovalActions } from "./user-approval-actions";

type UsersTableProps = {
  locale: string;
  response: UsersListResponse;
  query: UsersListQuery;
  canCreate: boolean;
  roleOptions: RoleOption[];
  labels: {
    title: string;
    description: string;
    id: string;
    email: string;
    role: string;
    gymCoinBalance: string;
    status: string;
    createdAt: string;
    actions: string;
    rejectionReason: string;
    noReason: string;
    empty: string;
    previous: string;
    next: string;
    page: string;
    create: {
      trigger: string;
      title: string;
      description: string;
      email: string;
      emailPlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      namePlaceholder: string;
      name: string;
      role: string;
      submit: string;
      submitting: string;
      cancel: string;
      fallbackRole: string;
      errorFallback: string;
      success: string;
    };
    edit: {
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
    approval: {
      approve: string;
      approving: string;
      reject: string;
      rejectTitle: string;
      rejectDescription: string;
      rejectReason: string;
      rejectReasonPlaceholder: string;
      submitReject: string;
      rejecting: string;
      cancel: string;
      approveSuccess: string;
      rejectSuccess: string;
      errorFallback: string;
    };
  };
};

export function UsersTable({
  locale,
  response,
  query,
  canCreate,
  roleOptions,
  labels,
}: UsersTableProps) {
  const previousPage = Math.max(query.page - 1, 1);
  const nextPage = Math.min(query.page + 1, response.meta.lastPage);

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <UsersTableHeader
        canCreate={canCreate}
        roleOptions={roleOptions}
        labels={{
          title: labels.title,
          description: labels.description,
          create: labels.create,
        }}
      />

      <div className="overflow-x-auto rounded-[18px] border border-white/8">
        <table className="min-w-full divide-y divide-white/8">
          <thead className="bg-white/[0.03]">
            <tr className="text-left text-sm text-white/45">
              <th className="px-4 py-3 font-medium">{labels.id}</th>
              <th className="px-4 py-3 font-medium">{labels.email}</th>
              <th className="px-4 py-3 font-medium">{labels.role}</th>
              <th className="px-4 py-3 font-medium">{labels.gymCoinBalance}</th>
              <th className="px-4 py-3 font-medium">{labels.status}</th>
              <th className="px-4 py-3 font-medium">{labels.createdAt}</th>
              <th className="px-4 py-3 font-medium">{labels.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-black/20">
            {response.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-white/45">
                  {labels.empty}
                </td>
              </tr>
            ) : (
              response.data.map((user) => (
                <tr key={user.id} className="text-sm text-white/86">
                  <td className="px-4 py-4">{user.id}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/${locale}/dashboard/users/${user.id}`}
                      className="font-medium text-white transition-colors hover:text-[#fa614d]"
                    >
                      {user.email}
                    </Link>
                    {user.rejectionReason ? (
                      <p className="mt-2 max-w-xs text-xs leading-5 text-[#ff9b90]">
                        {labels.rejectionReason}: {user.rejectionReason}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/72">
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full border border-[#f5b800]/18 bg-[#f5b800]/10 px-3 py-1 text-xs font-semibold text-[#fff1a6]">
                      {typeof user.gymCoinBalance === "number" ? user.gymCoinBalance : 0}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={user.approvalStatus ?? "approved"} />
                  </td>
                  <td className="px-4 py-4 text-white/58">
                    {formatDateLabel(user.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    {user.approvalStatus === "pending" ? (
                      <UserApprovalActions userId={user.id} labels={labels.approval} />
                    ) : (
                      <EditUserDialog
                        user={user}
                        roleOptions={roleOptions}
                        canEditRole={true}
                        labels={labels.edit}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {labels.page} {response.meta.page} / {response.meta.lastPage}
        </p>
        <div className="flex gap-2">
          <PaginationLink
            locale={locale}
            query={{ ...query, page: previousPage }}
            disabled={query.page <= 1}
            label={labels.previous}
          />
          <PaginationLink
            locale={locale}
            query={{ ...query, page: nextPage }}
            disabled={query.page >= response.meta.lastPage}
            label={labels.next}
          />
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "pending"
      ? "border-[#facc15]/18 bg-[#facc15]/10 text-[#fde68a]"
      : status === "rejected"
        ? "border-[#ff6b5d]/18 bg-[#ff6b5d]/10 text-[#ffb4ad]"
        : "border-[#1cc31c]/18 bg-[#1cc31c]/10 text-[#7ee787]";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        classes,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function PaginationLink({
  locale,
  query,
  disabled,
  label,
}: {
  locale: string;
  query: UsersListQuery;
  disabled: boolean;
  label: string;
}) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.role) {
    params.set("role", query.role);
  }

  if (query.search) {
    params.set("search", query.search);
  }

  const href = `/${locale}/dashboard/users?${params.toString()}`;

  if (disabled) {
    return (
      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/28">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </Link>
  );
}
