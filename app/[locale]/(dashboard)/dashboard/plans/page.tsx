import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getMyTrainingPlansSafe } from "@/src/features/training-plans/api/get-my-training-plans";
import { getTrainingPlanReferencesSafe } from "@/src/features/training-plans/api/get-training-plan-references";
import { MyTrainingPlansList } from "@/src/features/training-plans/components/my-training-plans-list";
import { getTrainingGoalLabel } from "@/src/features/training-plans/lib/get-training-goal-label";

type MyTrainingPlansPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MyTrainingPlansPage({
  params,
}: MyTrainingPlansPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, currentUser, result, referencesResult] = await Promise.all([
    getTranslations("MyTrainingPlans"),
    requireCurrentUser(locale),
    getMyTrainingPlansSafe(),
    getTrainingPlanReferencesSafe(),
  ]);
  const goalOptions = referencesResult.references.trainingGoals.map((goal) => ({
    value: goal,
    label: getTrainingGoalLabel(goal, (key) => t(`list.create.${key}`)),
  }));

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="space-y-3">
          <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72">
            {t("eyebrow")}
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="max-w-3xl text-lg text-white/46">
              {t("description", {
                name: getDisplayNameFromEmail(currentUser.email),
              })}
            </p>
          </div>
        </header>

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {referencesResult.hasError ? (
          <section className="rounded-[20px] border border-[#facc15]/16 bg-[#facc15]/8 px-5 py-4 text-sm text-white/78">
            {t("referencesError", {
              message: referencesResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <MyTrainingPlansList
          currentUserId={currentUser.id}
          locale={locale}
          plans={result.plans}
          goalOptions={goalOptions}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            browsePublic: t("list.browsePublic"),
            id: t("list.id"),
            status: t("list.status"),
            rejectionReason: t("list.rejectionReason"),
            noReason: t("list.noReason"),
            managedByCoach: t("list.managedByCoach"),
            managedByCoachDescription: t("list.managedByCoachDescription"),
            edit: {
              trigger: t("list.edit.trigger"),
              title: t("list.edit.title"),
              description: t("list.edit.description"),
              titleLabel: t("list.edit.titleLabel"),
              titlePlaceholder: t("list.edit.titlePlaceholder"),
              descriptionLabel: t("list.edit.descriptionLabel"),
              descriptionPlaceholder: t("list.edit.descriptionPlaceholder"),
              submit: t("list.edit.submit"),
              submitting: t("list.edit.submitting"),
              cancel: t("list.edit.cancel"),
              success: t("list.edit.success"),
              errorFallback: t("list.edit.errorFallback"),
            },
            statuses: {
              pending: t("list.statuses.pending"),
              approved: t("list.statuses.approved"),
              rejected: t("list.statuses.rejected"),
            },
            create: {
              trigger: t("list.create.trigger"),
              title: t("list.create.title"),
              description: t("list.create.description"),
              titleLabel: t("list.create.titleLabel"),
              titlePlaceholder: t("list.create.titlePlaceholder"),
              descriptionLabel: t("list.create.descriptionLabel"),
              descriptionPlaceholder: t("list.create.descriptionPlaceholder"),
              goalLabel: t("list.create.goalLabel"),
              deloadAfterWeeksLabel: t("list.create.deloadAfterWeeksLabel"),
              deloadPercentLabel: t("list.create.deloadPercentLabel"),
              deloadAfterWeeksPlaceholder: t("list.create.deloadAfterWeeksPlaceholder"),
              deloadPercentPlaceholder: t("list.create.deloadPercentPlaceholder"),
              submit: t("list.create.submit"),
              submitting: t("list.create.submitting"),
              cancel: t("list.create.cancel"),
              success: t("list.create.success"),
              errorFallback: t("list.create.errorFallback"),
              unavailableGoals: t("list.create.unavailableGoals"),
              fallbackGoal: t("list.create.fallbackGoal"),
            },
          }}
        />
      </div>
    </main>
  );
}
