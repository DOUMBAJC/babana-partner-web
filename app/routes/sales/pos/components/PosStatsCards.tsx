import { useTranslation } from "~/hooks";
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  CalendarDays 
} from "lucide-react";

interface PosStats {
  total: number;
  active: number;
  inactive: number;
  this_month: number;
}

interface PosStatsCardsProps {
  stats: PosStats;
}

export function PosStatsCards({ stats }: PosStatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t.pages.sales.pos.stats.total,
      value: stats.total,
      icon: Store,
      gradient: "from-primary/10 via-primary/5 to-transparent",
      border: "border-primary/20",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      valueColor: "text-primary",
    },
    {
      label: t.pages.sales.pos.stats.active,
      value: stats.active,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: t.pages.sales.pos.stats.inactive,
      value: stats.inactive,
      icon: XCircle,
      gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
      border: "border-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10",
      valueColor: "text-rose-600 dark:text-rose-400",
    },
    {
      label: t.pages.sales.pos.stats.thisMonth,
      value: stats.this_month,
      icon: CalendarDays,
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      border: "border-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500/10",
      valueColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`
              relative rounded-xl border ${card.border} 
              bg-gradient-to-br ${card.gradient}
              backdrop-blur-sm p-4
              transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
              overflow-hidden group
            `}
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 rounded-xl`} />
            </div>

            <div className="relative flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  {card.label}
                </span>
                <span className={`p-1.5 rounded-lg ${card.iconBg}`}>
                  <Icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
                </span>
              </div>
              <div>
                <span className={`text-2xl font-bold ${card.valueColor} tabular-nums`}>
                  {card.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
