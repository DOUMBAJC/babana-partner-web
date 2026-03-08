import { useState, useMemo } from "react";
import { useTranslation, useLanguage } from "~/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  Signal,
  SignalZero,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { User } from "~/types";
import { PosHistoryModal } from "./PosHistoryModal";
import { DeletePosModal } from "./DeletePosModal";
import { Link, useSearchParams } from "react-router";

interface PointOfSale {
  id: string;
  pos_number: string;
  name: string | null;
  latitude: string;
  longitude: string;
  status: "active" | "inactive";
  deployed_at: string;
  last_redeployed_at: string | null;
  redeploy_count?: number;
  dsm_id: string;
  agent_id: string | null;
  agent?: User;
  dsm?: User;
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
  showDsm?: boolean;
}

export function PosList({ data, pagination, filters, showDsm = false }: PosListProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal states
  const [historyPos, setHistoryPos] = useState<PointOfSale | null>(null);
  const [deletePos, setDeletePos] = useState<PointOfSale | null>(null);

  const dateLocale = language === "fr" ? fr : enUS;

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: dateLocale });
    } catch {
      return date;
    }
  };

  const formatRelative = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: dateLocale });
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

  const statusOptions = [
    { value: "", label: language === "fr" ? "Tous" : "All", count: pagination.total },
    { value: "active", label: t.common.active || "Actif" },
    { value: "inactive", label: t.common.inactive || "Inactif" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1.5 px-2.5 py-0.5"
          >
            <Signal className="h-3 w-3" />
            {t.common.active || "Actif"}
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold gap-1.5 px-2.5 py-0.5"
          >
            <SignalZero className="h-3 w-3" />
            {t.common.inactive || "Inactif"}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const hasFilters = filters.search || filters.status;

  // Pagination helpers
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    const total = pagination.lastPage;
    const current = pagination.currentPage;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  }, [pagination.currentPage, pagination.lastPage]);

  // ========== EMPTY STATE ==========
  if (data.length === 0 && !hasFilters) {
    return (
      <Card className="border-dashed border-2 py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-8 ring-primary/5 animate-in zoom-in duration-500">
              <Smartphone className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Plus className="h-3 w-3 text-primary" />
            </div>
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-bold tracking-tight">
              {t.pages.sales.pos.list.emptyTitle}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              {t.pages.sales.pos.list.emptyMessage}
            </p>
          </div>
          <Button
            onClick={() => setSearchParams({ tab: "deploy" })}
            size="lg"
            className="mt-2 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.03] transition-all active:scale-95 rounded-xl h-12 px-8 font-bold"
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
      {/* ========== TOOLBAR ========== */}
      <div className="flex flex-col gap-3">
        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t.pages.sales.pos.list.searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/60 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </form>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="hidden sm:flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/40">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all ${viewMode === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                size="sm"
                className="h-11 px-4 rounded-xl hover:bg-destructive/10 hover:text-destructive font-medium gap-2 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {language === "fr" ? "Réinitialiser" : "Reset"}
              </Button>
            )}
            <Button
              onClick={() => setSearchParams({ tab: "deploy" })}
              className="h-11 px-5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] transition-all font-bold gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.pages.sales.pos.tabs.deploy}</span>
              <span className="sm:hidden">{language === "fr" ? "Nouveau" : "New"}</span>
            </Button>
          </div>
        </div>

        {/* Status filter chips + total count */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusFilter(opt.value)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                  ${(filters.status === opt.value || (!filters.status && opt.value === ""))
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                    : "bg-background/80 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-foreground">{pagination.total}</span>
            <span>POS {language === "fr" ? "au total" : "total"}</span>
          </div>
        </div>
      </div>

      {/* ========== EMPTY FILTERED STATE ========== */}
      {data.length === 0 && hasFilters && (
        <Card className="border-dashed border-2 py-12 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {language === "fr" ? "Aucun résultat" : "No results"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "Aucun POS trouvé pour les filtres actuels."
                  : "No POS found for the current filters."}
              </p>
            </div>
            <Button variant="outline" onClick={clearFilters} size="sm" className="rounded-lg">
              {language === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========== GRID VIEW ========== */}
      {data.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((pos) => (
            <div
              key={pos.id}
              className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Status indicator */}
              <div className="absolute top-4 right-4">
                {getStatusBadge(pos.status)}
              </div>

              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 pr-16">
                  <p className="font-bold text-foreground truncate text-base">{pos.pos_number}</p>
                  <p className="text-sm text-muted-foreground truncate">{pos.name || "—"}</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-4">
                {/* Agent */}
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {pos.agent?.avatar ? (
                      <img src={pos.agent.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-foreground/80 truncate font-medium">
                    {pos.agent?.name || (language === "fr" ? "Non assigné" : "Unassigned")}
                  </span>
                </div>

                {/* DSM (for admin view) */}
                {showDsm && pos.dsm && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                      <UserIcon className="h-3 w-3 text-violet-500" />
                    </div>
                    <span className="text-foreground/80 truncate font-medium">
                      DSM: {pos.dsm.name}
                    </span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground truncate">
                    {formatRelative(pos.deployed_at)}
                  </span>
                </div>

                {/* Redeploy count */}
                {(pos.redeploy_count ?? 0) > 0 && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <RefreshCw className="h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {language === "fr" ? `Redéployé ${pos.redeploy_count}×` : `Redeployed ${pos.redeploy_count}×`}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                {pos.latitude && pos.longitude && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs font-medium gap-1.5 text-muted-foreground hover:text-primary flex-1"
                    onClick={() => window.open(`https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`, "_blank")}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {language === "fr" ? "Carte" : "Map"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-xs font-medium gap-1.5 text-muted-foreground hover:text-primary flex-1"
                  onClick={() => setHistoryPos(pos)}
                >
                  <History className="h-3.5 w-3.5" />
                  {t.pages.sales.pos.history.menuLabel || "Historique"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-xs font-medium gap-1.5 text-muted-foreground hover:text-primary flex-1"
                  asChild
                >
                  <Link to={`/sales/pos/redeploy/${pos.id}`}>
                    <Edit className="h-3.5 w-3.5" />
                    {t.actions.edit || "Modifier"}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeletePos(pos)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== TABLE VIEW ========== */}
      {data.length > 0 && viewMode === "table" && (
        <div className="rounded-2xl border border-border/40 overflow-hidden shadow-xl shadow-black/5 bg-card/80 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground pl-6">
                    {t.pages.sales.pos.list.table.number}
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                    {t.pages.sales.pos.list.table.name}
                  </TableHead>
                  {showDsm && (
                    <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                      DSM
                    </TableHead>
                  )}
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                    {t.pages.sales.pos.list.table.agent}
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                    {t.pages.sales.pos.list.table.status}
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                    {t.pages.sales.pos.list.table.deployedAt}
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-wider text-[11px] text-muted-foreground text-right pr-6">
                    {t.pages.sales.pos.list.table.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pos, idx) => (
                  <TableRow
                    key={pos.id}
                    className="hover:bg-primary/[0.03] transition-colors border-border/20 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <TableCell className="py-4 font-medium pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary shrink-0 transition-all group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/10">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{pos.pos_number}</span>
                          {(pos.redeploy_count ?? 0) > 0 && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                              <RefreshCw className="h-2.5 w-2.5" />
                              {pos.redeploy_count}×
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-foreground/90 font-medium">{pos.name || "—"}</span>
                    </TableCell>
                    {showDsm && (
                      <TableCell className="py-4">
                        {pos.dsm ? (
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 overflow-hidden shrink-0">
                              {pos.dsm.avatar ? (
                                <img src={pos.dsm.avatar} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <UserIcon className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <span className="text-sm font-medium">{pos.dsm.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="py-4">
                      {pos.agent ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
                            {pos.agent.avatar ? (
                              <img src={pos.agent.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{pos.agent.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          {language === "fr" ? "Non assigné" : "Unassigned"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(pos.status)}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{formatDate(pos.deployed_at)}</span>
                        {pos.last_redeployed_at && (
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            {language === "fr" ? "MAJ" : "Updated"}: {formatRelative(pos.last_redeployed_at)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-muted/80 focus:ring-0 transition-all"
                          >
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 p-1.5 rounded-xl shadow-2xl border-border/40 backdrop-blur-3xl"
                        >
                          <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {t.pages.sales.pos.list.table.actions}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border/40 my-1" />

                          {/* Carte */}
                          {pos.latitude && pos.longitude && (
                            <DropdownMenuItem
                              className="rounded-lg py-2.5 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`,
                                  "_blank"
                                )
                              }
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {language === "fr" ? "Voir sur la carte" : "View on map"}
                              </span>
                            </DropdownMenuItem>
                          )}

                          {/* Historique */}
                          <DropdownMenuItem
                            className="rounded-lg py-2.5 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer"
                            onClick={() => setHistoryPos(pos)}
                          >
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {t.pages.sales.pos.history.menuLabel || "Historique"}
                            </span>
                          </DropdownMenuItem>

                          {/* Modifier */}
                          <DropdownMenuItem
                            className="rounded-lg py-2.5 px-2.5 gap-2.5 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer"
                            asChild
                          >
                            <Link to={`/sales/pos/redeploy/${pos.id}`}>
                              <Edit className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{t.actions.edit || "Modifier"}</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-border/40 my-1" />

                          {/* Supprimer */}
                          <DropdownMenuItem
                            className="rounded-lg py-2.5 px-2.5 gap-2.5 focus:bg-rose-500/10 focus:text-rose-600 text-rose-600 transition-all cursor-pointer"
                            onClick={() => setDeletePos(pos)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              {t.pages.sales.pos.deleteModal.trigger || "Supprimer"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ========== PAGINATION ========== */}
          {pagination.lastPage > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/30 bg-muted/10">
              <div className="text-sm text-muted-foreground font-medium">
                Page{" "}
                <span className="text-foreground font-bold">{pagination.currentPage}</span>{" "}
                {language === "fr" ? "sur" : "of"}{" "}
                <span className="text-foreground font-bold">{pagination.lastPage}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-border/40"
                  disabled={pagination.currentPage === 1}
                  onClick={() =>
                    setSearchParams((prev) => {
                      prev.set("page", (pagination.currentPage - 1).toString());
                      return prev;
                    })
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-1 text-muted-foreground">
                      ···
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={pagination.currentPage === p ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 rounded-lg text-xs font-bold ${
                        pagination.currentPage === p
                          ? "shadow-md shadow-primary/20"
                          : "border-border/40"
                      }`}
                      onClick={() =>
                        setSearchParams((prev) => {
                          prev.set("page", p.toString());
                          return prev;
                        })
                      }
                    >
                      {p}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-border/40"
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() =>
                    setSearchParams((prev) => {
                      prev.set("page", (pagination.currentPage + 1).toString());
                      return prev;
                    })
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== GRID PAGINATION ========== */}
      {data.length > 0 && viewMode === "grid" && pagination.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("page", (pagination.currentPage - 1).toString());
                return prev;
              })
            }
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === "fr" ? "Précédent" : "Previous"}
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            {pagination.currentPage} / {pagination.lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={pagination.currentPage === pagination.lastPage}
            onClick={() =>
              setSearchParams((prev) => {
                prev.set("page", (pagination.currentPage + 1).toString());
                return prev;
              })
            }
          >
            {language === "fr" ? "Suivant" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ========== MODALS ========== */}
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
