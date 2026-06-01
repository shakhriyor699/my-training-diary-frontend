import { Input } from "@/src/shared/ui/input";

import type { PublicTrainingPlansQuery } from "../lib/training-plans.types";

type TrainingPlansFiltersProps = {
  locale: string;
  query: PublicTrainingPlansQuery;
  labels: {
    title: string;
    description: string;
    search: string;
    searchPlaceholder: string;
    authorId: string;
    authorIdPlaceholder: string;
    sort: string;
    order: string;
    apply: string;
    reset: string;
    sortOptions: {
      createdAt: string;
      title: string;
    };
    orderOptions: {
      asc: string;
      desc: string;
    };
  };
};

export function TrainingPlansFilters({
  locale,
  query,
  labels,
}: TrainingPlansFiltersProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <form
        action={`/${locale}/training-plans`}
        method="GET"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_220px_220px_180px_auto_auto]"
      >
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={query.limit} />

        <FilterField label={labels.search} htmlFor="plans-search">
          <Input
            id="plans-search"
            name="search"
            defaultValue={query.search ?? ""}
            placeholder={labels.searchPlaceholder}
          />
        </FilterField>

        <FilterField label={labels.authorId} htmlFor="plans-author-id">
          <Input
            id="plans-author-id"
            name="authorId"
            type="number"
            min="1"
            defaultValue={query.authorId ? String(query.authorId) : ""}
            placeholder={labels.authorIdPlaceholder}
          />
        </FilterField>

        <FilterField label={labels.sort} htmlFor="plans-sort">
          <select
            id="plans-sort"
            name="sort"
            defaultValue={query.sort}
            className="h-12 w-full rounded-2xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          >
            <option value="createdAt" className="bg-[#090909] text-white">
              {labels.sortOptions.createdAt}
            </option>
            <option value="title" className="bg-[#090909] text-white">
              {labels.sortOptions.title}
            </option>
          </select>
        </FilterField>

        <FilterField label={labels.order} htmlFor="plans-order">
          <select
            id="plans-order"
            name="order"
            defaultValue={query.order}
            className="h-12 w-full rounded-2xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          >
            <option value="desc" className="bg-[#090909] text-white">
              {labels.orderOptions.desc}
            </option>
            <option value="asc" className="bg-[#090909] text-white">
              {labels.orderOptions.asc}
            </option>
          </select>
        </FilterField>

        <button
          type="submit"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
        >
          {labels.apply}
        </button>

        <a
          href={`/${locale}/training-plans?page=1&limit=10&sort=createdAt&order=desc`}
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-5 text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          {labels.reset}
        </a>
      </form>
    </section>
  );
}

type FilterFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <label htmlFor={htmlFor} className="space-y-2">
      <span className="block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}
