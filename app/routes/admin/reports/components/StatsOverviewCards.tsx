import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TrendingUp, Clock, CheckCircle2, XCircle, Ban, Activity } from "lucide-react";
import { useTranslation } from "~/hooks";

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
  const { t } = useTranslation();

  const cards = [
    {
      title: t.reports.stats.totalCard,
      value: stats.total,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      trend: temporal.this_month.total,
      trendLabel: t.reports.stats.trends.thisMonth,
    },
    {
      title: t.reports.stats.pending,
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-500/20",
      trend: temporal.today.total,
      trendLabel: t.reports.stats.trends.today,
    },
    {
      title: t.reports.stats.processing,
      value: stats.processing,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      trend: temporal.this_week.total,
      trendLabel: t.reports.stats.trends.thisWeek,
    },
    {
      title: t.reports.stats.activated,
      value: stats.activated,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      trend: temporal.this_month?.activated ?? temporal.this_month?.total ?? 0,
      trendLabel: temporal.this_month?.activated !== undefined ? t.reports.stats.trends.thisMonth : temporal.this_month?.total !== undefined ? t.reports.stats.trends.thisMonthTotal : "",
    },
    {
      title: t.reports.stats.rejected,
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/10 to-rose-500/10",
      borderColor: "border-red-500/20",
      trend: temporal.this_month.rejected,
      trendLabel: t.reports.stats.trends.thisMonth,
    },
    {
      title: t.reports.stats.cancelled,
      value: stats.cancelled,
      icon: Ban,
      color: "text-slate-600 dark:text-slate-400",
      bgGradient: "from-slate-500/10 to-gray-500/10",
      borderColor: "border-slate-500/20",
      trend: 0,
      trendLabel: t.reports.stats.trends.notAvailable,
    },
  ];

  // Helper pour garantir une valeur numérique valide
  const safeNumber = (value: any, defaultValue = 0): number => {
    const num = Number(value);
    return isFinite(num) ? num : defaultValue;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
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
            className={`group border ${card.borderColor} bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all duration-500 hover:shadow-xl hover:shadow-background/20 relative overflow-hidden`}
          >
            {/* Soft Glow Background */}
            <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-linear-to-br ${card.bgGradient} blur-2xl opacity-40 transition-opacity group-hover:opacity-70`} />
            
            <CardContent className="relative p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-background/80 shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
                </div>
                {card.trend > 0 && (
                  <Badge variant="outline" className="h-5 px-1 bg-background/50 text-[9px] border-border/50">
                    <TrendingUp className="h-2.5 w-2.5 mr-0.5 text-green-500" />
                    TREND
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1.5 text-left">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{card.title}</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tighter ${card.color}`}>
                  {cardValue.toLocaleString()}
                </p>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground">{percentage}%</span>
                    <div className="w-8 h-1 bg-muted rounded-full">
                       <div 
                         className={`h-full bg-current rounded-full ${card.color}`} 
                         style={{ width: `${percentage}%` }} 
                       />
                    </div>
                  </div>
                  {card.trend > 0 && (
                    <span className="text-[9px] font-medium text-muted-foreground/60 whitespace-nowrap">{card.trendLabel}</span>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Bottom Glow Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${card.bgGradient.replace("/10", "/40")} opacity-50 group-hover:opacity-100 transition-opacity`} />
          </Card>
        );
      })}
    </div>
  );
}

