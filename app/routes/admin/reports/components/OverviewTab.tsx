import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, PieChart, Users, Trophy, Award, Zap } from "lucide-react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { BusinessAdvisorTable } from "./BusinessAdvisorTable";
import { Badge } from "~/components/ui/badge";
import type { ReportsStats } from "../types";

interface OverviewTabProps {
  stats: ReportsStats;
}

export function OverviewTab({ stats }: OverviewTabProps) {
  // Trouver les meilleurs performeurs
  const topBA = stats.by_ba && stats.by_ba.length > 0 
    ? [...stats.by_ba].sort((a, b) => (b.activated || 0) - (a.activated || 0))[0] 
    : null;
  
  const topProcessor = stats.by_processor && stats.by_processor.length > 0
    ? [...stats.by_processor].sort((a, b) => (b.total || 0) - (a.total || 0))[0]
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Podium / Highlights - Premium Design */}
      {(topBA || topProcessor) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {topBA && (
            <Card className="group relative border-orange-500/20 bg-linear-to-br from-orange-500/5 via-orange-500/10 to-amber-500/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:scale-[1.01]">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="h-24 w-24 text-orange-500 rotate-12" />
              </div>
              <CardContent className="p-5 flex items-center gap-5 relative z-10">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-orange-500 flex items-center justify-center">
                    <span className="text-[10px] font-black text-orange-600">#1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px] uppercase font-bold tracking-tighter">
                      Meilleur Conseiller
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">{topBA.ba_name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-orange-500">{topBA.activated}</span>
                    <span className="text-xs font-medium text-muted-foreground">Activations validées</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {topProcessor && (
            <Card className="group relative border-blue-500/20 bg-linear-to-br from-blue-500/5 via-blue-500/10 to-cyan-500/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:scale-[1.01]">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="h-24 w-24 text-blue-500 -rotate-12" />
              </div>
              <CardContent className="p-5 flex items-center gap-5 relative z-10">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-blue-500 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] uppercase font-bold tracking-tighter">
                      Performance Traitement
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">{topProcessor.processor_name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-blue-500">{topProcessor.total}</span>
                    <span className="text-xs font-medium text-muted-foreground">Dossiers finalisés</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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

