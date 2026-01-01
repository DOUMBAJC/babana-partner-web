import type React from "react";
import { ChevronRight } from "lucide-react";

export function ActionCard({
  icon: Icon,
  title,
  description,
  variant,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant: "success" | "cyan" | "warning" | "danger";
  onClick: () => void;
}) {
  const styles = {
    success: {
      bg: "bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    cyan: {
      bg: "bg-babana-cyan/5 hover:bg-babana-cyan/10 dark:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15",
      border: "border-babana-cyan/20 hover:border-babana-cyan/40",
      iconBg: "bg-babana-cyan/15",
      iconColor: "text-babana-cyan",
    },
    warning: {
      bg: "bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 dark:hover:bg-amber-500/15",
      border: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    danger: {
      bg: "bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/15",
      border: "border-rose-500/20 hover:border-rose-500/40",
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  } as const;

  const s = styles[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border ${s.bg} ${s.border} transition-all duration-200 group`}
    >
      <div className={`p-3 rounded-xl ${s.iconBg}`}>
        <Icon className={`h-5 w-5 ${s.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}


