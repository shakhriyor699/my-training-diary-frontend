import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getCoachStudentTrainingPlansSafe } from "@/src/features/coaches/api/get-coach-student-training-plans";
import { getMyCoachStudentsSafe } from "@/src/features/coaches/api/get-my-coach-students";
import { getCoachStudentStatsSafe } from "@/src/features/coaches/api/get-coach-student-stats";
import { CoachStudentStatsPanel } from "@/src/features/coaches/components/coach-student-stats-panel";
import { CreateCoachStudentTrainingPlanDialog } from "@/src/features/coaches/components/create-coach-student-training-plan-dialog";
import { CoachStudentTrainingPlansBoard } from "@/src/features/coaches/components/coach-student-training-plans-board";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { CreateStudentNutritionPlanDialog } from "@/src/features/nutrition/components/create-student-nutrition-plan-dialog";
import { CoachStudentNutritionPlansList } from "@/src/features/nutrition/components/coach-student-nutrition-plans-list";
import { getCoachStudentNutritionPlansSafe } from "@/src/features/nutrition/api/get-coach-student-nutrition-plans";
import {
  nutritionActivityValues,
  nutritionGenderValues,
  nutritionGoalValues,
} from "@/src/features/nutrition/lib/create-student-nutrition-plan.schema";
import {
  getNutritionActivityLabel,
  getNutritionGenderLabel,
  getNutritionGoalLabel,
} from "@/src/features/nutrition/lib/nutrition-labels";
import { getTrainingPlanReferencesSafe } from "@/src/features/training-plans/api/get-training-plan-references";
import { getTrainingGoalLabel } from "@/src/features/training-plans/lib/get-training-goal-label";
import {
  getExerciseTypeLabel,
  getMuscleGroupLabel,
} from "@/src/features/training-plans/lib/get-training-reference-label";

type CoachStudentStatsPageProps = {
  params: Promise<{
    locale: string;
    studentId: string;
  }>;
};

