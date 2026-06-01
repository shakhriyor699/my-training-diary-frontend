export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatRole(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDisplayNameFromEmail(email: string) {
  const [prefix = "Athlete"] = email.split("@");
  const normalized = prefix.replace(/[._-]+/g, " ").trim();

  if (!normalized) {
    return "Athlete";
  }

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatMuscleGroup(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
