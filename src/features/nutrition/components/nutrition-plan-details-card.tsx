import {
  formatInteger,
  formatRole,
  getDisplayNameFromEmail,
} from "@/src/features/dashboard/lib/dashboard.utils";

import type { NutritionPlanDetails } from "../lib/nutrition.types";
import type { NutritionPlanDetailsCardLabels } from "../lib/nutrition.types";
import type { NutritionPlanDay } from "../lib/nutrition.types";
import type { NutritionPlanMeal } from "../lib/nutrition.types";

type NutritionPlanDetailsCardProps = {
  plan: NutritionPlanDetails | null;
  labels: NutritionPlanDetailsCardLabels;
  daysAction?: React.ReactNode;
  renderDayAction?: (day: NutritionPlanDay) => React.ReactNode;
  renderMealAction?: (meal: NutritionPlanMeal) => React.ReactNode;
};

export function NutritionPlanDetailsCard({
  plan,
  labels,
  daysAction,
  renderDayAction,
  renderMealAction,
}: NutritionPlanDetailsCardProps) {
  if (!plan) {
    return (
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
          <p className="text-xl font-semibold text-white">{labels.empty}</p>
          <p className="mt-2 text-sm text-white/48">{labels.emptyDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                ID {plan.id}
              </span>
              <span className="inline-flex rounded-full border border-[#f59e0b]/18 bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#fcd34d]">
                {labels.goals[plan.goal] ?? plan.goal}
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-white">{plan.title}</h2>
              <p className="mt-2 text-sm text-white/52">
                {labels.goal}: {labels.goals[plan.goal] ?? plan.goal}
              </p>
            </div>
          </div>

          <div className="grid min-w-[280px] gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
            <Metric
              label={labels.coach}
              value={getDisplayNameFromEmail(plan.coach.email)}
            />
            <Metric label={labels.coachEmail} value={plan.coach.email} />
            <Metric label={labels.coachRole} value={formatRole(plan.coach.role)} />
            <Metric
              label={labels.student}
              value={getDisplayNameFromEmail(plan.student.email)}
            />
            <Metric label={labels.studentEmail} value={plan.student.email} />
            <Metric label={labels.studentRole} value={formatRole(plan.student.role)} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-[32px] font-semibold text-white">{labels.days}</h2>
            <p className="text-lg text-white/42">{plan.days.length}</p>
          </div>
          {daysAction ? <div className="flex flex-wrap gap-3">{daysAction}</div> : null}
        </div>

        {plan.days.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
            {labels.noMeals}
          </div>
        ) : (
          <div className="space-y-4">
            {plan.days.map((day) => (
              <article
                key={day.id}
                className="overflow-hidden rounded-[20px] border border-white/8 bg-black/20"
              >
                <div className="border-b border-white/8 px-5 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                          {labels.dayNumber} {day.dayNumber}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        {day.title}
                      </h3>
                    </div>
                    {renderDayAction ? (
                      <div className="flex flex-wrap gap-3">{renderDayAction(day)}</div>
                    ) : null}
                  </div>
                </div>

                <div className="px-5 py-5">
                  <p className="mb-4 text-xs uppercase tracking-[0.14em] text-white/36">
                    {labels.meals}
                  </p>

                  {day.meals.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-white/10 bg-[#050505] px-6 py-8 text-center text-white/52">
                      {labels.noMeals}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {day.meals.map((meal) => (
                        <div
                          key={meal.id}
                          className="rounded-[18px] border border-white/8 bg-[#050505] p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h4 className="text-xl font-semibold text-white">
                                {meal.name}
                              </h4>
                              <p className="mt-1 text-sm text-white/52">
                                {labels.time}: {meal.time}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                              <span className="text-sm text-white/48">
                                {labels.foods}: {meal.foods.length}
                              </span>
                              {renderMealAction ? renderMealAction(meal) : null}
                            </div>
                          </div>

                          {meal.foods.length === 0 ? (
                            <div className="mt-4 rounded-[16px] border border-dashed border-white/10 bg-black/20 px-4 py-6 text-center text-white/52">
                              {labels.noFoods}
                            </div>
                          ) : (
                            <div className="mt-4 space-y-3">
                              {meal.foods.map((food) => (
                                <div
                                  key={food.id}
                                  className="rounded-[16px] border border-white/8 bg-black/20 p-4"
                                >
                                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                      <h5 className="text-lg font-semibold text-white">
                                        {food.name}
                                      </h5>
                                      <p className="mt-1 text-sm text-white/52">
                                        {labels.grams}: {formatInteger(food.grams)}
                                      </p>
                                    </div>

                                    <div className="grid min-w-[280px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                      <Stat label={labels.calories} value={food.calories} />
                                      <Stat label={labels.protein} value={food.protein} />
                                      <Stat label={labels.fat} value={food.fat} />
                                      <Stat label={labels.carbs} value={food.carbs} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-white/8 bg-white/[0.02] px-3 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{formatInteger(value)}</p>
    </div>
  );
}
