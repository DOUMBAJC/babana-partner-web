import { format } from "date-fns";
import { enUS, fr as frLocale } from "date-fns/locale";
import type { AccountStatus } from "~/types/auth.types";

export type ActionType =
  | "activate"
  | "suspend"
  | "reject"
  | "reactivate"
  | "assign_role"
  | "remove_role";

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = (parts[1]?.[0] ?? parts[0]?.[1] ?? "").toUpperCase();
  return (first + second).toUpperCase();
}

export function formatDate(value?: string | null, language: "fr" | "en" = "fr"): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const locale = language === "en" ? enUS : frLocale;
  return format(d, "d MMM yyyy • HH:mm", { locale });
}

export function getAvailableActions(status?: AccountStatus | string | null): ActionType[] {
  switch (status) {
    case "active":
      return ["suspend"];
    case "suspended":
      return ["reactivate"];
    case "verified":
      return ["activate", "reject"];
    case "pending_verification":
      return ["reject"];
    case "rejected":
      return ["reactivate"];
    default:
      return [];
  }
}
