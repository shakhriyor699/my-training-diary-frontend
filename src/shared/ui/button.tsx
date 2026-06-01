import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/src/shared/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-[0_18px_50px_rgba(195,95,45,0.24)] hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(195,95,45,0.32)]",
        variant === "secondary" &&
          "border border-border bg-background text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
