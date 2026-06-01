import Link from "next/link";

import { formatInteger } from "@/src/features/dashboard/lib/dashboard.utils";

import type {
  CoachStudentNutritionPlan,
  CoachStudentNutritionPlansListLabels,
} from "../lib/nutrition.types";

type CoachStudentNutritionPlansListProps = {
  locale: string;
  studentId: number;
  plans: CoachStudentNutritionPlan[];
  labels: CoachStudentNutritionPlansListLabels;
};

export function CoachStudentNutritionPlansList({
  locale,
  studentId,
  plans,
  labels,
}: CoachStudentNutritionPlansListProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6 space-y-2">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="text-lg text-white/42">{labels.description}</p>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="rounded-[20px] border border-white/8 bg-black/20 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-[#f59e0b]/18 bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#fcd34d]">
                  {labels.goals[plan.goal] ?? plan.goal}
                </span>
                <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                  ID {plan.id}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-2xl font-semibold text-white">{plan.title}</h3>
                <p className="text-sm text-white/58">
                  {labels.goal}: {labels.goals[plan.goal] ?? plan.goal}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MacroCard
                  accentClassName="text-[#fde68a]"
                  label={labels.dailyCalories}
                  value={formatInteger(plan.dailyCalories)}
                  unit={labels.kcalPerDay}
                />
                <MacroCard
                  accentClassName="text-[#86efac]"
                  label={labels.protein}
                  value={formatInteger(plan.proteinGrams)}
                  unit={labels.gramsPerDay}
                />
                <MacroCard
                  accentClassName="text-[#fca5a5]"
                  label={labels.fat}
                  value={formatInteger(plan.fatGrams)}
                  unit={labels.gramsPerDay}
                />
                <MacroCard
                  accentClassName="text-[#93c5fd]"
                  label={labels.carbs}
                  value={formatInteger(plan.carbsGrams)}
                  unit={labels.gramsPerDay}
                />
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  href={`/${locale}/dashboard/my-coach/students/${studentId}/nutrition/${plan.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {labels.viewDetails}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function MacroCard({
  accentClassName,
  label,
  value,
  unit,
}: {
  accentClassName: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-[#050505] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className={["mt-2 text-3xl font-semibold", accentClassName].join(" ")}>
        {value}
      </p>
      <p className="mt-1 text-sm text-white/48">{unit}</p>
    </div>
  );
}
