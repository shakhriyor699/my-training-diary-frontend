type TrainingPlanGoalLabelGetter = (key: string) => string;

export function getTrainingGoalLabel(
  goal: string,
  t: TrainingPlanGoalLabelGetter,
) {
  switch (goal) {
    case "bulk":
      return t("goalOptions.bulk");
    case "cut":
      return t("goalOptions.cut");
    case "maintenance":
      return t("goalOptions.maintenance");
    default:
      return goal;
  }
}
