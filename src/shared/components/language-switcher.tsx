"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { routing } from "@/src/i18n/routing";
import { cn } from "@/src/shared/lib/utils";

type LanguageSwitcherProps = {
  locale: string;
};

export function LanguageSwitcher({
  locale: currentLocale,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSwitch = (locale: string) => {
    const segments = pathname.split("/");
    const currentSegment = segments[1];

    if (routing.locales.includes(currentSegment as (typeof routing.locales)[number])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }

    const nextPathname = segments.join("/") || `/${locale}`;
    const queryString = searchParams.toString();

    router.replace(queryString ? `${nextPathname}?${queryString}` : nextPathname);
  };

  return (
    <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/55 p-1 backdrop-blur-xl">
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSwitch(locale)}
            className={cn(
              "min-w-12 rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition-colors",
              isActive
                ? "bg-white text-black"
                : "text-white/62 hover:text-white",
            )}
            aria-pressed={isActive}
            aria-label={`Switch language to ${locale.toUpperCase()}`}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
