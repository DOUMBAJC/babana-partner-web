/**
 * Composant pour l'onglet Analytique
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Activity, Zap, TrendingUp, TrendingDown } from "lucide-react";
import type { ReportsStats } from "../types";

interface AnalyticsTabProps {
  stats: ReportsStats;
}

export function AnalyticsTab({ stats }: AnalyticsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card className="border-orange-500/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Analyse détaillée
          </CardTitle>
          <CardDescription>Métriques avancées et insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Taux de conversion</span>
              <Badge variant="outline" className="text-sm font-bold">
                {stats.performance?.success_rate?.toFixed(1) || 0}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">
                Temps moyen de traitement
              </span>
              <Badge variant="outline" className="text-sm font-bold">
                {(() => {
                  const avgTime = stats.performance?.avg_processing_time_minutes;
                  if (
                    avgTime === null ||
                    avgTime === undefined ||
                    isNaN(avgTime) ||
                    avgTime < 0
                  ) {
                    return "N/A";
                  }
                  const absMinutes = Math.abs(avgTime);
                  const hours = Math.floor(absMinutes / 60);
                  const mins = Math.floor(absMinutes % 60);
                  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
                })()}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Total traité</span>
              <Badge variant="outline" className="text-sm font-bold">
                {stats.performance?.total_processed || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-500/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Tendances
          </CardTitle>
          <CardDescription>Évolution des indicateurs clés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Requêtes activées
                </span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {stats.overview.activated}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.overview.total > 0
                  ? ((stats.overview.activated / stats.overview.total) * 100).toFixed(1)
                  : 0}
                % du total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-linear-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Requêtes rejetées
                </span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {stats.overview.rejected}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.overview.total > 0
                  ? ((stats.overview.rejected / stats.overview.total) * 100).toFixed(1)
                  : 0}
                % du total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

