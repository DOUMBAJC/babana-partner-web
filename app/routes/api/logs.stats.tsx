import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import type { ApiResponse } from "~/types";
import type { LogStats } from "~/lib/services/log.service";

/**
 * Route API SSR pour les statistiques des logs
 * GET /api/logs/stats?level=&type=&search=
 * Proxie vers: GET /admin/logs/stats
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const url = new URL(request.url);

    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const response = await api.get<ApiResponse<LogStats>>("/admin/logs/stats", {
      params,
    });

    return data(response.data);
  } catch (error: any) {
    console.error("[API/LOGS] Error fetching log stats:", error);

    const status = error?.response?.status ?? 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur lors du chargement des statistiques de logs";

    return data(
      {
        message,
        status,
      },
      { status },
    );
  }
}


