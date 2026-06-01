import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getTrainingSessionByIdSafe } from "@/src/features/training-plans/api/get-training-session-by-id";
import { TrainingSessionDetailsCard } from "@/src/features/training-plans/components/training-session-details-card";
import { TrainingSessionDetailsHeader } from "@/src/features/training-plans/components/training-session-details-header";

type TrainingSessionDetailsPageProps = {
  params: Promise<{ locale: string; sessionId: string }>;
};

export default async function TrainingSessionDetailsPage({
  params,
}: TrainingSessionDetailsPageProps) {
  const { locale, sessionId } = await params;
  setRequestLocale(locale);

  await requireCurrentUser(locale);

  const parsedSessionId = Number.parseInt(sessionId, 10);

  const [t, result] = await Promise.all([
    getTranslations("TrainingSessions.details"),
    Number.isFinite(parsedSessionId) && parsedSessionId > 0
      ? getTrainingSessionByIdSafe(parsedSessionId)
      : Promise.resolve({
          session: null,
          hasError: true,
          errorMessage: "Invalid training session id.",
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <TrainingSessionDetailsHeader
          locale={locale}
          labels={{
            back: t("back"),
            title: t("title"),
          }}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <TrainingSessionDetailsCard
          locale={locale}
          session={result.session}
          labels={{
            title: t("card.title"),
            empty: t("card.empty"),
            emptyDescription: t("card.emptyDescription"),
            date: t("card.date"),
            workoutDay: t("card.workoutDay"),
            totalSets: t("card.totalSets"),
            totalVolume: t("card.totalVolume"),
            exerciseLogs: t("card.exerciseLogs"),
            set: t("card.set"),
            weight: t("card.weight"),
            reps: t("card.reps"),
            rir: t("card.rir"),
            note: t("card.note"),
            target: t("card.target"),
            noSets: t("card.noSets"),
            edit: {
              trigger: t("card.edit.trigger"),
              title: t("card.edit.title"),
              description: t("card.edit.description"),
              noSets: t("card.edit.noSets"),
              exercise: t("card.edit.exercise"),
              note: t("card.edit.note"),
              notePlaceholder: t("card.edit.notePlaceholder"),
              setNumber: t("card.edit.setNumber"),
              weight: t("card.edit.weight"),
              reps: t("card.edit.reps"),
              rir: t("card.edit.rir"),
              weightPlaceholder: t("card.edit.weightPlaceholder"),
              repsPlaceholder: t("card.edit.repsPlaceholder"),
              rirPlaceholder: t("card.edit.rirPlaceholder"),
              submit: t("card.edit.submit"),
              submitting: t("card.edit.submitting"),
              cancel: t("card.edit.cancel"),
              success: t("card.edit.success"),
              errorFallback: t("card.edit.errorFallback"),
              emptySets: t("card.edit.emptySets"),
              incompleteSet: t("card.edit.incompleteSet"),
            },
            delete: {
              trigger: t("card.delete.trigger"),
              confirmTitle: t("card.delete.confirmTitle"),
              confirmDescription: t("card.delete.confirmDescription"),
              confirm: t("card.delete.confirm"),
              deleting: t("card.delete.deleting"),
              cancel: t("card.delete.cancel"),
              success: t("card.delete.success"),
              errorFallback: t("card.delete.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}
