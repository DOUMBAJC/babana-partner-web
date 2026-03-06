import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useTranslation, useLanguage } from "~/hooks";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  Smartphone, 
  User as UserIcon,
  Edit,
  History,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { User } from "~/types";
import { PosHistoryModal } from "./PosHistoryModal";
import { DeletePosModal } from "./DeletePosModal";

interface PointOfSale {
  id: string;
  pos_number: string;
  name: string | null;
  latitude: string;
  longitude: string;
  status: 'active' | 'inactive';
  deployed_at: string;
  last_redeployed_at: string | null;
  redeploy_count?: number;
  dsm_id: string;
  agent_id: string | null;
  agent?: User;
}

interface PosListProps {
  data: PointOfSale[];
  pagination: {
    total: number;
    currentPage: number;
    lastPage: number;
  };
  filters: {
    search: string;
    status: string;
    page: string;
  };
}

const STATUS_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "active", label: "Actifs" },
  { value: "inactive", label: "Inactifs" },
];

export function PosList({ data, pagination, filters }: PosListProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Modal states
  const [historyPos, setHistoryPos] = useState<PointOfSale | null>(null);
  const [deletePos, setDeletePos] = useState<PointOfSale | null>(null);

  const formatDate = (date: string) => {
    try {
      const dateLocale = language === 'fr' ? fr : enUS;
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: dateLocale });
    } catch {
      return date;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.set("search", localSearch);
      prev.set("page", "1");
      return prev;
    });
  };

  const handleStatusFilter = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("status", value);
      } else {
        prev.delete("status");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const clearFilters = () => {
    setLocalSearch("");
    setSearchParams((prev) => {
      prev.delete("search");
      prev.delete("status");
      prev.set("page", "1");
      return prev;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
            {t.common.active || 'Actif'}
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-medium">
            {t.common.inactive || 'Inactif'}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const hasFilters = filters.search || filters.status;

  if (data.length === 0 && !hasFilters) {
    return (
      <Card className="border-dashed border-2 py-16 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-5">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 ring-8 ring-primary/5">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-semibold tracking-tight">{t.pages.sales.pos.list.emptyTitle}</h3>
            <p className="text-muted-foreground text-base">
              {t.pages.sales.pos.list.emptyMessage}
            </p>
          </div>
          <Button 
            onClick={() => setSearchParams({ tab: "deploy" })}
            size="lg"
            className="mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t.pages.sales.pos.tabs.deploy}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Search + New POS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
            <Input 
              placeholder={t.pages.sales.pos.list.searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border bg-background/50 focus:ring-primary/20 transition-all"
            />
          </form>
          
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button 
                variant="ghost" 
                onClick={clearFilters} 
                size="sm"
                className="h-11 px-4 rounded-xl hover:bg-muted font-medium gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
            )}
            <Button 
              onClick={() => setSearchParams({ tab: "deploy" })}
              className="h-11 px-5 rounded-xl shadow-md shadow-primary/20 hover:scale-105 transition-all font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.pages.sales.pos.tabs.deploy}
            </Button>
          </div>
        </div>

        {/* Status filter chips + total count */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusFilter(opt.value)}
                className={`
                  px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                  ${filters.status === opt.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                    : "bg-background border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{pagination.total}</span> POS au total
          </span>
        </div>
      </div>

      {/* Empty after filter */}
      {data.length === 0 && hasFilters && (
        <Card className="border-dashed border-2 py-12 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
            <Search className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">Aucun POS trouvé pour les filtres actuels.</p>
            <Button variant="ghost" onClick={clearFilters} size="sm">Réinitialiser les filtres</Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {data.length > 0 && (
        <div className="rounded-2xl border border-border/50 overflow-hidden shadow-xl bg-card/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground pl-6">{t.pages.sales.pos.list.table.number}</TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">{t.pages.sales.pos.list.table.name}</TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">{t.pages.sales.pos.list.table.agent}</TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">{t.pages.sales.pos.list.table.status}</TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">{t.pages.sales.pos.list.table.deployedAt}</TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-right pr-6">{t.pages.sales.pos.list.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pos) => (
                  <TableRow key={pos.id} className="hover:bg-muted/30 transition-colors border-border/30 group">
                    <TableCell className="py-4 font-medium pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary/20">
                          <Smartphone className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{pos.pos_number}</span>
                          {(pos.redeploy_count ?? 0) > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              Redéployé {pos.redeploy_count}×
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-foreground/90 font-medium">{pos.name || '—'}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {pos.agent ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
                            {pos.agent.avatar ? (
                              <img src={pos.agent.avatar} alt={pos.agent.name} className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{pos.agent.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(pos.status)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{formatDate(pos.deployed_at)}</span>
                        {pos.last_redeployed_at && (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                            MAJ: {formatDate(pos.last_redeployed_at)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted focus:ring-0">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl shadow-2xl border-border/40 backdrop-blur-3xl">
                          <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t.pages.sales.pos.list.table.actions}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border/40 my-1" />

                          {/* Carte */}
                          {pos.latitude && pos.longitude && (
                            <DropdownMenuItem
                              className="rounded-lg py-2 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer"
                              onClick={() => window.open(`https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`, '_blank')}
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">Voir sur la carte</span>
                            </DropdownMenuItem>
                          )}

                          {/* Historique */}
                          <DropdownMenuItem
                            className="rounded-lg py-2 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer"
                            onClick={() => setHistoryPos(pos)}
                          >
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{t.pages.sales.pos.history.menuLabel || 'Historique'}</span>
                          </DropdownMenuItem>

                          {/* Modifier */}
                          <DropdownMenuItem className="rounded-lg py-2 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer" asChild>
                            <Link to={`/sales/pos/redeploy/${pos.id}`}>
                              <Edit className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{t.actions.edit || 'Modifier'}</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-border/40 my-1" />

                          {/* Supprimer */}
                          <DropdownMenuItem
                            className="rounded-lg py-2 px-2.5 gap-2.5 focus:bg-rose-500/10 focus:text-rose-600 text-rose-600 transition-all cursor-pointer"
                            onClick={() => setDeletePos(pos)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium text-sm">{t.pages.sales.pos.deleteModal.trigger || 'Supprimer'}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/30 bg-muted/10">
              <div className="text-sm text-muted-foreground font-medium">
                Page <span className="text-foreground font-bold">{pagination.currentPage}</span> sur <span className="text-foreground font-bold">{pagination.lastPage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 rounded-lg bg-background border-border/40 hover:bg-muted transition-all"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setSearchParams(prev => { prev.set("page", (pagination.currentPage - 1).toString()); return prev; })}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 rounded-lg bg-background border-border/40 hover:bg-muted transition-all"
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => setSearchParams(prev => { prev.set("page", (pagination.currentPage + 1).toString()); return prev; })}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {historyPos && (
        <PosHistoryModal
          open={!!historyPos}
          onOpenChange={(open) => !open && setHistoryPos(null)}
          posId={historyPos.id}
          posName={historyPos.name || ""}
          posNumber={historyPos.pos_number}
        />
      )}

      {deletePos && (
        <DeletePosModal
          open={!!deletePos}
          onOpenChange={(open) => !open && setDeletePos(null)}
          posId={deletePos.id}
          posName={deletePos.name || ""}
          posNumber={deletePos.pos_number}
          onSuccess={() => setDeletePos(null)}
        />
      )}
    </div>
  );
}
