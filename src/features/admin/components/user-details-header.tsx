import Link from "next/link";

type UserDetailsHeaderProps = {
  locale: string;
  labels: {
    back: string;
    title: string;
  };
};

export function UserDetailsHeader({
  locale,
  labels,
}: UserDetailsHeaderProps) {
  return (
    <header className="space-y-4">
      <Link
        href={`/${locale}/dashboard/users`}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        {labels.back}
      </Link>
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {labels.title}
        </h1>
      </div>
    </header>
  );
}
