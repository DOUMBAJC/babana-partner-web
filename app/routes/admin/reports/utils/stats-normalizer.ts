/**
 * Utilitaires pour normaliser les données de statistiques de l'API
 */

import type { ReportsStats } from "../types";

interface RawStats {
  overview?: {
    total?: number;
    pending?: number;
    processing?: number;
    activated?: number;
    approved?: number;
    rejected?: number;
    cancelled?: number;
  };
  temporal?: {
    today?: { total?: number; activated?: number; rejected?: number };
    this_week?: { total?: number; activated?: number; rejected?: number };
    this_month?: { total?: number; activated?: number; rejected?: number };
  };
  performance?: {
    success_rate?: number;
    avg_processing_time_minutes?: number | null;
    total_processed?: number;
  };
  by_ba?: Array<{
    ba_id?: string;
    id?: string;
    ba_name?: string;
    name?: string;
    total?: number;
    activated?: number;
    approved?: number;
    rejected?: number;
    pending?: number;
    cancelled?: number;
  }>;
  generated_at?: string;
  total?: number;
  pending?: number;
  processing?: number;
  activated?: number;
  rejected?: number;
  cancelled?: number;
}

/**
 * Normalise les données brutes de l'API en format standardisé
 */
export function normalizeStats(
  rawStats: any,
  dateFrom?: string | null,
  dateTo?: string | null
): ReportsStats {
  const stats = rawStats?.data?.data || rawStats?.data || rawStats || {};

  // Calculer les valeurs overview
  const overview = {
    total: stats?.overview?.total ?? stats?.total ?? 0,
    pending: stats?.overview?.pending ?? stats?.pending ?? 0,
    processing: stats?.overview?.processing ?? stats?.processing ?? 0,
    activated: (stats?.overview?.activated ?? 0) + (stats?.overview?.approved ?? 0),
    rejected: stats?.overview?.rejected ?? stats?.rejected ?? 0,
    cancelled: stats?.overview?.cancelled ?? stats?.cancelled ?? 0,
  };

  // Normaliser les données temporelles
  const hasDateFilters = !!(dateFrom || dateTo);
  const temporalMonthTotal = stats?.temporal?.this_month?.total ?? 0;
  const useOverviewForMonth =
    hasDateFilters && temporalMonthTotal > overview.total;

  return {
    overview,
    temporal: {
      today: {
        total:
          stats?.temporal?.today?.total ??
          (stats?.temporal?.today ? 0 : undefined) ??
          0,
        activated:
          stats?.temporal?.today?.activated ??
          (stats?.temporal?.today ? 0 : undefined) ??
          0,
        rejected:
          stats?.temporal?.today?.rejected ??
          (stats?.temporal?.today ? 0 : undefined) ??
          0,
      },
      this_week: {
        total:
          stats?.temporal?.this_week?.total ??
          (stats?.temporal?.this_week ? 0 : undefined) ??
          0,
        activated:
          stats?.temporal?.this_week?.activated ??
          (stats?.temporal?.this_week ? 0 : undefined) ??
          0,
        rejected:
          stats?.temporal?.this_week?.rejected ??
          (stats?.temporal?.this_week ? 0 : undefined) ??
          0,
      },
      this_month: {
        total: useOverviewForMonth
          ? overview.total
          : stats?.temporal?.this_month?.total ??
            (hasDateFilters ? overview.total : 0),
        activated: useOverviewForMonth
          ? overview.activated
          : stats?.temporal?.this_month?.activated ??
            (hasDateFilters ? overview.activated : 0),
        rejected: useOverviewForMonth
          ? overview.rejected
          : stats?.temporal?.this_month?.rejected ??
            (hasDateFilters ? overview.rejected : 0),
      },
    },
    performance: {
      success_rate: stats?.performance?.success_rate ?? 0,
      avg_processing_time_minutes: (() => {
        const time = stats?.performance?.avg_processing_time_minutes;
        if (time === null || time === undefined || isNaN(time) || time < 0) {
          return null;
        }
        return time;
      })(),
      total_processed: stats?.performance?.total_processed ?? 0,
      trend_success_rate: stats?.performance?.trend_success_rate,
    },
    by_ba: Array.isArray(stats?.by_ba)
      ? stats.by_ba.map((ba: any) => ({
          ba_id: ba.ba_id ?? ba.id ?? "",
          ba_name: ba.ba_name ?? ba.name ?? "N/A",
          total: ba.total ?? 0,
          activated: ba.activated ?? ba.approved ?? 0,
          rejected: ba.rejected ?? 0,
          pending: ba.pending ?? 0,
          cancelled: ba.cancelled ?? 0,
          rank: ba.rank,
        }))
      : [],
    by_processor: Array.isArray(stats?.by_processor)
      ? stats.by_processor.map((p: any) => ({
          processor_id: p.processor_id ?? p.id ?? "",
          processor_name: p.processor_name ?? p.name ?? "N/A",
          processor_role: p.processor_role,
          total: p.total ?? 0,
          activated: p.activated ?? p.approved ?? 0,
          rejected: p.rejected ?? 0,
        }))
      : [],
    generated_at: stats?.generated_at || new Date().toISOString(),
  };
}

/**
 * Crée des statistiques par défaut (valeurs à zéro)
 */
export function createDefaultStats(): ReportsStats {
  return {
    overview: {
      total: 0,
      pending: 0,
      processing: 0,
      activated: 0,
      rejected: 0,
      cancelled: 0,
    },
    temporal: {
      today: { total: 0, activated: 0, rejected: 0 },
      this_week: { total: 0, activated: 0, rejected: 0 },
      this_month: { total: 0, activated: 0, rejected: 0 },
    },
    performance: {
      success_rate: 0,
      avg_processing_time_minutes: null,
      total_processed: 0,
    },
    by_ba: [],
    by_processor: [],
    generated_at: new Date().toISOString(),
  };
}

