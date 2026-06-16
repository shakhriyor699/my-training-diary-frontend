import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPendingUsersSafe } from "@/src/features/admin/api/get-pending-users";
import { getUserRolesSafe } from "@/src/features/admin/api/get-user-roles";
import { getUsersListSafe } from "@/src/features/admin/api/get-users-list";
import { PendingUsersPanel } from "@/src/features/admin/components/pending-users-panel";
import { UsersFilters } from "@/src/features/admin/components/users-filters";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { UsersStatsStrip } from "@/src/features/admin/components/users-stats-strip";
import { UsersTable } from "@/src/features/admin/components/users-table";
import { parseUsersListQuery } from "@/src/features/admin/lib/admin-users.query";
import { normalizeUserProfile } from "@/src/features/admin/lib/admin-users.utils";
import { getCurrentUserSafe } from "@/src/features/auth/api/get-current-user";

type UsersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UsersPage({
  params,
  searchParams,
}: UsersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = parseUsersListQuery(await searchParams);

  const [t, result, pendingUsersResult, currentUser, roleOptions] = await Promise.all([
    getTranslations("AdminUsers"),
    getUsersListSafe(query),
    getPendingUsersSafe(),
    getCurrentUserSafe(),
    getUserRolesSafe(),
  ]);
  const canCreate = currentUser?.role === "admin";
  const pendingIds = new Set(pendingUsersResult.users.map((user) => user.id));
  const normalizedResponse = {
    ...result.response,
    data: result.response.data.map((user) => normalizeUserProfile(user, pendingIds)),
  };
  const normalizedPendingUsers = pendingUsersResult.users.map((user) =>
    normalizeUserProfile(user, pendingIds),
  );

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description")}
        />
        {result.hasError || pendingUsersResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message:
                result.errorMessage ??
                pendingUsersResult.errorMessage ??
                t("errorFallback"),
            })}
          </section>
        ) : null}
        <UsersFilters
          locale={locale}
          query={query}
          labels={{
            title: t("filters.title"),
            description: t("filters.description"),
            role: t("filters.role"),
            search: t("filters.search"),
            searchPlaceholder: t("filters.searchPlaceholder"),
            allRoles: t("filters.allRoles"),
            apply: t("filters.apply"),
            reset: t("filters.reset"),
            roles: {
              user: t("filters.roles.user"),
              admin: t("filters.roles.admin"),
              moderator: t("filters.roles.moderator"),
            },
          }}
        />
        <UsersStatsStrip
          response={normalizedResponse}
          labels={{
            total: t("stats.total"),
            pending: t("stats.pending"),
            approved: t("stats.approved"),
            rejected: t("stats.rejected"),
          }}
        />
        <PendingUsersPanel
          users={normalizedPendingUsers}
          labels={{
            title: t("pending.title"),
            description: t("pending.description"),
            empty: t("pending.empty"),
            submittedAt: t("pending.submittedAt"),
            status: t("pending.status"),
            pending: t("pending.statuses.pending"),
            approve: t("pending.actions.approve"),
            approving: t("pending.actions.approving"),
            reject: t("pending.actions.reject"),
            rejectTitle: t("pending.actions.rejectTitle"),
            rejectDescription: t("pending.actions.rejectDescription"),
            rejectReason: t("pending.actions.rejectReason"),
            rejectReasonPlaceholder: t("pending.actions.rejectReasonPlaceholder"),
            submitReject: t("pending.actions.submitReject"),
            rejecting: t("pending.actions.rejecting"),
            cancel: t("pending.actions.cancel"),
            approveSuccess: t("pending.actions.approveSuccess"),
            rejectSuccess: t("pending.actions.rejectSuccess"),
            errorFallback: t("pending.actions.errorFallback"),
          }}
        />
        <UsersTable
          locale={locale}
          response={normalizedResponse}
          query={query}
          canCreate={canCreate}
          roleOptions={roleOptions}
          labels={{
            title: t("table.title"),
            description: t("table.description"),
            id: t("table.id"),
            email: t("table.email"),
            role: t("table.role"),
            gymCoinBalance: t("table.gymCoinBalance"),
            status: t("table.status"),
            createdAt: t("table.createdAt"),
            actions: t("table.actions"),
            rejectionReason: t("table.rejectionReason"),
            noReason: t("table.noReason"),
            empty: t("table.empty"),
            previous: t("table.previous"),
            next: t("table.next"),
            page: t("table.page"),
            create: {
              trigger: t("table.create.trigger"),
              title: t("table.create.title"),
              description: t("table.create.description"),
              name: t("table.create.name"),
              namePlaceholder: t("table.create.namePlaceholder"),
              email: t("table.create.email"),
              emailPlaceholder: t("table.create.emailPlaceholder"),
              password: t("table.create.password"),
              passwordPlaceholder: t("table.create.passwordPlaceholder"),
              role: t("table.create.role"),
              submit: t("table.create.submit"),
              submitting: t("table.create.submitting"),
              cancel: t("table.create.cancel"),
              fallbackRole: t("table.create.fallbackRole"),
              errorFallback: t("table.create.errorFallback"),
              success: t("table.create.success"),
            },
            edit: {
              trigger: t("table.edit.trigger"),
              title: t("table.edit.title"),
              description: t("table.edit.description"),
              email: t("table.edit.email"),
              emailPlaceholder: t("table.edit.emailPlaceholder"),
              password: t("table.edit.password"),
              passwordPlaceholder: t("table.edit.passwordPlaceholder"),
              role: t("table.edit.role"),
              submit: t("table.edit.submit"),
              submitting: t("table.edit.submitting"),
              cancel: t("table.edit.cancel"),
              errorFallback: t("table.edit.errorFallback"),
              success: t("table.edit.success"),
            },
            approval: {
              approve: t("table.approval.approve"),
              approving: t("table.approval.approving"),
              reject: t("table.approval.reject"),
              rejectTitle: t("table.approval.rejectTitle"),
              rejectDescription: t("table.approval.rejectDescription"),
              rejectReason: t("table.approval.rejectReason"),
              rejectReasonPlaceholder: t("table.approval.rejectReasonPlaceholder"),
              submitReject: t("table.approval.submitReject"),
              rejecting: t("table.approval.rejecting"),
              cancel: t("table.approval.cancel"),
              approveSuccess: t("table.approval.approveSuccess"),
              rejectSuccess: t("table.approval.rejectSuccess"),
              errorFallback: t("table.approval.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}
