import Link from "next/link";

import {
  formatDateLabel,
  formatInteger,
  formatMuscleGroup,
  getDisplayNameFromEmail,
} from "@/src/features/dashboard/lib/dashboard.utils";
import { TrainingPlanEngagement } from "@/src/features/training-plans/components/training-plan-engagement";

import { toPublicTrainingPlansSearchParams } from "../lib/training-plans.query";
import type {
  PublicTrainingPlan,
  PublicTrainingPlansQuery,
  PublicTrainingPlansResponse,
} from "../lib/training-plans.types";

type TrainingPlansListProps = {
  locale: string;
  response: PublicTrainingPlansResponse;
  query: PublicTrainingPlansQuery;
  labels: {
    title: string;
    description: string;
    empty: string;
    previous: string;
    next: string;
    page: string;
    statusApproved: string;
    approvedCount: string;
    byAuthor: string;
    createdAt: string;
    likes: string;
    like: string;
    likedAction: string;
    save: string;
    savedAction: string;
    saved: string;
    liked: string;
    yes: string;
    notSaved: string;
    notLiked: string;
    workoutDays: string;
    exercises: string;
    day: string;
    target: string;
    rir: string;
    weightStep: string;
    likeErrorFallback: string;
    saveErrorFallback: string;
  };
};

export function TrainingPlansList({
  locale,
  response,
  query,
  labels,
}: TrainingPlansListProps) {
  const previousPage = Math.max(response.meta.page - 1, 1);
  const nextPage = Math.min(response.meta.page + 1, response.meta.totalPages);

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
          <p className="mt-1 text-lg text-white/42">{labels.description}</p>
        </div>
        <div className="rounded-full border border-[#39d353]/20 bg-[#39d353]/10 px-4 py-2 text-sm font-medium text-[#7ee787]">
          {labels.approvedCount}
        </div>
      </div>

      {response.data.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-5">
          {response.data.map((plan) => (
            <PlanCard key={plan.id} plan={plan} labels={labels} />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {labels.page} {response.meta.page} / {response.meta.totalPages}
        </p>
        <div className="flex gap-2">
          <PaginationLink
            locale={locale}
            query={{ ...query, page: previousPage }}
            disabled={response.meta.page <= 1}
            label={labels.previous}
          />
          <PaginationLink
            locale={locale}
            query={{ ...query, page: nextPage }}
            disabled={response.meta.page >= response.meta.totalPages}
            label={labels.next}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  labels,
}: {
  plan: PublicTrainingPlan;
  labels: TrainingPlansListProps["labels"];
}) {
  const workoutDays = plan.workoutDays ?? [];
  const totalExercises = workoutDays.reduce(
    (sum, day) => sum + (day.exercises?.length ?? 0),
    0,
  );

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-[#39d353]/20 bg-[#39d353]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7ee787]">
                {labels.statusApproved}
              </span>
              <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                ID {plan.id}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">{plan.title}</h3>
              {plan.description ? (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
                  {plan.description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/52">
              <span>
                {labels.byAuthor}: {getDisplayNameFromEmail(plan.author.email)}
              </span>
              {plan.createdAt ? (
                <span>
                  {labels.createdAt}: {formatDateLabel(plan.createdAt)}
                </span>
              ) : null}
            </div>
            {typeof plan.isLiked === "boolean" ? (
              <TrainingPlanEngagement
                planId={plan.id}
                initialLiked={plan.isLiked}
                initialLikesCount={plan.likesCount}
                initialIsSaved={plan.isSaved}
                labels={{
                  likes: labels.likes,
                  like: labels.like,
                  likedAction: labels.likedAction,
                  save: labels.save,
                  savedAction: labels.savedAction,
                  liked: labels.liked,
                  saved: labels.saved,
                  yes: labels.yes,
                  notLiked: labels.notLiked,
                  notSaved: labels.notSaved,
                  likeErrorFallback: labels.likeErrorFallback,
                  saveErrorFallback: labels.saveErrorFallback,
                }}
              />
            ) : (
              <div className="flex flex-wrap gap-4 text-sm text-white/52">
                <span>
                  {labels.likes}: {formatInteger(plan.likesCount)}
                </span>
                {typeof plan.isSaved === "boolean" ? (
                  <span>
                    {labels.saved}: {plan.isSaved ? labels.yes : labels.notSaved}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          <div className="grid min-w-[220px] gap-3">
            <div className="grid gap-3 rounded-[18px] border border-white/8 bg-black/20 p-4 text-sm text-white/64">
              <Metric label={labels.workoutDays} value={formatInteger(workoutDays.length)} />
              <Metric label={labels.exercises} value={formatInteger(totalExercises)} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 sm:px-6 xl:grid-cols-2">
        {workoutDays.map((day) => (
          <section
            key={day.id}
            className="rounded-[18px] border border-white/8 bg-black/20 p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/38">
                  {labels.day} {day.order}
                </p>
                <h4 className="text-lg font-semibold text-white">{day.title}</h4>
              </div>
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-white/58">
                {formatInteger(day.exercises?.length ?? 0)} {labels.exercises.toLowerCase()}
              </span>
            </div>

            <div className="space-y-3">
              {(day.exercises ?? []).map((exercise) => (
                <div
                  key={exercise.id}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-white">{exercise.name}</p>
                      <p className="mt-1 text-sm text-white/45">
                        {exercise.type} • {formatMuscleGroup(exercise.muscleGroup)}
                      </p>
                    </div>
                    <div className="text-right text-sm text-white/55">
                      <p>
                        {labels.target}: {exercise.targetSets} x {exercise.minReps}-{exercise.maxReps}
                      </p>
                      <p>
                        {labels.rir}: {exercise.targetRir} • {labels.weightStep}: {exercise.weightStep}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function PaginationLink({
  locale,
  query,
  disabled,
  label,
}: {
  locale: string;
  query: PublicTrainingPlansQuery;
  disabled: boolean;
  label: string;
}) {
  const href = `/${locale}/training-plans?${toPublicTrainingPlansSearchParams(query)}`;

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
