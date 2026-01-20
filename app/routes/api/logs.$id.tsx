import { data, type LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import type { ApiResponse } from "~/types";
import type { LogEntry } from "~/lib/services/log.service";

/**
 * Route API SSR pour le détail d'un log
 * GET /api/logs/:id
 * Proxie vers: GET /admin/logs/{id}
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const id = params.id;

    if (!id) {
      return data(
        {
          message: "ID du log manquant",
          status: 400,
        },
        { status: 400 },
      );
    }

    const response = await api.get<ApiResponse<LogEntry>>(`/admin/logs/${id}`);

    return data(response.data);
  } catch (error: any) {
    console.error("[API/LOGS] Error fetching log detail:", error);

    const status = error?.response?.status ?? 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur lors du chargement du log";

    return data(
      {
        message,
        status,
      },
      { status },
    );
  }
}


