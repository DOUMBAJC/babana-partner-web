import { useState } from "react";
import type { Route } from "./+types/route";
import { Layout, ProtectedRoute, Toaster } from "~/components";
import { usePageTitle, useTranslation } from "~/hooks";
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
import type { ReportsStats } from "./types";
import { loader } from "./loaders";

// Exporter le loader depuis loaders.ts
export { loader };

export default function ReportsPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle(t.reports.title);

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
        title={t.reports.errors.accessDeniedTitle}
        message={loaderData.error || t.reports.errors.accessDenied}
      />
    );
  }

  if (loaderData.error && !loaderData.stats) {
    return <AccessDenied title={t.reports.errors.errorTitle} message={loaderData.error} />;
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
            className="space-y-4 sm:space-y-8"
          >
            <div className="flex items-center justify-center sm:justify-start overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <TabsList className="flex w-fit bg-muted/40 backdrop-blur-sm p-1 gap-1 rounded-xl border border-border/50">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-lg px-4 py-2 text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-orange-500/20"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  <span>{t.reports.tabs.overview}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="rounded-lg px-4 py-2 text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-orange-500/20"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>{t.reports.tabs.performance}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="rounded-lg px-4 py-2 text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-orange-500/20"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  <span>{t.reports.tabs.analytics}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="export" 
                  className="rounded-lg px-4 py-2 text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-orange-500 data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-orange-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span>{t.reports.tabs.export}</span>
                </TabsTrigger>
              </TabsList>
            </div>

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

