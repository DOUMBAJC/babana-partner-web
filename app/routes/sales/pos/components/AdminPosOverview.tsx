import { useState, useEffect } from "react";
import { useTranslation, useLanguage } from "~/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Globe,
  Users,
  Search,
  Trophy,
  User as UserIcon,
  Smartphone,
  TrendingUp,
  BarChart3,
  Filter,
  Crown,
  Medal,
  Award,
  ChevronRight,
} from "lucide-react";
import { PosStatsCards } from "./PosStatsCards";

interface DsmInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points_of_sale_count?: number;
}

interface TopDsm {
  dsm: DsmInfo;
  pos_count: number;
}

interface AdminStats {
  total: number;
  active: number;
  inactive: number;
  this_month: number;
  last_month: number;
  recent_7d: number;
  growth_rate: number;
  top_dsms: TopDsm[];
  dsm_list: DsmInfo[];
}

interface AdminPosOverviewProps {
  stats: AdminStats;
  onDsmFilter: (dsmId: string) => void;
  selectedDsm: string;
}

const rankIcons = [Crown, Medal, Award];
const rankColors = [
  "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "text-slate-400 bg-slate-400/10 border-slate-400/20",
  "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
];

export function AdminPosOverview({ stats, onDsmFilter, selectedDsm }: AdminPosOverviewProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [dsmSearch, setDsmSearch] = useState("");

  const filteredDsms = stats.dsm_list?.filter(
    (dsm) =>
      dsm.name.toLowerCase().includes(dsmSearch.toLowerCase()) ||
      dsm.email.toLowerCase().includes(dsmSearch.toLowerCase())
  ) || [];

  const selectedDsmData = stats.dsm_list?.find((d) => d.id === selectedDsm);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Stats Cards (Admin mode) */}
      <PosStatsCards stats={stats} isAdmin={true} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========== DSM FILTER PANEL ========== */}
        <Card className="lg:col-span-1 border-border/40 shadow-xl overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-border/30 bg-gradient-to-r from-violet-500/5 to-transparent">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10">
                <Filter className="h-4 w-4 text-violet-500" />
              </div>
              {language === "fr" ? "Filtrer par DSM" : "Filter by DSM"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {/* Search DSM */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={language === "fr" ? "Rechercher un DSM..." : "Search a DSM..."}
                value={dsmSearch}
                onChange={(e) => setDsmSearch(e.target.value)}
                className="pl-9 h-9 rounded-lg text-sm bg-background/50"
              />
            </div>

            {/* DSM List */}
            <ScrollArea className="h-[320px]">
              <div className="space-y-1">
                {/* All DSMs option */}
                <button
                  onClick={() => onDsmFilter("")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    !selectedDsm
                      ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    !selectedDsm ? "bg-primary/15" : "bg-muted"
                  }`}>
                    <Globe className={`h-4 w-4 ${!selectedDsm ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {language === "fr" ? "Vue globale" : "Global view"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {language === "fr" ? "Tous les DSM" : "All DSMs"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
                    {stats.total}
                  </Badge>
                </button>

                {/* Individual DSMs */}
                {filteredDsms.map((dsm) => (
                  <button
                    key={dsm.id}
                    onClick={() => onDsmFilter(dsm.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      selectedDsm === dsm.id
                        ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {dsm.avatar ? (
                        <img src={dsm.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{dsm.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{dsm.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
                      {dsm.points_of_sale_count ?? 0}
                    </Badge>
                  </button>
                ))}

                {filteredDsms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {language === "fr" ? "Aucun DSM trouvé" : "No DSM found"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ========== TOP DSMs RANKING ========== */}
        <Card className="lg:col-span-2 border-border/40 shadow-xl overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-border/30 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
                {language === "fr" ? "Classement des DSM" : "DSM Ranking"}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wide">
                Top 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {stats.top_dsms?.length > 0 ? (
              <div className="space-y-2">
                {stats.top_dsms.map((item, idx) => {
                  const RankIcon = rankIcons[idx] || null;
                  const rankColor = rankColors[idx] || "text-muted-foreground bg-muted border-border/30";
                  const maxCount = stats.top_dsms[0]?.pos_count || 1;
                  const barWidth = Math.max(8, (item.pos_count / maxCount) * 100);

                  return (
                    <div
                      key={item.dsm?.id || idx}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-background/50 hover:bg-primary/[0.03] hover:border-primary/20 transition-all cursor-pointer"
                      onClick={() => item.dsm && onDsmFilter(item.dsm.id)}
                    >
                      {/* Rank */}
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border font-bold text-sm ${rankColor}`}>
                        {RankIcon ? (
                          <RankIcon className="h-4 w-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* DSM Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {item.dsm?.avatar ? (
                              <img src={item.dsm.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-sm font-bold text-foreground truncate">
                            {item.dsm?.name || "—"}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000 ease-out"
                            style={{
                              width: `${barWidth}%`,
                              animationDelay: `${idx * 100}ms`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Count */}
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-foreground tabular-nums">
                          {item.pos_count}
                        </span>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">
                          POS
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {language === "fr" ? "Aucune donnée disponible" : "No data available"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current DSM filter indicator */}
      {selectedDsmData && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {selectedDsmData.avatar ? (
              <img src={selectedDsmData.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">
              {language === "fr" ? "Filtre actif" : "Active filter"}: {selectedDsmData.name}
            </p>
            <p className="text-xs text-muted-foreground">{selectedDsmData.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-xs font-bold text-primary hover:bg-primary/10"
            onClick={() => onDsmFilter("")}
          >
            {language === "fr" ? "Voir tout" : "View all"}
          </Button>
        </div>
      )}
    </div>
  );
}
