/**
 * Composant Header pour la page des rapports
 */

import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { BarChart3, RefreshCcw, ArrowLeft, Sparkles } from "lucide-react";
import { useTranslation } from "~/hooks";

interface ReportsHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function ReportsHeader({
  isRefreshing,
  onRefresh,
}: ReportsHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500/30 to-amber-500/30 blur-xl" />
            <div className="relative rounded-xl sm:rounded-2xl border border-orange-500/20 bg-card p-2 sm:p-3 shadow-sm">
              <BarChart3 className="h-5 w-5 sm:h-7 sm:w-7 text-orange-500" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground wrap-break-word flex items-center gap-2">
              {t.reports.title}
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500 animate-pulse shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">
              {t.reports.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
          size="sm"
          className="text-xs sm:text-sm sm:size-default"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">{t.reports.actions.back}</span>
        </Button>
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98] transition-transform text-xs sm:text-sm sm:size-default"
          onClick={onRefresh}
          disabled={isRefreshing}
          size="sm"
        >
          <RefreshCcw
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">
            {isRefreshing ? t.reports.actions.refreshing : t.reports.actions.refresh}
          </span>
        </Button>
      </div>
    </div>
  );
}