export default async function CoachStudentStatsPage({
  params,
}: CoachStudentStatsPageProps) {
  const { locale, studentId } = await params;
  setRequestLocale(locale);

  const parsedStudentId = Number.parseInt(studentId, 10);
  const currentUser = await requireCurrentUser(locale);

  const [
    t,
    trainingPlansT,
    workoutsT,
    studentsResult,
    statsResult,
    referencesResult,
    nutritionPlansResult,
    plansResult,
  ] = await Promise.all([
    getTranslations("CoachStudentStatsPage"),
    getTranslations("MyTrainingPlans"),
    getTranslations("WorkoutsPage"),
    getCoachStudentsForUser(currentUser.role),
    Number.isFinite(parsedStudentId) && parsedStudentId > 0 && currentUser.role === "coach"
      ? getCoachStudentStatsSafe(parsedStudentId)
      : Promise.resolve({
          stats: {
            summary: {
              totalWorkouts: 0,
              totalSets: 0,
              totalReps: 0,
              totalVolume: 0,
              averageRir: null,
              currentStreak: 0,
              lastWorkout: null,
            },
            week: {
              totalWorkouts: 0,
              totalSets: 0,
              totalReps: 0,
              totalVolume: 0,
            },
            month: {
              totalWorkouts: 0,
              totalSets: 0,
              totalReps: 0,
              totalVolume: 0,
            },
            muscleGroupStats: [],
            bestEstimatedOneRepMaxByExercise: [],
          },
          hasError: true,
          errorMessage: "Student id is invalid.",
        }),
    currentUser.role === "coach" 
      ? getTrainingPlanReferencesSafe()
      : Promise.resolve({
          references: {
            exerciseTypes: [],
            muscleGroups: [],
            trainingGoals: [],
            planStatuses: [],
          },
          hasError: true,
          errorMessage: "Coach access only.",
        }),
    Number.isFinite(parsedStudentId) && parsedStudentId > 0 && currentUser.role === "coach"
      ? getCoachStudentNutritionPlansSafe(parsedStudentId)
      : Promise.resolve({
          plans: [],
          hasError: true,
          errorMessage: "Student id is invalid.",
        }),
    Number.isFinite(parsedStudentId) && parsedStudentId > 0 && currentUser.role === "coach"
      ? getCoachStudentTrainingPlansSafe(parsedStudentId)
      : Promise.resolve({
          plans: [],
          hasError: true,
          errorMessage: "Student id is invalid.",
        }),
  ]);

  const studentLink =
    studentsResult.students.find((entry) => entry.studentId === parsedStudentId) ?? null;
  const studentName = studentLink
    ? getDisplayNameFromEmail(studentLink.student.email)
    : t("unknownStudent");
  const studentEmail = studentLink?.student.email ?? t("unknownEmail");
  const goalOptions = referencesResult.references.trainingGoals.map((goal) => ({
    value: goal,
    label: getTrainingGoalLabel(goal, (key) => trainingPlansT(`list.create.${key}`)),
  }));
  const nutritionGoalOptions = nutritionGoalValues.map((goal) => ({
    value: goal,
    label: getNutritionGoalLabel(goal, (key) => t(`createNutritionPlan.goals.${key}`)),
  }));
  const nutritionGenderOptions = nutritionGenderValues.map((gender) => ({
    value: gender,
    label: getNutritionGenderLabel(gender, (key) =>
      t(`createNutritionPlan.genders.${key}`),
    ),
  }));
  const nutritionActivityOptions = nutritionActivityValues.map((activity) => ({
    value: activity,
    label: getNutritionActivityLabel(activity, (key) =>
      t(`createNutritionPlan.activities.${key}`),
    ),
  }));

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <UsersPageHeader
            title={t("title", { student: studentName })}
            description={t("description", {
              coach: getDisplayNameFromEmail(currentUser.email),
            })}
          />

          <div className="flex flex-wrap gap-3">
            {currentUser.role === "coach" && Number.isFinite(parsedStudentId) && parsedStudentId > 0 ? (
              <>
                <CreateCoachStudentTrainingPlanDialog
                  studentId={parsedStudentId}
                  goalOptions={goalOptions}
                  labels={{
                    trigger: t("createPlan.trigger"),
                    title: t("createPlan.title", { student: studentName }),
                    description: t("createPlan.description"),
                    titleLabel: t("createPlan.titleLabel"),
                    titlePlaceholder: t("createPlan.titlePlaceholder"),
                    descriptionLabel: t("createPlan.descriptionLabel"),
                    descriptionPlaceholder: t("createPlan.descriptionPlaceholder"),
                    goalLabel: t("createPlan.goalLabel"),
                    deloadAfterWeeksLabel: t("createPlan.deloadAfterWeeksLabel"),
                    deloadPercentLabel: t("createPlan.deloadPercentLabel"),
                    deloadAfterWeeksPlaceholder: t("createPlan.deloadAfterWeeksPlaceholder"),
                    deloadPercentPlaceholder: t("createPlan.deloadPercentPlaceholder"),
                    submit: t("createPlan.submit"),
                    submitting: t("createPlan.submitting"),
                    cancel: t("createPlan.cancel"),
                    success: t("createPlan.success", { student: studentName }),
                    errorFallback: t("createPlan.errorFallback"),
                    unavailableGoals: t("createPlan.unavailableGoals"),
                    fallbackGoal: t("createPlan.fallbackGoal"),
                  }}
                />
                <CreateStudentNutritionPlanDialog
                  studentId={parsedStudentId}
                  goalOptions={nutritionGoalOptions}
                  genderOptions={nutritionGenderOptions}
                  activityOptions={nutritionActivityOptions}
                  labels={{
                    trigger: t("createNutritionPlan.trigger"),
                    title: t("createNutritionPlan.title", { student: studentName }),
                    description: t("createNutritionPlan.description"),
                    titleLabel: t("createNutritionPlan.titleLabel"),
                    titlePlaceholder: t("createNutritionPlan.titlePlaceholder"),
                    goalLabel: t("createNutritionPlan.goalLabel"),
                    weightLabel: t("createNutritionPlan.weightLabel"),
                    weightPlaceholder: t("createNutritionPlan.weightPlaceholder"),
                    heightLabel: t("createNutritionPlan.heightLabel"),
                    heightPlaceholder: t("createNutritionPlan.heightPlaceholder"),
                    ageLabel: t("createNutritionPlan.ageLabel"),
                    agePlaceholder: t("createNutritionPlan.agePlaceholder"),
                    genderLabel: t("createNutritionPlan.genderLabel"),
                    activityLabel: t("createNutritionPlan.activityLabel"),
                    submit: t("createNutritionPlan.submit"),
                    submitting: t("createNutritionPlan.submitting"),
                    cancel: t("createNutritionPlan.cancel"),
                    success: t("createNutritionPlan.success", {
                      student: studentName,
                    }),
                    errorFallback: t("createNutritionPlan.errorFallback"),
                  }}
                />
              </>
            ) : null}
            <Link
              href={`/${locale}/dashboard/my-coach`}
              className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/14 bg-transparent px-5 text-sm font-medium text-white/82 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t("back")}
            </Link>
            <Link
              href={`/${locale}/dashboard/my-coach/students/${studentId}/sessions`}
              className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/14 bg-transparent px-5 text-sm font-medium text-white/82 transition hover:bg-white/[0.04] hover:text-white"
            >
              {t("viewSessions")}
            </Link>
          </div>
        </div>

        {studentsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("studentsError", {
              message: studentsResult.errorMessage ?? t("errorFallback"),
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

        {plansResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("plansError", {
              message: plansResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {nutritionPlansResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("nutritionPlansError", {
              message: nutritionPlansResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {statsResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: statsResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <CoachStudentStatsPanel
          studentName={studentName}
          studentEmail={studentEmail}
          stats={statsResult.stats}
          labels={{
            title: t("panel.title"),
            description: t("panel.description"),
            empty: t("panel.empty"),
            workoutsWeek: t("panel.workoutsWeek"),
            workoutsWeekHint: t("panel.workoutsWeekHint"),
            totalVolume: t("panel.totalVolume"),
            totalVolumeHint: t("panel.totalVolumeHint"),
            currentStreak: t("panel.currentStreak"),
            days: t("panel.days"),
            totalReps: t("panel.totalReps"),
            averageRirHint: t("panel.averageRirHint"),
            summaryTitle: t("panel.summaryTitle"),
            summaryDescription: t("panel.summaryDescription"),
            student: t("panel.student"),
            bestLift: t("panel.bestLift"),
            bestLiftDescription: t("panel.bestLiftDescription"),
            muscleFocus: t("panel.muscleFocus"),
            muscleFocusDescription: t("panel.muscleFocusDescription"),
            monthSummary: t("panel.monthSummary"),
            monthSummaryDescription: t("panel.monthSummaryDescription"),
            lastWorkout: t("panel.lastWorkout"),
            noData: t("panel.noData"),
            noDataSecondary: t("panel.noDataSecondary"),
            workouts: t("panel.workouts"),
            sets: t("panel.sets"),
            volume: t("panel.volume"),
            reps: t("panel.reps"),
          }}
        />

        <CoachStudentNutritionPlansList
          locale={locale}
          studentId={parsedStudentId}
          plans={nutritionPlansResult.plans}
          labels={{
            title: t("nutritionPlans.title", { student: studentName }),
            description: t("nutritionPlans.description"),
            empty: t("nutritionPlans.empty"),
            viewDetails: t("nutritionPlans.viewDetails"),
            goal: t("nutritionPlans.goal"),
            dailyCalories: t("nutritionPlans.dailyCalories"),
            protein: t("nutritionPlans.protein"),
            fat: t("nutritionPlans.fat"),
            carbs: t("nutritionPlans.carbs"),
            kcalPerDay: t("nutritionPlans.kcalPerDay"),
            gramsPerDay: t("nutritionPlans.gramsPerDay"),
            goals: {
              bulk: t("createNutritionPlan.goals.bulk"),
              cut: t("createNutritionPlan.goals.cut"),
              maintain: t("createNutritionPlan.goals.maintain"),
            },
          }}
        />

        <CoachStudentTrainingPlansBoard
          plans={plansResult.plans}
          exerciseTypeOptions={referencesResult.references.exerciseTypes.map((type) => ({
            value: type,
            label: getExerciseTypeLabel(
              type,
              (key) => workoutsT(`board.createExercise.${key}`),
            ),
          }))}
          muscleGroupOptions={referencesResult.references.muscleGroups.map((group) => ({
            value: group,
            label: getMuscleGroupLabel(
              group,
              (key) => workoutsT(`board.createExercise.${key}`),
            ),
          }))}
          labels={{
            title: t("plans.title", { student: studentName }),
            description: t("plans.description"),
            empty: t("plans.empty"),
            rejectionReason: workoutsT("board.rejectionReason"),
            noReason: t("plans.noReason"),
            workoutDaysTitle: workoutsT("board.workoutDaysTitle"),
            workoutDaysEmpty: t("plans.workoutDaysEmpty"),
            exercisesTitle: workoutsT("board.exercisesTitle"),
            exercisesEmpty: t("plans.exercisesEmpty"),
            statuses: {
              pending: trainingPlansT("list.statuses.pending"),
              approved: trainingPlansT("list.statuses.approved"),
              rejected: trainingPlansT("list.statuses.rejected"),
            },
            editPlan: {
              trigger: t("plans.editPlan.trigger"),
              title: t("plans.editPlan.title"),
              description: t("plans.editPlan.description"),
              titleLabel: trainingPlansT("list.edit.titleLabel"),
              titlePlaceholder: trainingPlansT("list.edit.titlePlaceholder"),
              descriptionLabel: trainingPlansT("list.edit.descriptionLabel"),
              descriptionPlaceholder: trainingPlansT("list.edit.descriptionPlaceholder"),
              submit: trainingPlansT("list.edit.submit"),
              submitting: trainingPlansT("list.edit.submitting"),
              cancel: trainingPlansT("list.edit.cancel"),
              success: t("plans.editPlan.success"),
              errorFallback: t("plans.editPlan.errorFallback"),
            },
            createDay: {
              trigger: workoutsT("board.createDay.trigger"),
              title: workoutsT("board.createDay.title"),
              description: t("plans.createDay.description"),
              titleLabel: workoutsT("board.createDay.titleLabel"),
              titlePlaceholder: workoutsT("board.createDay.titlePlaceholder"),
              orderLabel: workoutsT("board.createDay.orderLabel"),
              orderPlaceholder: workoutsT("board.createDay.orderPlaceholder"),
              submit: workoutsT("board.createDay.submit"),
              submitting: workoutsT("board.createDay.submitting"),
              cancel: workoutsT("board.createDay.cancel"),
              success: t("plans.createDay.success"),
              errorFallback: t("plans.createDay.errorFallback"),
            },
            createExercise: {
              trigger: workoutsT("board.createExercise.trigger"),
              title: workoutsT("board.createExercise.title"),
              description: t("plans.createExercise.description"),
              nameLabel: workoutsT("board.createExercise.nameLabel"),
              namePlaceholder: workoutsT("board.createExercise.namePlaceholder"),
              descriptionLabel: workoutsT("board.createExercise.descriptionLabel"),
              descriptionPlaceholder: workoutsT("board.createExercise.descriptionPlaceholder"),
              orderLabel: workoutsT("board.createExercise.orderLabel"),
              orderPlaceholder: workoutsT("board.createExercise.orderPlaceholder"),
              typeLabel: workoutsT("board.createExercise.typeLabel"),
              muscleGroupLabel: workoutsT("board.createExercise.muscleGroupLabel"),
              targetSetsLabel: workoutsT("board.createExercise.targetSetsLabel"),
              minRepsLabel: workoutsT("board.createExercise.minRepsLabel"),
              maxRepsLabel: workoutsT("board.createExercise.maxRepsLabel"),
              targetRirLabel: workoutsT("board.createExercise.targetRirLabel"),
              weightStepLabel: workoutsT("board.createExercise.weightStepLabel"),
              targetSetsPlaceholder: workoutsT("board.createExercise.targetSetsPlaceholder"),
              minRepsPlaceholder: workoutsT("board.createExercise.minRepsPlaceholder"),
              maxRepsPlaceholder: workoutsT("board.createExercise.maxRepsPlaceholder"),
              targetRirPlaceholder: workoutsT("board.createExercise.targetRirPlaceholder"),
              weightStepPlaceholder: workoutsT("board.createExercise.weightStepPlaceholder"),
              submit: workoutsT("board.createExercise.submit"),
              submitting: workoutsT("board.createExercise.submitting"),
              cancel: workoutsT("board.createExercise.cancel"),
              success: t("plans.createExercise.success"),
              errorFallback: t("plans.createExercise.errorFallback"),
              unavailableTypes: workoutsT("board.createExercise.unavailableTypes"),
              unavailableMuscleGroups: workoutsT("board.createExercise.unavailableMuscleGroups"),
              fallbackType: workoutsT("board.createExercise.fallbackType"),
              fallbackMuscleGroup: workoutsT("board.createExercise.fallbackMuscleGroup"),
            },
            editExercise: {
              trigger: workoutsT("board.editExercise.trigger"),
              title: workoutsT("board.editExercise.title"),
              description: t("plans.editExercise.description"),
              nameLabel: workoutsT("board.editExercise.nameLabel"),
              namePlaceholder: workoutsT("board.editExercise.namePlaceholder"),
              descriptionLabel: workoutsT("board.editExercise.descriptionLabel"),
              descriptionPlaceholder: workoutsT("board.editExercise.descriptionPlaceholder"),
              orderLabel: workoutsT("board.editExercise.orderLabel"),
              orderPlaceholder: workoutsT("board.editExercise.orderPlaceholder"),
              typeLabel: workoutsT("board.editExercise.typeLabel"),
              muscleGroupLabel: workoutsT("board.editExercise.muscleGroupLabel"),
              targetSetsLabel: workoutsT("board.editExercise.targetSetsLabel"),
              minRepsLabel: workoutsT("board.editExercise.minRepsLabel"),
              maxRepsLabel: workoutsT("board.editExercise.maxRepsLabel"),
              targetRirLabel: workoutsT("board.editExercise.targetRirLabel"),
              weightStepLabel: workoutsT("board.editExercise.weightStepLabel"),
              targetSetsPlaceholder: workoutsT("board.editExercise.targetSetsPlaceholder"),
              minRepsPlaceholder: workoutsT("board.editExercise.minRepsPlaceholder"),
              maxRepsPlaceholder: workoutsT("board.editExercise.maxRepsPlaceholder"),
              targetRirPlaceholder: workoutsT("board.editExercise.targetRirPlaceholder"),
              weightStepPlaceholder: workoutsT("board.editExercise.weightStepPlaceholder"),
              submit: workoutsT("board.editExercise.submit"),
              submitting: workoutsT("board.editExercise.submitting"),
              cancel: workoutsT("board.editExercise.cancel"),
              success: t("plans.editExercise.success"),
              errorFallback: t("plans.editExercise.errorFallback"),
              unavailableTypes: workoutsT("board.editExercise.unavailableTypes"),
              unavailableMuscleGroups: workoutsT("board.editExercise.unavailableMuscleGroups"),
              fallbackType: workoutsT("board.editExercise.fallbackType"),
              fallbackMuscleGroup: workoutsT("board.editExercise.fallbackMuscleGroup"),
            },
            deleteExercise: {
              trigger: workoutsT("board.deleteExercise.trigger"),
              confirmTitle: workoutsT("board.deleteExercise.confirmTitle"),
              confirmDescription: t("plans.deleteExercise.confirmDescription"),
              confirm: workoutsT("board.deleteExercise.confirm"),
              deleting: workoutsT("board.deleteExercise.deleting"),
              cancel: workoutsT("board.deleteExercise.cancel"),
              success: t("plans.deleteExercise.success"),
              errorFallback: t("plans.deleteExercise.errorFallback"),
            },
            editDay: {
              trigger: workoutsT("board.editDay.trigger"),
              title: workoutsT("board.editDay.title"),
              description: t("plans.editDay.description"),
              titleLabel: workoutsT("board.editDay.titleLabel"),
              titlePlaceholder: workoutsT("board.editDay.titlePlaceholder"),
              orderLabel: workoutsT("board.editDay.orderLabel"),
              orderPlaceholder: workoutsT("board.editDay.orderPlaceholder"),
              submit: workoutsT("board.editDay.submit"),
              submitting: workoutsT("board.editDay.submitting"),
              cancel: workoutsT("board.editDay.cancel"),
              success: t("plans.editDay.success"),
              errorFallback: t("plans.editDay.errorFallback"),
            },
            deleteDay: {
              trigger: workoutsT("board.deleteDay.trigger"),
              confirmTitle: workoutsT("board.deleteDay.confirmTitle"),
              confirmDescription: t("plans.deleteDay.confirmDescription"),
              confirm: workoutsT("board.deleteDay.confirm"),
              deleting: workoutsT("board.deleteDay.deleting"),
              cancel: workoutsT("board.deleteDay.cancel"),
              success: t("plans.deleteDay.success"),
              errorFallback: t("plans.deleteDay.errorFallback"),
            },
          }}
        />
      </div>
    </main>
  );
}

async function getCoachStudentsForUser(role: string) {
  if (role !== "coach") {
    return {
      students: [],
      hasError: true,
      errorMessage: "Coach access only.",
    };
  }

  return getMyCoachStudentsSafe();
}
