/**
 * Loaders pour la page des rapports
 */

import { data } from "react-router";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { hasPermission } from "~/lib/permissions";
import { getTranslations, type Language } from "~/lib/translations";
import type { Route } from "./+types/route";
import type { ReportsLoaderData } from "./types";
import { normalizeStats, createDefaultStats } from "./utils/stats-normalizer";

/**
 * Loader principal pour charger les données des rapports
 */
export async function loader({ request }: Route.LoaderArgs) {
  return loadReportsData(request);
}

/**
 * Charge les données des rapports
 */
async function loadReportsData(request: Request) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data<ReportsLoaderData>({
        user: null,
        hasAccess: false,
        error: null,
        stats: null,
        dateRange: { from: null, to: null },
      });
    }

    const canViewReports =
      hasPermission(user, "view-reports") ||
      hasPermission(user, "admin-access");

    if (!canViewReports) {
      return data<ReportsLoaderData>({
        user,
        hasAccess: false,
        error:
          "Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder aux rapports.",
        stats: null,
        dateRange: { from: null, to: null },
      });
    }

    const url = new URL(request.url);
    const dateFrom = url.searchParams.get("dateFrom") || null;
    const dateTo = url.searchParams.get("dateTo") || null;
    const baId = url.searchParams.get("baId") || null;

    const api = await createAuthenticatedApi(request);

    // Construire les paramètres de requête
    const params: any = {};
    if (dateFrom) params.start_date = dateFrom;
    if (dateTo) params.end_date = dateTo;
    if (baId) params.ba_id = baId;

    // Récupérer les statistiques
    const statsResponse = await api.get("/activation-requests/stats", {
      params,
    });

    // Normaliser les données
    const normalizedStats = normalizeStats(
      statsResponse.data,
      dateFrom,
      dateTo
    );

    return data<ReportsLoaderData>({
      user,
      hasAccess: true,
      error: null,
      stats: normalizedStats,
      dateRange: { from: dateFrom, to: dateTo },
    });
  } catch (error: any) {
    return data<ReportsLoaderData>(
      {
        user: null,
        hasAccess: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Erreur lors du chargement des données",
        stats: null,
        dateRange: { from: null, to: null },
      },
      { status: 500 }
    );
  }
}

