import { format } from "date-fns";
import { enUS, fr as frLocale } from "date-fns/locale";

export type ActionType = "create" | "update" | "delete" | "reveal_password";

export function formatDate(value?: string | null, language: "fr" | "en" = "fr"): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const locale = language === "en" ? enUS : frLocale;
  return format(d, "d MMM yyyy • HH:mm", { locale });
}

export function getInitials(value: string): string {
  const v = (value || "").trim();
  if (!v) return "CL";
  const parts = v.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? v[0] ?? "C";
  const second = (parts[1]?.[0] ?? parts[0]?.[1] ?? "").toUpperCase();
  return (first + second).toUpperCase();
}


