/**
 * Composant pour l'onglet Vue d'ensemble
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, PieChart, Users } from "lucide-react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { BusinessAdvisorTable } from "./BusinessAdvisorTable";
import type { ReportsStats } from "../types";

interface OverviewTabProps {
  stats: ReportsStats;
}

export function OverviewTab({ stats }: OverviewTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Time Series Chart */}
        <Card className="border-orange-500/15 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-orange-500/5 via-transparent to-amber-500/5" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-orange-500" />
                    Évolution temporelle
                  </CardTitle>
                  <CardDescription>
                    Analyse des requêtes sur différentes périodes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <TimeSeriesChart data={stats.temporal} />
            </CardContent>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="border-orange-500/15 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-orange-500/5 via-transparent to-amber-500/5" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-orange-500" />
                    Répartition par statut
                  </CardTitle>
                  <CardDescription>
                    Distribution des requêtes selon leur statut
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <StatusDistributionChart data={stats.overview} />
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Business Advisors Table */}
      {stats.by_ba && stats.by_ba.length > 0 && (
        <Card className="border-orange-500/15 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-orange-500/5 via-transparent to-amber-500/5" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Performance par Conseiller d'Affaires
              </CardTitle>
              <CardDescription>Statistiques détaillées par BA</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <BusinessAdvisorTable data={stats.by_ba} />
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}

