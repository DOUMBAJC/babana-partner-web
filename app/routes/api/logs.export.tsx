import type { LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";

/**
 * Route API SSR pour l'export des logs
 * GET /api/logs/export?level=&type=&search=&dateFrom=&dateTo=
 * Proxie vers: GET /admin/logs/export
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const url = new URL(request.url);

    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const response = await api.get("/admin/logs/export", {
      params,
      responseType: "arraybuffer",
    });

    const backendHeaders = response.headers || {};
    const contentType =
      backendHeaders["content-type"] ||
      backendHeaders["Content-Type"] ||
      "text/csv";

    const contentDisposition =
      backendHeaders["content-disposition"] ||
      backendHeaders["Content-Disposition"] ||
      `attachment; filename="logs-${new Date()
        .toISOString()
        .split("T")[0]}.csv"`;

    const responseHeaders: HeadersInit = {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    };

    return new Response(response.data as ArrayBuffer, {
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("[API/LOGS] Error exporting logs:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur lors de l'export des logs";

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: error?.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}


