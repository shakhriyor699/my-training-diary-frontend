import Link from "next/link";

type NutritionPlanDetailsHeaderProps = {
  backHref: string;
  action?: React.ReactNode;
  labels: {
    back: string;
    title: string;
  };
};

export function NutritionPlanDetailsHeader({
  backHref,
  action,
  labels,
}: NutritionPlanDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/52 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span>
          {labels.back}
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          {labels.title}
        </h1>
      </div>
      {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
