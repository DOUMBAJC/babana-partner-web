/**
 * Hook personnalisé pour gérer l'export de fichiers
 */

import { useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import type { ExportFormat } from "../types";

export function useExport() {
  const location = useLocation();
  const [isExporting, setIsExporting] = useState<Record<string, boolean>>({});

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting((prev) => ({ ...prev, [format]: true }));
      toast.info(`Export ${format.toUpperCase()} en cours de préparation...`);

      // Récupérer les paramètres de filtre depuis l'URL
      const urlParams = new URLSearchParams(location.search);
      const dateFrom = urlParams.get("dateFrom");
      const dateTo = urlParams.get("dateTo");
      const baId = urlParams.get("baId");

      // Construire l'URL avec les paramètres
      const exportParams = new URLSearchParams();
      exportParams.set("format", format);
      if (dateFrom) exportParams.set("dateFrom", dateFrom);
      if (dateTo) exportParams.set("dateTo", dateTo);
      if (baId) exportParams.set("baId", baId);

      // Utiliser la route API dédiée pour l'export
      const exportUrl = `/api/reports/export?${exportParams.toString()}`;

      // Utiliser fetch avec credentials pour inclure les cookies
      const response = await fetch(exportUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        // Si c'est une erreur JSON
        if (response.headers.get("content-type")?.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || errorData.message || "Erreur lors de l'export"
          );
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer le blob
      const blob = await response.blob();

      // Récupérer le nom du fichier depuis les headers ou utiliser un nom par défaut
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `rapports-statistiques-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Créer un lien temporaire et déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsExporting((prev) => ({ ...prev, [format]: false }));
      toast.success(`Export ${format.toUpperCase()} téléchargé avec succès`);
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      setIsExporting((prev) => ({ ...prev, [format]: false }));
      toast.error(
        `Erreur lors de l'export ${format.toUpperCase()}: ${error.message || "Erreur inconnue"}`
      );
    }
  };

  return {
    handleExport,
    isExporting,
  };
}

