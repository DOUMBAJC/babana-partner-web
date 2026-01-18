import type { LoaderFunctionArgs } from "react-router";
import { createAuthenticatedApi } from "~/services/api.server";
import type { ExportFormat } from "~/routes/admin/reports/types";

const VALID_FORMATS: ExportFormat[] = ["csv", "pdf", "excel"];

/**
 * Détermine le content-type et l'extension selon le format
 */
function getExportMetadata(format: ExportFormat) {
  const extension = format === "excel" ? "xlsx" : format;
  const contentType =
    format === "csv"
      ? "text/csv"
      : format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return { extension, contentType };
}

/**
 * Génère le nom de fichier pour l'export
 */
function generateFilename(format: ExportFormat): string {
  const { extension } = getExportMetadata(format);
  const date = new Date().toISOString().split("T")[0];
  return `rapports-statistiques-${date}.${extension}`;
}

/**
 * Route API pour l'export de rapports
 * GET /api/reports/export?format=csv|excel|pdf&dateFrom=...&dateTo=...&baId=...
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format") as ExportFormat | null;
    
    // Valider le format
    if (!format || !VALID_FORMATS.includes(format)) {
      return new Response(
        JSON.stringify({ success: false, error: "Format d'export invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const api = await createAuthenticatedApi(request);

    // Construire les paramètres de requête pour l'API
    const apiParams: Record<string, string> = {};
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const baId = url.searchParams.get("baId");
    
    if (dateFrom) apiParams.start_date = dateFrom;
    if (dateTo) apiParams.end_date = dateTo;
    if (baId) apiParams.ba_id = baId;

    // Appeler l'API d'export
    const response = await api.get(
      `/activation-requests/export/${format}`,
      {
        params: apiParams,
        responseType: "arraybuffer",
      }
    );

    // Extraire les headers de la réponse du backend
    const backendHeaders = response.headers || {};
    
    // Utiliser le Content-Type du backend s'il est présent, sinon utiliser celui par défaut
    const { contentType: defaultContentType } = getExportMetadata(format);
    const contentType = 
      backendHeaders["content-type"] || 
      backendHeaders["Content-Type"] || 
      defaultContentType;

    // Extraire le Content-Disposition du backend s'il est présent
    const contentDisposition = 
      backendHeaders["content-disposition"] || 
      backendHeaders["Content-Disposition"];

    // Si le backend n'a pas fourni de Content-Disposition, en générer un par défaut
    const finalContentDisposition = contentDisposition || 
      `attachment; filename="${generateFilename(format)}"`;

    // Construire les headers de réponse
    const responseHeaders: HeadersInit = {
      "Content-Type": contentType,
      "Content-Disposition": finalContentDisposition,
    };

    // Retourner le fichier avec les headers appropriés
    return new Response(response.data as ArrayBuffer, {
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Erreur lors de l'export:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Erreur lors de l'export";
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: error?.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

