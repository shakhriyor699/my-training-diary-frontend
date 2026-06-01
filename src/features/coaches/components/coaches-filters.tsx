import type { CoachesQuery } from "../lib/coaches.types";

type CoachesFiltersProps = {
  locale: string;
  query: CoachesQuery;
  labels: {
    title: string;
    description: string;
    search: string;
    searchPlaceholder: string;
    apply: string;
    reset: string;
  };
};

export function CoachesFilters({
  locale,
  query,
  labels,
}: CoachesFiltersProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <form
        action={`/${locale}/dashboard/coaches`}
        method="GET"
        className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
        <label htmlFor="coaches-search" className="space-y-2">
          <span className="block text-sm font-medium text-white/72">{labels.search}</span>
          <input
            id="coaches-search"
            name="search"
            type="text"
            defaultValue={query.search ?? ""}
            placeholder={labels.searchPlaceholder}
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          />
        </label>

        <button
          type="submit"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
        >
          {labels.apply}
        </button>

        <a
          href={`/${locale}/dashboard/coaches`}
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-5 text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          {labels.reset}
        </a>
      </form>
    </section>
  );
}
