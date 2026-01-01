import type React from "react";
import { useTranslation } from "~/hooks";
import { formatDate } from "../utils";

export function TimelineItem({
  date,
  title,
  description,
  variant = "cyan",
}: {
  date: string;
  title: string;
  description: string;
  variant?: "cyan" | "green" | "emerald" | "red" | "slate";
}) {
  const { language } = useTranslation();
  const colors: Record<NonNullable<typeof variant>, string> = {
    cyan: "bg-babana-cyan",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
    red: "bg-rose-500",
    slate: "bg-slate-500",
  };

  return (
    <div className="relative flex items-start gap-4">
      <div className={`absolute -left-2.5 top-1.5 h-2.5 w-2.5 rounded-full ${colors[variant]} ring-4 ring-background`} />
      <div className="flex-1 min-w-0 pl-2">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium text-sm text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground shrink-0">{formatDate(date, language)}</div>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
    </div>
  );
}


