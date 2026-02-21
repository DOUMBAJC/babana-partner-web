import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { TrendingUp, Clock, Target, Zap } from "lucide-react";

interface PerformanceMetricsProps {
  performance: {
    success_rate: number;
    avg_processing_time_minutes: number | null;
    total_processed: number;
    trend_success_rate?: string | null;
  };
  overview: {
    total: number;
    activated: number;
    rejected: number;
  };
}

export function PerformanceMetrics({ performance, overview }: PerformanceMetricsProps) {
  const successRate = performance.success_rate || 0;
  const avgTime = performance.avg_processing_time_minutes;
  const totalProcessed = performance.total_processed || 0;
  const rejectionRate = overview.total > 0 ? ((overview.rejected / overview.total) * 100).toFixed(1) : "0";

  // Valider et formater le temps moyen de traitement
  const formatProcessingTime = (minutes: number | null): { value: string; progress: number } => {
    // Vérifier si la valeur est valide (positive et numérique)
    if (minutes === null || minutes === undefined || isNaN(minutes) || minutes < 0) {
      return { value: "N/A", progress: 0 };
    }

    // Convertir en valeur absolue pour éviter les problèmes avec les valeurs négatives
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = Math.floor(absMinutes % 60);

    // Formater l'affichage
    if (hours > 0) {
      return {
        value: `${hours}h ${mins}min`,
        progress: Math.min((absMinutes / 120) * 100, 100), // Assuming 2h is max
      };
    } else {
      return {
        value: `${mins}min`,
        progress: Math.min((absMinutes / 120) * 100, 100),
      };
    }
  };

  const processingTimeData = formatProcessingTime(avgTime);

  const metrics = [
    {
      title: "Taux de succès",
      value: `${successRate.toFixed(1)}%`,
      icon: Target,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      description: "Pourcentage de requêtes activées avec succès",
      progress: successRate,
    },
    {
      title: "Temps moyen de traitement",
      value: processingTimeData.value,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      description: "Durée moyenne entre la soumission et le traitement",
      progress: processingTimeData.progress,
    },
    {
      title: "Total traité",
      value: totalProcessed.toLocaleString(),
      icon: Zap,
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      description: "Nombre total de requêtes traitées",
      progress: overview.total > 0 ? (totalProcessed / overview.total) * 100 : 0,
    },
    {
      title: "Taux de rejet",
      value: `${rejectionRate}%`,
      icon: TrendingUp,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500/10 to-rose-500/10",
      borderColor: "border-red-500/20",
      description: "Pourcentage de requêtes rejetées",
      progress: parseFloat(rejectionRate),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className={`border-2 ${metric.borderColor} bg-linear-to-br ${metric.bgGradient} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden relative`}
          >
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-background/60 backdrop-blur-sm`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <CardTitle className="text-sm sm:text-base mt-2">{metric.title}</CardTitle>
              <CardDescription className="text-xs">{metric.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <div className="flex items-end justify-between">
                <p className={`text-2xl sm:text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
                {metric.title === "Taux de succès" && performance.trend_success_rate && (
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                    performance.trend_success_rate === 'up'
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                    {performance.trend_success_rate === 'up' ? '↑' : '↓'}
                    {performance.trend_success_rate === 'up' ? '+2.4%' : '-1.2%'}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progression</span>
                  <span>{metric.progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-background/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${metric.bgGradient.replace("/10", "")} transition-all duration-500`}
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

