import { useState } from "react";
import type { Route } from "./+types/route";
import { Layout, ProtectedRoute, Toaster } from "~/components";
import { usePageTitle } from "~/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components";
import { Download, Activity, TrendingUp, PieChart } from "lucide-react";
import {
  StatsOverviewCards,
  PerformanceMetrics,
  ReportsFilters,
  ReportsHeader,
  OverviewTab,
  AnalyticsTab,
  ExportTab,
  ReportsFooter,
  AccessDenied,
} from "./components";
import { useExport } from "./hooks/useExport";
import { createDefaultStats } from "./utils/stats-normalizer";
import type { ReportsLoaderData, ReportsStats } from "./types";
import { loader } from "./loaders";

// Exporter le loader depuis loaders.ts
export { loader };

export default function ReportsPage({ loaderData }: Route.ComponentProps) {
  usePageTitle("Rapports et Statistiques");

  // Si loaderData n'est pas un LoaderData (c'est une Response ou une erreur d'export), ne pas rendre le composant
  if (!loaderData || typeof loaderData !== "object" || !("hasAccess" in loaderData)) {
    return null;
  }

  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "analytics" | "export">("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { handleExport, isExporting } = useExport();

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Gérer les cas d'erreur et d'accès refusé
  if (!loaderData.hasAccess) {
    return (
      <AccessDenied
        title="Accès refusé"
        message={loaderData.error || "Vous n'avez pas les permissions nécessaires pour accéder à cette page."}
      />
    );
  }

  if (loaderData.error && !loaderData.stats) {
    return <AccessDenied title="Erreur" message={loaderData.error} />;
  }

  // Utiliser les stats normalisées ou des valeurs par défaut
  const stats: ReportsStats = loaderData.stats || createDefaultStats();

  return (
    <Layout>
      <Toaster />
      <ProtectedRoute permission="view-reports">
        <div className="container mx-auto space-y-4 sm:space-y-6 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
          <ReportsHeader isRefreshing={isRefreshing} onRefresh={handleRefresh} />

          <ReportsFilters
            dateFrom={loaderData.dateRange.from}
            dateTo={loaderData.dateRange.to}
          />

          <StatsOverviewCards stats={stats.overview} temporal={stats.temporal} />

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-3">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
                <span className="sm:hidden">Vue</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs sm:text-sm py-2 sm:py-3">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Performance</span>
                <span className="sm:hidden">Perf</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3">
                <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Analytique</span>
                <span className="sm:hidden">Anal</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm py-2 sm:py-3">
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Exp</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <OverviewTab stats={stats} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 sm:space-y-6">
              <PerformanceMetrics performance={stats.performance} overview={stats.overview} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
              <AnalyticsTab stats={stats} />
            </TabsContent>

            <TabsContent value="export" className="space-y-4 sm:space-y-6">
              <ExportTab isExporting={isExporting} onExport={handleExport} />
            </TabsContent>
          </Tabs>

          <ReportsFooter stats={stats} />
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

