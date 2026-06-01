import type { HTMLAttributes } from "react";

import { cn } from "@/src/shared/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-border/80 bg-surface/95 p-8 shadow-[0_24px_80px_rgba(37,31,24,0.08)] sm:p-10",
        className,
      )}
      {...props}
    />
  );
}
