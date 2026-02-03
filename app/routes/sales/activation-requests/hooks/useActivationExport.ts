import { useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import axiosInstance from "~/lib/http/axios";
import { downloadFile, parseErrorFromBlob } from "~/lib/http/download-utility";

export type ExportFormat = "csv" | "excel" | "xlsx" | "pdf";

/**
 * Hook spécialisé pour gérer l'export des requêtes d'activation
 * Communique avec ActivationRequestController@export
 */
export function useActivationExport() {
  const location = useLocation();
  const [isExporting, setIsExporting] = useState<Record<string, boolean>>({});

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting((prev) => ({ ...prev, [format]: true }));
      toast.info(`Export ${format.toUpperCase()} en cours de préparation...`);

      // Récupérer les paramètres de filtre depuis l'URL actuelle
      const urlParams = new URLSearchParams(location.search);
      
      // Mapping des paramètres attendus par le backend (Laravel)
      const params: Record<string, string> = {};
      
      const status = urlParams.get("status");
      const dateFrom = urlParams.get("dateFrom");
      const dateTo = urlParams.get("dateTo");
      const search = urlParams.get("search");
      const mine = urlParams.get("mine");

      if (status) params.status = status;
      if (dateFrom) params.start_date = dateFrom;
      if (dateTo) params.end_date = dateTo;
      if (search) params.search = search;
      if (mine) params.mine = mine;

      // Appel API avec responseType custom pour gérer les fichiers binaires
      const response = await axiosInstance.get(`/activation-requests/export/${format}`, {
        params,
        responseType: "blob",
      });

      // Récupérer le nom du fichier depuis les headers ou utiliser un nom générique
      const contentDisposition = response.headers["content-disposition"];
      const dateStr = new Date().toISOString().split("T")[0];
      const defaultFilename = `requetes-activation-${dateStr}.${format === "excel" ? "xlsx" : format}`;
      
      // Utiliser l'utilité pour déclencher le téléchargement
      downloadFile(response.data, defaultFilename, contentDisposition);
      
      toast.success(`Export ${format.toUpperCase()} téléchargé avec succès`);
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      
      let errorMessage = "Une erreur est survenue lors de la génération de l'export";
      
      // Tenter d'extraire le message d'erreur si le backend a renvoyé du JSON (même en blob)
      if (error.response?.data instanceof Blob) {
        const serverMessage = await parseErrorFromBlob(error.response.data);
        if (serverMessage) errorMessage = serverMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsExporting((prev) => ({ ...prev, [format]: false }));
    }
  };

  return {
    handleExport,
    isExporting,
  };
}
