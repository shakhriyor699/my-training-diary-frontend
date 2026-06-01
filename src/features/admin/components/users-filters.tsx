import type { UsersListQuery } from "../lib/admin-users.types";

type UsersFiltersProps = {
  locale: string;
  query: UsersListQuery;
  labels: {
    title: string;
    description: string;
    role: string;
    search: string;
    searchPlaceholder: string;
    allRoles: string;
    apply: string;
    reset: string;
    roles: {
      user: string;
      admin: string;
      moderator: string;
    };
  };
};

export function UsersFilters({
  locale,
  query,
  labels,
}: UsersFiltersProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <form
        action={`/${locale}/dashboard/users`}
        method="GET"
        className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_auto_auto]"
      >
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={query.limit} />

        <FilterField label={labels.role} htmlFor="users-role">
          <select
            id="users-role"
            name="role"
            defaultValue={query.role ?? ""}
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          >
            <option value="" className="bg-[#090909] text-white">
              {labels.allRoles}
            </option>
            <option value="user" className="bg-[#090909] text-white">
              {labels.roles.user}
            </option>
            <option value="admin" className="bg-[#090909] text-white">
              {labels.roles.admin}
            </option>
            <option value="moderator" className="bg-[#090909] text-white">
              {labels.roles.moderator}
            </option>
          </select>
        </FilterField>

        <FilterField label={labels.search} htmlFor="users-search">
          <input
            id="users-search"
            name="search"
            type="text"
            defaultValue={query.search ?? ""}
            placeholder={labels.searchPlaceholder}
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          />
        </FilterField>

        <button
          type="submit"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
        >
          {labels.apply}
        </button>

        <a
          href={`/${locale}/dashboard/users?page=1&limit=10`}
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
