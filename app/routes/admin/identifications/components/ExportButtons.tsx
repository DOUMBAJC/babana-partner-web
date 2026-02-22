import { Download, FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useActivationExport } from "../hooks/useActivationExport";
import { useTranslation } from "~/hooks";
import { cn } from "~/lib/utils";

interface ExportButtonsProps {
  className?: string;
}

export function ExportButtons({ className }: ExportButtonsProps) {
  const { t } = useTranslation();
  const { handleExport, isExporting } = useActivationExport();

  const exportingAny = Object.values(isExporting).some(Boolean);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors", className)}
          disabled={exportingAny}
        >
          {exportingAny ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
          Formats disponibles
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          disabled={isExporting.excel || isExporting.xlsx}
          className="gap-2 py-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Excel (.xlsx)</span>
          </div>
          {(isExporting.excel || isExporting.xlsx) && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          disabled={isExporting.csv}
          className="gap-2 py-2 cursor-pointer"
        >
          <FileDown className="h-4 w-4 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">CSV (.csv)</span>
          </div>
          {isExporting.csv && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={isExporting.pdf}
          className="gap-2 py-2 cursor-pointer"
        >
          <FileText className="h-4 w-4 text-red-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">PDF (.pdf)</span>
          </div>
          {isExporting.pdf && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
