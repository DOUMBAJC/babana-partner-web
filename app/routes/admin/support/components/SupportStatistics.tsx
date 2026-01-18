import { Card, CardContent, CardHeader, CardTitle } from "~/components";
import { 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Info,
  TrendingUp
} from "lucide-react";
import type { SupportTicketStatistics } from "~/lib/services/support.service";

interface SupportStatisticsProps {
  statistics: SupportTicketStatistics;
}

export function SupportStatistics({ statistics }: SupportStatisticsProps) {
  const total = statistics.total || 0;
  
  // Calculer les pourcentages
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statusCards = [
    {
      title: "Total",
      value: statistics.total,
      icon: MessageSquare,
      color: "text-babana-cyan",
      bgGradient: "from-babana-cyan/20 to-babana-blue/20",
      borderColor: "border-babana-cyan/30",
      percentage: 100,
    },
    {
      title: "Ouverts",
      value: statistics.open,
      icon: AlertCircle,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      percentage: getPercentage(statistics.open),
    },
    {
      title: "En cours",
      value: statistics.in_progress,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      percentage: getPercentage(statistics.in_progress),
    },
    {
      title: "Résolus",
      value: statistics.resolved,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      percentage: getPercentage(statistics.resolved),
    },
    {
      title: "Fermés",
      value: statistics.closed,
      icon: XCircle,
      color: "text-slate-600 dark:text-slate-400",
      bgGradient: "from-slate-500/20 to-gray-500/20",
      borderColor: "border-slate-500/30",
      percentage: getPercentage(statistics.closed),
    },
  ];

  const priorityCards = [
    {
      title: "Urgente",
      value: statistics.by_priority?.urgent || 0,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/20 to-rose-500/20",
      borderColor: "border-red-500/30",
      percentage: getPercentage(statistics.by_priority?.urgent || 0),
    },
    {
      title: "Haute",
      value: statistics.by_priority?.high || 0,
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400",
      bgGradient: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      percentage: getPercentage(statistics.by_priority?.high || 0),
    },
    {
      title: "Normale",
      value: statistics.by_priority?.normal || 0,
      icon: Info,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      percentage: getPercentage(statistics.by_priority?.normal || 0),
    },
    {
      title: "Basse",
      value: statistics.by_priority?.low || 0,
      icon: Info,
      color: "text-slate-600 dark:text-slate-400",
      bgGradient: "from-slate-500/20 to-gray-500/20",
      borderColor: "border-slate-500/30",
      percentage: getPercentage(statistics.by_priority?.low || 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques par statut */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-babana-cyan" />
          Statistiques par statut
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`border-2 ${card.borderColor} bg-card/80 dark:bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${card.bgGradient} opacity-50 rounded-lg`} />
                <CardContent className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-background/60 backdrop-blur-sm`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.percentage}%</p>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-background/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${card.bgGradient.replace("/20", "")} transition-all duration-500`}
                      style={{ width: `${card.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Statistiques par priorité */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-babana-cyan" />
          Statistiques par priorité
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`border-2 ${card.borderColor} bg-card/80 dark:bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${card.bgGradient} opacity-50 rounded-lg`} />
                <CardContent className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-background/60 backdrop-blur-sm`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.percentage}%</p>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-background/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${card.bgGradient.replace("/20", "")} transition-all duration-500`}
                      style={{ width: `${card.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

