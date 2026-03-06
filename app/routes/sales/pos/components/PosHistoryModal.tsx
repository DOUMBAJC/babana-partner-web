import { useState } from "react";
import { useFetcher } from "react-router";
import { useTranslation, useLanguage } from "~/hooks";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  History, 
  MapPin, 
  User, 
  Rocket, 
  RefreshCw,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface HistoryEntry {
  id: string;
  action: "deployed" | "redeployed";
  deployed_by: { id: string; name: string; email: string; avatar?: string } | null;
  old_latitude: string | null;
  old_longitude: string | null;
  new_latitude: string | null;
  new_longitude: string | null;
  old_agent: { id: string; name: string } | null;
  new_agent: { id: string; name: string } | null;
  note: string | null;
  created_at: string;
}

interface PosHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posId: string;
  posName: string;
  posNumber: string;
}

export function PosHistoryModal({
  open,
  onOpenChange,
  posId,
  posName,
  posNumber,
}: PosHistoryModalProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const fetcher = useFetcher<{ data: { data: HistoryEntry[] } }>();
  const [loaded, setLoaded] = useState(false);

  const dateLocale = language === "fr" ? fr : enUS;

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: dateLocale });
    } catch {
      return date;
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !loaded) {
      fetcher.load(`/sales/pos/${posId}/history`);
      setLoaded(true);
    }
    if (!isOpen) setLoaded(false);
    onOpenChange(isOpen);
  };

  const histories: HistoryEntry[] = (fetcher.data as any)?.data?.data ?? [];
  const isLoading = fetcher.state === "loading";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 rounded-xl">
              <History className="h-5 w-5 text-primary" />
            </span>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {t.pages.sales.pos.history.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {posName || posNumber}
                <span className="ml-2 font-mono text-xs bg-muted px-1.5 py-0.5 rounded">#{posNumber}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          ) : histories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <span className="bg-muted/50 p-4 rounded-full">
                <History className="h-8 w-8 text-muted-foreground" />
              </span>
              <div>
                <p className="font-medium text-foreground">{t.pages.sales.pos.history.empty}</p>
                <p className="text-sm text-muted-foreground mt-1">Aucune activité enregistrée pour ce POS.</p>
              </div>
            </div>
          ) : (
            <ol className="relative border-l border-border/50 space-y-1 ml-3">
              {histories.map((entry, idx) => {
                const isFirst = idx === 0;
                const isDeployed = entry.action === "deployed";

                return (
                  <li key={entry.id} className="ml-6 py-4">
                    {/* Timeline dot */}
                    <span className={`
                      absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-background
                      ${isDeployed ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}
                    `}>
                      {isDeployed ? <Rocket className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    </span>

                    <div className={`
                      ml-1 rounded-xl border p-4 transition-all
                      ${isFirst ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card/60"}
                    `}>
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isDeployed ? "default" : "secondary"}
                            className={`text-xs font-semibold ${isDeployed ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : ""}`}
                          >
                            {isDeployed ? t.pages.sales.pos.history.actionDeployed : t.pages.sales.pos.history.actionRedeployed}
                          </Badge>
                          {isFirst && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              Dernier
                            </Badge>
                          )}
                        </div>
                        <time className="text-xs text-muted-foreground shrink-0">
                          {formatDate(entry.created_at)}
                        </time>
                      </div>

                      {/* By */}
                      {entry.deployed_by && (
                        <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span>{t.pages.sales.pos.history.by} <strong className="text-foreground">{entry.deployed_by.name}</strong></span>
                        </div>
                      )}

                      {/* Location change */}
                      {!isDeployed && (entry.old_latitude || entry.new_latitude) && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {entry.old_latitude && (
                            <span className="font-mono bg-muted/60 px-2 py-0.5 rounded">
                              {parseFloat(entry.old_latitude).toFixed(4)}, {parseFloat(entry.old_longitude ?? "0").toFixed(4)}
                            </span>
                          )}
                          {entry.old_latitude && entry.new_latitude && (
                            <ArrowRight className="h-3.5 w-3.5" />
                          )}
                          {entry.new_latitude && (
                            <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {parseFloat(entry.new_latitude).toFixed(4)}, {parseFloat(entry.new_longitude ?? "0").toFixed(4)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Agent change */}
                      {!isDeployed && (entry.old_agent || entry.new_agent) && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          {entry.old_agent && (
                            <span className="bg-muted/60 px-2 py-0.5 rounded">{entry.old_agent.name}</span>
                          )}
                          {entry.old_agent && entry.new_agent && (
                            <ArrowRight className="h-3.5 w-3.5" />
                          )}
                          {entry.new_agent && (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{entry.new_agent.name}</span>
                          )}
                        </div>
                      )}

                      {/* Note */}
                      {entry.note && (
                        <p className="mt-3 text-xs text-muted-foreground italic border-l-2 border-border pl-3">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/10">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="w-full">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
