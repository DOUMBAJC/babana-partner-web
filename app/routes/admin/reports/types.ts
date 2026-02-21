/**
 * Types pour la page des rapports et statistiques
 */

export interface ReportsStats {
  overview: {
    total: number;
    pending: number;
    processing: number;
    activated: number;
    rejected: number;
    cancelled: number;
  };
  temporal: {
    today: {
      total: number;
      activated: number;
      rejected: number;
    };
    this_week: {
      total: number;
      activated: number;
      rejected: number;
    };
    this_month: {
      total: number;
      activated: number;
      rejected: number;
    };
  };
  performance: {
    success_rate: number;
    avg_processing_time_minutes: number | null;
    total_processed: number;
    trend_success_rate?: 'up' | 'down' | 'stable';
  };
  by_ba: Array<{
    ba_id: string;
    ba_name: string;
    total: number;
    activated: number;
    rejected: number;
    pending: number;
    cancelled: number;
    rank?: number;
  }>;
  by_processor: Array<{
    processor_id: string;
    processor_name: string;
    processor_role?: string;
    total: number;
    activated: number;
    rejected: number;
  }>;
  generated_at: string;
}

export interface ReportsLoaderData {
  user: any;
  hasAccess: boolean;
  error: string | null;
  stats: ReportsStats | null;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

export type ExportFormat = "csv" | "pdf" | "excel";

export interface ExportParams {
  format: ExportFormat;
  dateFrom?: string | null;
  dateTo?: string | null;
  baId?: string | null;
}

