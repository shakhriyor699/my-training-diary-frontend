import { getTranslations, setRequestLocale } from "next-intl/server";

import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getPendingTrainingPlansSafe } from "@/src/features/training-plans/api/get-pending-training-plans";
import { ModerationPlansTable } from "@/src/features/training-plans/components/moderation-plans-table";
import { ModerationStatsStrip } from "@/src/features/training-plans/components/moderation-stats-strip";

type ModerationPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ModerationPage({
  params,
}: ModerationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, result] = await Promise.all([
    getTranslations("ModerationPlans"),
    getPendingTrainingPlansSafe(),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description")}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <ModerationStatsStrip
          plans={result.plans}
          labels={{
            total: t("stats.total"),
            authors: t("stats.authors"),
            latestPlan: t("stats.latestPlan"),
            empty: t("stats.empty"),
          }}
        />

        <ModerationPlansTable
          plans={result.plans}
          labels={{
            title: t("table.title"),
            description: t("table.description"),
            id: t("table.id"),
            titleColumn: t("table.titleColumn"),
            status: t("table.status"),
            author: t("table.author"),
            email: t("table.email"),
            actions: t("table.actions"),
            empty: t("table.empty"),
            pending: t("table.pending"),
            actionButtons: {
              approve: t("table.actionButtons.approve"),
              approving: t("table.actionButtons.approving"),
              reject: t("table.actionButtons.reject"),
              rejectTitle: t("table.actionButtons.rejectTitle"),
              rejectDescription: t("table.actionButtons.rejectDescription"),
              rejectReason: t("table.actionButtons.rejectReason"),
              rejectReasonPlaceholder: t("table.actionButtons.rejectReasonPlaceholder"),
              submitReject: t("table.actionButtons.submitReject"),
              rejecting: t("table.actionButtons.rejecting"),
              cancel: t("table.actionButtons.cancel"),
              approveSuccess: t("table.actionButtons.approveSuccess"),
              rejectSuccess: t("table.actionButtons.rejectSuccess"),
              errorFallback: t("table.actionButtons.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}
