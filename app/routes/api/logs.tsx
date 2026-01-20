import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import type { PaginatedResponse } from "~/types";
import type { LogEntry } from "~/lib/services/log.service";

/**
 * Route API SSR pour la liste des logs
 * GET /api/logs?level=&type=&search=&page=&perPage=
 * Proxie vers: GET /admin/logs
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const url = new URL(request.url);

    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const response = await api.get<PaginatedResponse<LogEntry>>("/admin/logs", {
      params,
    });

    return data(response.data);
  } catch (error: any) {
    console.error("[API/LOGS] Error fetching logs:", error);

    const status = error?.response?.status ?? 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur lors du chargement des logs";

    return data(
      {
        message,
        status,
      },
      { status },
    );
  }
}


