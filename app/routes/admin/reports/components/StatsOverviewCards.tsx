import { Card, CardContent } from "~/components/ui/card";
import { TrendingUp, Clock, CheckCircle2, XCircle, Ban, Activity } from "lucide-react";

interface StatsOverviewCardsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    activated: number;
    rejected: number;
    cancelled: number;
  };
  temporal: {
    today: { total: number; activated: number; rejected: number };
    this_week: { total: number; activated: number; rejected: number };
    this_month: { total: number; activated: number; rejected: number };
  };
}

export function StatsOverviewCards({ stats, temporal }: StatsOverviewCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      trend: temporal.this_month.total,
      trendLabel: "Ce mois",
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-500/20",
      trend: temporal.today.total,
      trendLabel: "Aujourd'hui",
    },
    {
      title: "En traitement",
      value: stats.processing,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      trend: temporal.this_week.total,
      trendLabel: "Cette semaine",
    },
    {
      title: "Activées",
      value: stats.activated,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      trend: temporal.this_month?.activated ?? temporal.this_month?.total ?? 0,
      trendLabel: temporal.this_month?.activated !== undefined ? "Ce mois" : temporal.this_month?.total !== undefined ? "Ce mois (total)" : "",
    },
    {
      title: "Rejetées",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/10 to-rose-500/10",
      borderColor: "border-red-500/20",
      trend: temporal.this_month.rejected,
      trendLabel: "Ce mois",
    },
    {
      title: "Annulées",
      value: stats.cancelled,
      icon: Ban,
      color: "text-slate-600 dark:text-slate-400",
      bgGradient: "from-slate-500/10 to-gray-500/10",
      borderColor: "border-slate-500/20",
      trend: 0,
      trendLabel: "N/A",
    },
  ];

  // Helper pour garantir une valeur numérique valide
  const safeNumber = (value: any, defaultValue = 0): number => {
    const num = Number(value);
    return isFinite(num) ? num : defaultValue;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const cardValue = safeNumber(card.value, 0);
        const totalValue = safeNumber(stats.total, 0);
        const percentage = totalValue > 0
          ? Math.max(0, Math.min(100, (cardValue / totalValue) * 100)).toFixed(1)
          : "0";
        
        return (
          <Card
            key={index}
            className={`border-2 ${card.borderColor} bg-linear-to-br ${card.bgGradient} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden relative`}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${card.bgGradient} opacity-50`} />
            
            <CardContent className="relative p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
                </div>
                {card.trend > 0 && (
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${card.color}`}>
                  {cardValue.toLocaleString()}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{percentage}%</p>
                  {card.trend > 0 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{card.trendLabel}</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1 bg-background/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-linear-to-r ${card.bgGradient.replace("/10", "")} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

