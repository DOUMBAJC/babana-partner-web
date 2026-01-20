import type { Route } from "./+types/route";
import {
  Layout,
  ProtectedRoute,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  Filter,
  X,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  Activity,
  Clock,
  User,
  Server,
  Database,
  Globe,
  Shield,
  Eye,
  Copy,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { data, useLoaderData } from "react-router";
import gsap from "gsap";
import { logService, type LogEntry } from "~/lib/services/log.service";
import type { PaginatedResponse } from "~/types";

// Types pour les logs (locaux, alignés avec l'API)
type LogLevel = "debug" | "info" | "warning" | "error" | "critical";
type LogType = "api" | "auth" | "database" | "system" | "security" | "all";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vérification des Logs - BABANA" },
    {
      name: "description",
      content: "Consultez et analysez les logs système de la plateforme",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // En SSR, on utilise directement createAuthenticatedApi comme les routes API SSR
  const { createAuthenticatedApi } = await import("~/services/api.server");
  const api = await createAuthenticatedApi(request);
  
  const url = new URL(request.url);

  // Récupération des paramètres de filtre depuis l'URL (si présents)
  const levelParam = (url.searchParams.get("level") as LogLevel | "all") ?? "all";
  const typeParam = (url.searchParams.get("type") as LogType | "all") ?? "all";
  const searchParam = url.searchParams.get("search") ?? "";

  const pageParam = url.searchParams.get("page");
  const perPageParam = url.searchParams.get("perPage");

  const filtersForApi: Record<string, string | undefined> = {
    level: levelParam === "all" ? undefined : levelParam,
    type: typeParam === "all" ? undefined : typeParam,
    search: searchParam || undefined,
  };

  const pagination = {
    page: pageParam ? Number(pageParam) : 1,
    perPage: perPageParam ? Number(perPageParam) : 50,
  };

  try {
    const response = await api.get<PaginatedResponse<LogEntry>>("/admin/logs", {
      params: {
        ...filtersForApi,
        ...pagination,
      },
    });

    return data({
      logs: response.data.data || [],
      totalCount: response.data.meta?.total || 0,
    });
  } catch (error: any) {
    console.error("[LOGS] Error in loader:", error);
    return data({
      logs: [],
      totalCount: 0,
    });
  }
}

export default function LogsPage() {
  const { t } = useTranslation();
  usePageTitle("Vérification des Logs");

  return (
    <Layout>
      <ProtectedRoute role={["admin", "super_admin"]} mode="any">
        <LogsContent />
      </ProtectedRoute>
    </Layout>
  );
}

function LogsContent() {
  const { logs: initialLogs } = useLoaderData<typeof loader>();
  const [logs, setLogs] = useState<LogEntry[]>(
    () => (Array.isArray(initialLogs) ? initialLogs : [])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | "all">("all");
  const [selectedType, setSelectedType] = useState<LogType>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Refs pour les animations
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrer les logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress?.includes(searchQuery) ||
        log.id.includes(searchQuery);

      const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
      const matchesType = selectedType === "all" || log.type === selectedType;

      const logDate = new Date(log.timestamp);
      const now = new Date();
      let matchesDate = true;
      if (dateRange === "today") {
        matchesDate = logDate.toDateString() === now.toDateString();
      } else if (dateRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= weekAgo;
      } else if (dateRange === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= monthAgo;
      }

      return matchesSearch && matchesLevel && matchesType && matchesDate;
    });
  }, [logs, searchQuery, selectedLevel, selectedType, dateRange]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const byLevel = {
      error: filteredLogs.filter((l) => l.level === "error" || l.level === "critical").length,
      warning: filteredLogs.filter((l) => l.level === "warning").length,
      info: filteredLogs.filter((l) => l.level === "info").length,
      debug: filteredLogs.filter((l) => l.level === "debug").length,
    };
    return { total, ...byLevel };
  }, [filteredLogs]);

  // Animations d'entrée avec GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du header
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Animation des stats avec délai
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Animation des filtres
      if (filtersRef.current) {
        gsap.from(filtersRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.4,
        });
      }

      // Animation du tableau
      if (tableRef.current) {
        gsap.from(tableRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.6,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animation des lignes du tableau au hover
  useEffect(() => {
    const rows = document.querySelectorAll('[data-log-row]');
    rows.forEach((row) => {
      const handleMouseEnter = () => {
        gsap.to(row, {
          scale: 1.01,
          duration: 0.2,
          ease: "power2.out",
        });
      };
      const handleMouseLeave = () => {
        gsap.to(row, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      };
      row.addEventListener("mouseenter", handleMouseEnter);
      row.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        row.removeEventListener("mouseenter", handleMouseEnter);
        row.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, [filteredLogs]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // TODO: Recharger les logs depuis l'API
      console.log("Refreshing logs...");
    }, 30000); // 30 secondes
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "debug":
        return <Bug className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "critical":
        return "bg-red-600 text-white border-red-700";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      case "debug":
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case "api":
        return <Globe className="h-3 w-3" />;
      case "auth":
        return <Shield className="h-3 w-3" />;
      case "database":
        return <Database className="h-3 w-3" />;
      case "system":
        return <Server className="h-3 w-3" />;
      case "security":
        return <Shield className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = async () => {
    // On réutilise les filtres actuels pour l'export côté API
    const filtersForApi: Record<string, string | undefined> = {
      level: selectedLevel === "all" ? undefined : selectedLevel,
      type: selectedType === "all" ? undefined : selectedType,
      search: searchQuery || undefined,
    };

    const blob = await logService.exportLogs(filtersForApi);
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute(
      "href",
      url,
    );
    link.setAttribute(
      "download",
      `logs-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, logId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(logId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div ref={containerRef} className="container mx-auto space-y-6 py-8 px-4 relative overflow-hidden">
      {/* Background animé avec particules */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-babana-cyan/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-babana-navy/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-babana-cyan/3 rounded-full blur-2xl animate-pulse delay-200"></div>
      </div>

      {/* Header */}
      <div ref={headerRef} className="flex items-start justify-between relative">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-linear-to-br from-babana-cyan/20 via-babana-cyan/10 to-babana-navy/10 rounded-2xl backdrop-blur-sm border border-babana-cyan/20 shadow-lg shadow-babana-cyan/10 group hover:shadow-xl hover:shadow-babana-cyan/20 transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/0 via-babana-cyan/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FileText className="h-8 w-8 text-babana-cyan relative z-10 drop-shadow-lg" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-babana-cyan animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-linear-to-r from-foreground via-babana-cyan to-foreground bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                Vérification des Logs
              </h1>
              <p className="text-muted-foreground mt-2 text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse text-babana-cyan" />
                Consultez et analysez les logs système en temps réel
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2 relative overflow-hidden group border-babana-cyan/30 hover:border-babana-cyan/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/0 via-babana-cyan/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <RefreshCw
              className={`h-4 w-4 relative z-10 ${autoRefresh ? "animate-spin" : ""}`}
            />
            <span className="relative z-10">{autoRefresh ? "Actif" : "Auto-refresh"}</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport} 
            className="gap-2 relative overflow-hidden group border-babana-cyan/30 hover:border-babana-cyan/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/0 via-babana-cyan/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Download className="h-4 w-4 relative z-10 translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Exporter</span>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div ref={statsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="group relative overflow-hidden border-babana-cyan/30 bg-linear-to-br from-babana-cyan/10 via-babana-cyan/5 to-babana-navy/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-babana-cyan/20 transition-all duration-500 hover:scale-105 hover:border-babana-cyan/50">
          <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/0 via-babana-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-babana-cyan/10 rounded-full blur-2xl group-hover:bg-babana-cyan/20 transition-all duration-500"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-babana-cyan/20 rounded-lg group-hover:bg-babana-cyan/30 transition-colors">
                  <Activity className="h-5 w-5 text-babana-cyan animate-pulse" />
                </div>
                <div>
                  <div className="text-3xl font-bold bg-linear-to-r from-foreground to-babana-cyan bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                  <div className="text-xs text-muted-foreground">logs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-red-500/30 bg-linear-to-br from-red-500/10 via-red-500/5 to-red-600/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:scale-105 hover:border-red-500/50">
          <div className="absolute inset-0 bg-linear-to-br from-red-500/0 via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-3 w-3 text-red-500" />
              Erreurs
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors ${stats.error > 0 ? 'animate-pulse' : ''}`}>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500">{stats.error}</div>
                  <div className="text-xs text-muted-foreground">critiques</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-yellow-500/30 bg-linear-to-br from-yellow-500/10 via-yellow-500/5 to-yellow-600/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 hover:border-yellow-500/50">
          <div className="absolute inset-0 bg-linear-to-br from-yellow-500/0 via-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-500"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              Avertissements
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-500">{stats.warning}</div>
                  <div className="text-xs text-muted-foreground">alertes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-blue-500/30 bg-linear-to-br from-blue-500/10 via-blue-500/5 to-blue-600/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:border-blue-500/50">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Info className="h-3 w-3 text-blue-500" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-500">{stats.info}</div>
                  <div className="text-xs text-muted-foreground">infos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-gray-500/30 bg-linear-to-br from-gray-500/10 via-gray-500/5 to-gray-600/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-500 hover:scale-105 hover:border-gray-500/50">
          <div className="absolute inset-0 bg-linear-to-br from-gray-500/0 via-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/10 rounded-full blur-2xl group-hover:bg-gray-500/20 transition-all duration-500"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bug className="h-3 w-3 text-gray-500" />
              Debug
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500/20 rounded-lg group-hover:bg-gray-500/30 transition-colors">
                  <Bug className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-500">{stats.debug}</div>
                  <div className="text-xs text-muted-foreground">debugs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card ref={filtersRef} className="relative overflow-hidden border-babana-cyan/20 bg-linear-to-br from-card/50 to-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/0 via-babana-cyan/5 to-transparent opacity-50"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-babana-cyan/20 rounded-lg">
              <Filter className="h-4 w-4 text-babana-cyan" />
            </div>
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-babana-cyan transition-colors" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-babana-cyan/20 focus:border-babana-cyan/50 focus:ring-babana-cyan/20 transition-all duration-300"
              />
            </div>

            <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as LogLevel | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as LogType)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="database">Base de données</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(v) =>
                setDateRange(v as "today" | "week" | "month" | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || selectedLevel !== "all" || selectedType !== "all" || dateRange !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("all");
                  setSelectedType("all");
                  setDateRange("all");
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau des logs */}
      <Card ref={tableRef} className="relative overflow-hidden border-babana-cyan/20 bg-linear-to-br from-card/50 to-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/0 via-babana-cyan/5 to-transparent opacity-30"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-babana-cyan" />
                Logs ({filteredLogs.length})
              </CardTitle>
              <CardDescription>
                Liste des logs filtrés selon vos critères
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="rounded-lg border border-babana-cyan/20 overflow-hidden backdrop-blur-sm bg-card/50">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-babana-cyan/20 bg-linear-to-r from-babana-cyan/5 to-transparent">
                    <TableHead className="w-[100px] font-semibold">Niveau</TableHead>
                    <TableHead className="w-[100px] font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Message</TableHead>
                    <TableHead className="w-[150px] font-semibold">Utilisateur</TableHead>
                    <TableHead className="w-[180px] font-semibold">Date</TableHead>
                    <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 opacity-50" />
                          <p>Aucun log trouvé avec les filtres sélectionnés</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <TableRow
                        key={log.id}
                        data-log-row
                        className="cursor-pointer hover:bg-linear-to-r hover:from-babana-cyan/10 hover:to-transparent transition-all duration-300 border-babana-cyan/10 group relative"
                        onClick={() => {
                          const rowElement = document.querySelector(`[data-log-row-id="${log.id}"]`);
                          if (rowElement) {
                            gsap.to(rowElement, {
                              scale: 0.98,
                              duration: 0.1,
                              yoyo: true,
                              repeat: 1,
                            });
                          }
                          setSelectedLog(log);
                        }}
                        data-log-row-id={log.id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                      <TableCell>
                        <Badge
                          className={`${getLevelColor(log.level)} flex items-center gap-1.5 w-fit shadow-lg shadow-current/20 hover:shadow-xl hover:shadow-current/30 transition-all duration-300 hover:scale-105 relative overflow-hidden group/badge`}
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover/badge:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10">{getLevelIcon(log.level)}</span>
                          <span className="relative z-10 font-semibold">{log.level.toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 group/type">
                          <div className="p-1 bg-muted/50 rounded group-hover/type:bg-babana-cyan/20 transition-colors">
                            {getTypeIcon(log.type)}
                          </div>
                          <span className="text-sm capitalize font-medium">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate font-medium group-hover:text-babana-cyan transition-colors">
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.userName ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-muted/50 rounded group-hover:bg-babana-cyan/20 transition-colors">
                              <User className="h-3 w-3 text-muted-foreground group-hover:text-babana-cyan transition-colors" />
                            </div>
                            <span className="text-sm font-medium">{log.userName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 group-hover:text-babana-cyan transition-colors" />
                          <span className="font-medium">{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-babana-cyan/20 hover:text-babana-cyan transition-all duration-300 hover:scale-110 relative overflow-hidden group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(log.id, log.id);
                            }}
                          >
                            <div className="absolute inset-0 bg-babana-cyan/10 scale-0 group-hover/btn:scale-100 transition-transform duration-300 rounded"></div>
                            {copiedId === log.id ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 relative z-10 animate-in zoom-in duration-300" />
                            ) : (
                              <Copy className="h-4 w-4 relative z-10" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-babana-cyan/20 hover:text-babana-cyan transition-all duration-300 hover:scale-110 relative overflow-hidden group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                          >
                            <div className="absolute inset-0 bg-babana-cyan/10 scale-0 group-hover/btn:scale-100 transition-transform duration-300 rounded"></div>
                            <Eye className="h-4 w-4 relative z-10" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de détail */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            gsap.to("[data-modal-card]", {
              scale: 0.95,
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => setSelectedLog(null),
            });
          }}
        >
          <Card
            data-modal-card
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 relative border-babana-cyan/30 bg-linear-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-2xl shadow-babana-cyan/20 animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => {
              gsap.to("[data-modal-card]", {
                scale: 1.02,
                duration: 0.2,
                ease: "power2.out",
              });
            }}
            onMouseLeave={() => {
              gsap.to("[data-modal-card]", {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              });
            }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/5 via-transparent to-babana-navy/5 pointer-events-none"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      className={`${getLevelColor(selectedLog.level)} flex items-center gap-1.5 shadow-lg shadow-current/20`}
                    >
                      {getLevelIcon(selectedLog.level)}
                      {selectedLog.level.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5 border-babana-cyan/30 hover:bg-babana-cyan/10 transition-colors">
                      {getTypeIcon(selectedLog.type)}
                      <span className="capitalize">{selectedLog.type}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl bg-linear-to-r from-foreground to-babana-cyan bg-clip-text text-transparent">
                    {selectedLog.message}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">ID: {selectedLog.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(selectedLog.timestamp)}
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-500/20 hover:text-red-500 transition-all duration-300 hover:scale-110 rounded-full"
                  onClick={() => {
                    gsap.to("[data-modal-card]", {
                      scale: 0.95,
                      opacity: 0,
                      duration: 0.2,
                      ease: "power2.in",
                      onComplete: () => setSelectedLog(null),
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid gap-4 md:grid-cols-2">
                {selectedLog.userName && (
                  <div className="p-4 bg-linear-to-br from-babana-cyan/5 to-transparent rounded-lg border border-babana-cyan/20 hover:border-babana-cyan/40 transition-all duration-300 hover:shadow-lg hover:shadow-babana-cyan/10">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-babana-cyan" />
                      Utilisateur
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedLog.userName}</span>
                      {selectedLog.userId && (
                        <span className="text-muted-foreground text-sm font-mono bg-muted px-2 py-0.5 rounded">
                          {selectedLog.userId}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div className="p-4 bg-linear-to-br from-babana-cyan/5 to-transparent rounded-lg border border-babana-cyan/20 hover:border-babana-cyan/40 transition-all duration-300 hover:shadow-lg hover:shadow-babana-cyan/10">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-babana-cyan" />
                      Adresse IP
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{selectedLog.ipAddress}</span>
                    </div>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="md:col-span-2 p-4 bg-linear-to-br from-babana-cyan/5 to-transparent rounded-lg border border-babana-cyan/20 hover:border-babana-cyan/40 transition-all duration-300">
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      User Agent
                    </div>
                    <div className="text-sm font-mono bg-muted/50 p-3 rounded border border-babana-cyan/10 overflow-x-auto">
                      {selectedLog.userAgent}
                    </div>
                  </div>
                )}
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div className="p-4 bg-linear-to-br from-babana-cyan/5 to-transparent rounded-lg border border-babana-cyan/20">
                  <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4 text-babana-cyan" />
                    Métadonnées
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg border border-babana-cyan/10 overflow-x-auto">
                    <pre className="text-sm font-mono text-foreground">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedLog.stackTrace && (
                <div className="p-4 bg-linear-to-br from-red-500/10 to-red-600/5 rounded-lg border border-red-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Stack Trace
                    </div>
                    <div className="bg-red-950/50 dark:bg-red-950/30 border border-red-500/30 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                        {selectedLog.stackTrace}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

