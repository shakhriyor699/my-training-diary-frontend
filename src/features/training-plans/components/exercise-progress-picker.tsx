type ExerciseOption = {
  id: number;
  name: string;
  planTitle: string;
  dayTitle: string;
};

type ExerciseProgressPickerProps = {
  selectedExerciseId?: number;
  exercises: ExerciseOption[];
  labels: {
    title: string;
    description: string;
    exercise: string;
    placeholder: string;
    apply: string;
  };
};

export function ExerciseProgressPicker({
  selectedExerciseId,
  exercises,
  labels,
}: ExerciseProgressPickerProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-5">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px]">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/38">
            {labels.exercise}
          </span>
          <select
            name="exerciseId"
            defaultValue={selectedExerciseId ? String(selectedExerciseId) : ""}
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          >
            <option value="" className="bg-[#090909] text-white">
              {labels.placeholder}
            </option>
            {exercises.map((exercise) => (
              <option
                key={exercise.id}
                value={exercise.id}
                className="bg-[#090909] text-white"
              >
                {exercise.name} • {exercise.planTitle} • {exercise.dayTitle}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center self-end rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
        >
          {labels.apply}
        </button>
      </form>
    </section>
  );
}
