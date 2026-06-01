import type { NotificationsQuery } from "../lib/notifications.types";

type NotificationsFiltersProps = {
  locale: string;
  query: NotificationsQuery;
  labels: {
    title: string;
    description: string;
    status: string;
    all: string;
    unread: string;
    read: string;
    apply: string;
    reset: string;
  };
};

export function NotificationsFilters({
  locale,
  query,
  labels,
}: NotificationsFiltersProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      <form
        action={`/${locale}/dashboard/notifications`}
        method="GET"
        className="grid gap-4 md:grid-cols-[220px_auto_auto]"
      >
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={query.limit} />

        <label htmlFor="notifications-is-read" className="space-y-2">
          <span className="block text-sm font-medium text-white/72">{labels.status}</span>
          <select
            id="notifications-is-read"
            name="isRead"
            defaultValue={
              typeof query.isRead === "boolean" ? String(query.isRead) : ""
            }
            className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
          >
            <option value="" className="bg-[#090909] text-white">
              {labels.all}
            </option>
            <option value="false" className="bg-[#090909] text-white">
              {labels.unread}
            </option>
            <option value="true" className="bg-[#090909] text-white">
              {labels.read}
            </option>
          </select>
        </label>

        <button
          type="submit"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#27d927]"
        >
          {labels.apply}
        </button>

        <a
          href={`/${locale}/dashboard/notifications?page=1&limit=10`}
          className="mt-auto inline-flex h-12 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-5 text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          {labels.reset}
        </a>
      </form>
    </section>
  );
}
