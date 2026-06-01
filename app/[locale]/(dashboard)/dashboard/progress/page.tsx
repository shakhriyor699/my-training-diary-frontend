import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getExerciseProgressSafe } from "@/src/features/training-plans/api/get-exercise-progress";
import { getExerciseProgressSummarySafe } from "@/src/features/training-plans/api/get-exercise-progress-summary";
import { getMyTrainingPlansSafe } from "@/src/features/training-plans/api/get-my-training-plans";
import { ExerciseProgressPicker } from "@/src/features/training-plans/components/exercise-progress-picker";
import { ExerciseProgressPanel } from "@/src/features/training-plans/components/exercise-progress-panel";

type ProgressPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ExerciseOption = {
  id: number;
  name: string;
  planTitle: string;
  dayTitle: string;
};

export default async function ProgressPage({
  params,
  searchParams,
}: ProgressPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const selectedExerciseId = getPositiveInteger(
    getSingleParam((await searchParams).exerciseId),
  );

  const [t, currentUser, plansResult] = await Promise.all([
    getTranslations("ProgressPage"),
    requireCurrentUser(locale),
    getMyTrainingPlansSafe(),
  ]);

  const exerciseOptions = getExerciseOptions(plansResult.plans);
  const selectedExercise =
    exerciseOptions.find((exercise) => exercise.id === selectedExerciseId) ?? null;

  const [progressResult, summaryResult] = selectedExercise
    ? await Promise.all([
        getExerciseProgressSafe(selectedExercise.id),
        getExerciseProgressSummarySafe(selectedExercise.id),
      ])
    : [
        {
          response: { exerciseId: 0, data: [] },
          hasError: false,
          errorMessage: null,
        },
        {
          response: { exerciseId: 0, data: [] },
          hasError: false,
          errorMessage: null,
        },
      ];

  const hasError =
    plansResult.hasError || progressResult.hasError || summaryResult.hasError;
  const errorMessage =
    plansResult.errorMessage ??
    progressResult.errorMessage ??
    summaryResult.errorMessage;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description", {
            name: getDisplayNameFromEmail(currentUser.email),
          })}
        />

        {hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <ExerciseProgressPicker
          selectedExerciseId={selectedExercise?.id}
          exercises={exerciseOptions}
          labels={{
            title: t("picker.title"),
            description: t("picker.description"),
            exercise: t("picker.exercise"),
            placeholder: t("picker.placeholder"),
            apply: t("picker.apply"),
          }}
        />

        {selectedExercise ? (
          <ExerciseProgressPanel
            exerciseName={selectedExercise.name}
            progress={progressResult.response}
            summary={summaryResult.response}
            labels={{
              title: t("panel.title"),
              description: t("panel.description", {
                exercise: selectedExercise.name,
              }),
              summaryTitle: t("panel.summaryTitle"),
              summaryDescription: t("panel.summaryDescription"),
              historyTitle: t("panel.historyTitle"),
              historyDescription: t("panel.historyDescription"),
              noSelection: t("panel.noSelection"),
              empty: t("panel.empty"),
              chartEmpty: t("panel.chartEmpty"),
              date: t("panel.date"),
              setNumber: t("panel.setNumber"),
              weight: t("panel.weight"),
              reps: t("panel.reps"),
              rir: t("panel.rir"),
              volume: t("panel.volume"),
              estimatedOneRepMax: t("panel.estimatedOneRepMax"),
              bestWeight: t("panel.bestWeight"),
              bestReps: t("panel.bestReps"),
              bestEstimatedOneRepMax: t("panel.bestEstimatedOneRepMax"),
              totalVolume: t("panel.totalVolume"),
              setsCount: t("panel.setsCount"),
              entries: t("panel.entries"),
            }}
          />
        ) : (
          <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
            <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
              {t("panel.noSelection")}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function getExerciseOptions(plans: Awaited<ReturnType<typeof getMyTrainingPlansSafe>>["plans"]) {
  const options = new Map<number, ExerciseOption>();

  plans.forEach((plan) => {
    (plan.workoutDays ?? []).forEach((day) => {
      (day.exercises ?? []).forEach((exercise) => {
        if (!options.has(exercise.id)) {
          options.set(exercise.id, {
            id: exercise.id,
            name: exercise.name,
            planTitle: plan.title,
            dayTitle: day.title,
          });
        }
      });
    });
  });

  return Array.from(options.values()).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getPositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
}
