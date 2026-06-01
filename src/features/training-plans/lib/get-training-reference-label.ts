type ReferenceLabelGetter = (key: string) => string;

export function getExerciseTypeLabel(
  value: string,
  t: ReferenceLabelGetter,
) {
  switch (value) {
    case "compound":
      return t("typeOptions.compound");
    case "isolation":
      return t("typeOptions.isolation");
    case "bodyweight":
      return t("typeOptions.bodyweight");
    default:
      return value;
  }
}

export function getMuscleGroupLabel(
  value: string,
  t: ReferenceLabelGetter,
) {
  switch (value) {
    case "chest":
      return t("muscleGroupOptions.chest");
    case "back":
      return t("muscleGroupOptions.back");
    case "legs":
      return t("muscleGroupOptions.legs");
    case "shoulders":
      return t("muscleGroupOptions.shoulders");
    case "biceps":
      return t("muscleGroupOptions.biceps");
    case "triceps":
      return t("muscleGroupOptions.triceps");
    case "abs":
      return t("muscleGroupOptions.abs");
    case "glutes":
      return t("muscleGroupOptions.glutes");
    case "calves":
      return t("muscleGroupOptions.calves");
    case "full_body":
    case "fullBody":
      return t("muscleGroupOptions.fullBody");
    default:
      return value;
  }
}
