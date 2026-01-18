/**
 * Composant pour l'onglet Export
 */

import { useState } from "react";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FileText, RefreshCcw, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { ExportFormat } from "../types";

interface ExportTabProps {
  isExporting: Record<string, boolean>;
  onExport: (format: ExportFormat) => void;
}

const SECRET_CODE = "babaNa";

export function ExportTab({ isExporting, onExport }: ExportTabProps) {
  const location = useLocation();
  const [secretCode, setSecretCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSecretExporting, setIsSecretExporting] = useState<Record<string, boolean>>({});

  const formats: Array<{ format: ExportFormat; label: string; description: string }> = [
    {
      format: "csv",
      label: "CSV",
      description: "Exportez les données brutes au format CSV",
    },
    {
      format: "excel",
      label: "Excel",
      description: "Générez un fichier Excel avec graphiques",
    },
    {
      format: "pdf",
      label: "PDF",
      description: "Créez un rapport PDF professionnel",
    },
  ];

  const secretFormats: Array<{ format: ExportFormat; label: string; description: string; emoji: string }> = [
    {
      format: "csv",
      label: "CSV Secret",
      description: "Export secret au format CSV",
      emoji: "🔐",
    },
    {
      format: "excel",
      label: "Excel Secret",
      description: "Export secret au format Excel",
      emoji: "✨",
    },
    {
      format: "pdf",
      label: "PDF Secret",
      description: "Export secret au format PDF",
      emoji: "🌟",
    },
  ];

  const handleSecretCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode.toLowerCase().trim() === SECRET_CODE.toLowerCase()) {
      setIsUnlocked(true);
      toast.success("🎉 Code secret validé ! Les boutons secrets sont maintenant disponibles.");
      setSecretCode("");
    } else {
      toast.error("❌ Code incorrect. Essayez encore !");
      setSecretCode("");
    }
  };

  const handleSecretExport = async (format: ExportFormat) => {
    try {
      setIsSecretExporting((prev) => ({ ...prev, [format]: true }));
      toast.info(`Export secret ${format.toUpperCase()} en cours de préparation...`);

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

      // Utiliser la route API dédiée pour l'export secret
      const exportUrl = `/api/reports/export-secret?${exportParams.toString()}`;

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
            errorData.error || errorData.message || "Erreur lors de l'export secret"
          );
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer le blob
      const blob = await response.blob();

      // Récupérer le nom du fichier depuis les headers ou utiliser un nom par défaut
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `rapports-secrets-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`;
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

      setIsSecretExporting((prev) => ({ ...prev, [format]: false }));
      toast.success(`🎉 Export secret ${format.toUpperCase()} téléchargé avec succès !`);
    } catch (error: any) {
      console.error("Erreur lors de l'export secret:", error);
      setIsSecretExporting((prev) => ({ ...prev, [format]: false }));
      toast.error(
        `Erreur lors de l'export secret ${format.toUpperCase()}: ${error.message || "Erreur inconnue"}`
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-500/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Exporter les données
          </CardTitle>
          <CardDescription>
            Générez des rapports dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formats.map(({ format, label, description }) => (
              <Button
                key={format}
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-3 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                onClick={() => onExport(format)}
                disabled={isExporting[format]}
              >
                <div className="flex items-center gap-2 w-full">
                  {isExporting[format] ? (
                    <RefreshCcw className="h-5 w-5 text-orange-500 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5 text-orange-500" />
                  )}
                  <span className="font-semibold">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  {isExporting[format] ? "Export en cours..." : description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section des boutons secrets */}
      <Card className={`border-purple-500/15 transition-all duration-500 ${isUnlocked ? "opacity-100" : "opacity-60"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className={`h-5 w-5 ${isUnlocked ? "text-purple-500" : "text-muted-foreground"}`} />
            <span className={isUnlocked ? "text-purple-500" : ""}>
              {isUnlocked ? "Exports Secrets Débloqués" : "Exports Secrets"}
            </span>
            {isUnlocked && <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
          </CardTitle>
          <CardDescription>
            {isUnlocked 
              ? "🎉 Accès aux exports secrets activé !" 
              : "Entrez le code secret pour débloquer les exports avancés"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isUnlocked ? (
            <form onSubmit={handleSecretCodeSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Entrez le code secret..."
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button type="submit" variant="outline" className="shrink-0">
                  Débloquer
                  <Lock className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Indice : Le code est lié au nom de l'application...
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Les exports secrets utilisent une fonctionnalité avancée du backend
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {secretFormats.map(({ format, label, description, emoji }) => (
                  <Button
                    key={format}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-3 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                    onClick={() => handleSecretExport(format)}
                    disabled={isSecretExporting[format]}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {isSecretExporting[format] ? (
                        <RefreshCcw className="h-5 w-5 text-purple-500 animate-spin" />
                      ) : (
                        <span className="text-2xl">{emoji}</span>
                      )}
                      <span className="font-semibold">{label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      {isSecretExporting[format] ? "Export secret en cours..." : description}
                    </p>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

