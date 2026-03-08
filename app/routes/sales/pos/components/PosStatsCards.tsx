import { useMemo } from "react";
import { useTranslation, useLanguage } from "~/hooks";
import {
  Store,
  CheckCircle2,
  XCircle,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
} from "lucide-react";

interface PosStats {
  total: number;
  active: number;
  inactive: number;
  this_month: number;
  last_month?: number;
  recent_7d?: number;
  growth_rate?: number;
}

interface PosStatsCardsProps {
  stats: PosStats;
  isAdmin?: boolean;
}

export function PosStatsCards({ stats, isAdmin = false }: PosStatsCardsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const activePercent = useMemo(
    () => (stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0),
    [stats.active, stats.total]
  );

  const cards = [
    {
      label: t.pages.sales.pos.stats.total,
      value: stats.total,
      icon: Store,
      gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
      border: "border-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/15",
      valueColor: "text-blue-600 dark:text-blue-400",
      ringColor: "stroke-blue-500/30",
      ringActiveColor: "stroke-blue-500",
    },
    {
      label: t.pages.sales.pos.stats.active,
      value: stats.active,
      icon: CheckCircle2,
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/15",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      ringColor: "stroke-emerald-500/30",
      ringActiveColor: "stroke-emerald-500",
      percent: activePercent,
    },
    {
      label: t.pages.sales.pos.stats.inactive,
      value: stats.inactive,
      icon: XCircle,
      gradient: "from-rose-500/15 via-rose-500/5 to-transparent",
      border: "border-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/15",
      valueColor: "text-rose-600 dark:text-rose-400",
      ringColor: "stroke-rose-500/30",
      ringActiveColor: "stroke-rose-500",
      percent: stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0,
    },
    {
      label: t.pages.sales.pos.stats.thisMonth,
      value: stats.this_month,
      icon: CalendarDays,
      gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
      border: "border-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500/15",
      valueColor: "text-violet-600 dark:text-violet-400",
      ringColor: "stroke-violet-500/30",
      ringActiveColor: "stroke-violet-500",
      growth: stats.growth_rate,
    },
  ];

  // Extra admin cards
  if (isAdmin && stats.recent_7d !== undefined) {
    cards.push({
      label: language === "fr" ? "7 derniers jours" : "Last 7 days",
      value: stats.recent_7d,
      icon: Zap,
      gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
      border: "border-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/15",
      valueColor: "text-amber-600 dark:text-amber-400",
      ringColor: "stroke-amber-500/30",
      ringActiveColor: "stroke-amber-500",
    });
  }

  return (
    <div className={`grid gap-3 mb-6 ${isAdmin ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const percent = (card as any).percent;
        const growth = (card as any).growth;

        return (
          <div
            key={card.label}
            className={`
              relative rounded-2xl border ${card.border} 
              bg-gradient-to-br ${card.gradient}
              backdrop-blur-sm p-5
              transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1
              overflow-hidden group cursor-default
              animate-in fade-in slide-in-from-bottom-4
            `}
            style={{ animationDelay: `${idx * 80}ms`, animationDuration: "500ms" }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-80 rounded-2xl`} />
            </div>

            {/* Decorative corner */}
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-current/5 to-transparent opacity-50" />

            <div className="relative flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
                  {card.label}
                </span>
                <span className={`p-2 rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </span>
              </div>

              <div className="flex items-end justify-between gap-2">
                <div>
                  <span className={`text-3xl font-black ${card.valueColor} tabular-nums tracking-tight`}>
                    {card.value.toLocaleString()}
                  </span>
                  {/* Percentage */}
                  {percent !== undefined && (
                    <span className="text-xs text-muted-foreground ml-2 font-semibold">
                      ({percent}%)
                    </span>
                  )}
                </div>

                {/* Growth indicator */}
                {growth !== undefined && (
                  <div
                    className={`flex items-center gap-0.5 text-xs font-bold rounded-full px-2 py-0.5 ${
                      growth > 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : growth < 0
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {growth > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : growth < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {growth > 0 ? "+" : ""}
                    {growth}%
                  </div>
                )}
              </div>

              {/* Mini progress bar */}
              {percent !== undefined && (
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      card.ringActiveColor.replace("stroke-", "bg-")
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
