/**
 * Composant pour l'onglet Export
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileText, RefreshCcw } from "lucide-react";
import type { ExportFormat } from "../types";

interface ExportTabProps {
  isExporting: Record<string, boolean>;
  onExport: (format: ExportFormat) => void;
}

export function ExportTab({ isExporting, onExport }: ExportTabProps) {
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

  return (
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
  );
}

