import { data, useLoaderData, useRevalidator, useNavigate } from "react-router";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { Layout, ProtectedRoute, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Toaster, Input } from "~/components";
import { usePageTitle } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type SupportTicketFilters } from "~/lib/services/support.service";
import { extractPaginationMeta, unwrapTickets } from "./utils";
import { MessageSquare, Plus, RefreshCw, Search, Clock, CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "~/types/auth.types";
import { StatusBadge, PriorityBadge } from "~/routes/admin/support/components";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";

type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  error: string | null;
  q: string;
  status: string;
  priority: string;
  tickets: any[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      const language = (await getLanguage(request)) as Language;
      const t = getTranslations(language);
      return data({
        user: null,
        hasAccess: false,
        error: t.pages?.unauthorized?.title || "Vous devez être connecté pour voir vos tickets",
        q: "",
        status: "",
        priority: "",
        tickets: [],
        pagination: {
          currentPage: 1,
          perPage: 15,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const api = await createAuthenticatedApi(request);
    const url = new URL(request.url);
    
    const q = url.searchParams.get("q") || "";
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";
    const page = parseInt(url.searchParams.get("page") || "1");

    const filters: SupportTicketFilters = {
      status: (status as any) || undefined,
      priority: (priority as any) || undefined,
      search: q || undefined,
      per_page: 15,
    };

    const params = {
      page,
    };

    const ticketsResponse = await supportService.getTickets(filters, params, api);
    const tickets = unwrapTickets(ticketsResponse);
    const pagination = extractPaginationMeta(ticketsResponse);

    return data({
      user,
      hasAccess: true,
      error: null,
      q,
      status,
      priority,
      tickets,
      pagination,
    });
  } catch (error: any) {
    console.error("Error loading support tickets:", error);
    const language = (await getLanguage(request)) as Language;
    const t = getTranslations(language);
    
    return data({
      user: null,
      hasAccess: false,
      error: error.message || t.pages?.support?.errors?.fetchFailed || "Erreur lors du chargement",
      q: "",
      status: "",
      priority: "",
      tickets: [],
      pagination: {
        currentPage: 1,
        perPage: 15,
        total: 0,
        totalPages: 0,
      },
    });
  }
}

export default function SupportTicketsPage({ loaderData }: Route.ComponentProps) {
  usePageTitle("Mes Tickets de Support");
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const isRefreshing = revalidator.state === "loading";
  const [searchQuery, setSearchQuery] = useState(loaderData.q || "");
  const [statusFilter, setStatusFilter] = useState(loaderData.status || "");

  // Synchroniser les filtres avec les données du loader
  useEffect(() => {
    setSearchQuery(loaderData.q || "");
    setStatusFilter(loaderData.status || "");
  }, [loaderData.q, loaderData.status]);

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("q", searchQuery);
    } else {
      url.searchParams.delete("q");
    }
    navigate(url.pathname + url.search);
  };

  const handleStatusFilter = (status: string) => {
    const url = new URL(window.location.href);
    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams.delete("status");
    }
    url.searchParams.delete("page"); // Reset to first page
    navigate(url.pathname + url.search);
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = loaderData.pagination.total;
    const open = loaderData.tickets.filter(t => t.status === "open").length;
    const inProgress = loaderData.tickets.filter(t => t.status === "in_progress").length;
    const resolved = loaderData.tickets.filter(t => t.status === "resolved").length;
    const closed = loaderData.tickets.filter(t => t.status === "closed").length;
    
    return { total, open, inProgress, resolved, closed };
  }, [loaderData.tickets, loaderData.pagination.total]);

  if (!loaderData.hasAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Accès refusé</CardTitle>
              <CardDescription>{loaderData.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")}>
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProtectedRoute>
        <Toaster />
        <div className="min-h-screen bg-linear-to-br from-background via-background to-babana-cyan/5">
          {/* Header avec gradient animé */}
          <div className="relative overflow-hidden bg-linear-to-r from-babana-navy via-babana-navy/95 to-babana-cyan/20 border-b border-babana-cyan/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1RkM4RTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="container mx-auto px-4 py-12 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-babana-cyan/20 backdrop-blur-sm border border-babana-cyan/30">
                      <MessageSquare className="h-8 w-8 text-babana-cyan" />
                    </div>
                    Mes Tickets de Support
                  </h1>
                  <p className="text-babana-cyan/80 text-lg">
                    Gérez et suivez toutes vos demandes de support en un seul endroit
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Actualiser
                  </Button>
                  <Button 
                    onClick={() => navigate("/support")}
                    className="bg-babana-cyan hover:bg-babana-cyan/90 text-babana-navy font-semibold shadow-lg shadow-babana-cyan/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Ticket
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 mt-8 relative z-20">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-2 border-babana-cyan/20 hover:border-babana-cyan/40 transition-all duration-300 hover:shadow-lg hover:shadow-babana-cyan/10 bg-linear-to-br from-background to-babana-cyan/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total</p>
                      <p className="text-3xl font-bold text-babana-navy dark:text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-babana-cyan/10">
                      <MessageSquare className="h-6 w-6 text-babana-cyan" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  statusFilter === "open" 
                    ? "border-babana-cyan shadow-lg shadow-babana-cyan/20" 
                    : "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
                onClick={() => handleStatusFilter(statusFilter === "open" ? "" : "open")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ouverts</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.open}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                      <Circle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  statusFilter === "in_progress" 
                    ? "border-babana-cyan shadow-lg shadow-babana-cyan/20" 
                    : "border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700"
                }`}
                onClick={() => handleStatusFilter(statusFilter === "in_progress" ? "" : "in_progress")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">En cours</p>
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  statusFilter === "resolved" 
                    ? "border-babana-cyan shadow-lg shadow-babana-cyan/20" 
                    : "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700"
                }`}
                onClick={() => handleStatusFilter(statusFilter === "resolved" ? "" : "resolved")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Résolus</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barre de recherche et filtres */}
            <Card className="mb-8 border-2 border-border/50 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher dans vos tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base border-2 focus:border-babana-cyan focus:ring-2 focus:ring-babana-cyan/20"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="h-12 px-6 bg-babana-cyan hover:bg-babana-cyan/90 text-babana-navy font-semibold"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Liste des tickets */}
            {loaderData.tickets.length === 0 ? (
              <Card className="border-2 border-dashed border-muted-foreground/30">
                <CardContent>
                  <div className="text-center py-20">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse" />
                      <div className="relative p-6 rounded-full bg-linear-to-br from-babana-cyan/10 to-babana-navy/10 border-2 border-babana-cyan/20">
                        <MessageSquare className="h-16 w-16 text-babana-cyan" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Aucun ticket trouvé</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {loaderData.q || loaderData.status 
                        ? "Aucun ticket ne correspond à vos critères de recherche."
                        : "Vous n'avez pas encore créé de ticket de support. Créez-en un pour commencer !"
                      }
                    </p>
                    <Button 
                      onClick={() => navigate("/support")}
                      size="lg"
                      className="bg-babana-cyan hover:bg-babana-cyan/90 text-babana-navy font-semibold shadow-lg shadow-babana-cyan/30"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Créer un ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {loaderData.tickets.map((ticket, index) => (
                  <Card
                    key={ticket.id}
                    className="group cursor-pointer border-2 border-border/50 hover:border-babana-cyan/50 transition-all duration-300 hover:shadow-xl hover:shadow-babana-cyan/10 bg-linear-to-br from-background to-background hover:to-babana-cyan/5"
                    onClick={() => navigate(`/support/tickets/${ticket.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-babana-cyan/10 group-hover:bg-babana-cyan/20 transition-colors mt-1">
                              <MessageSquare className="h-5 w-5 text-babana-cyan" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl mb-2 group-hover:text-babana-cyan transition-colors">
                                {ticket.subject}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {ticket.message}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Il y a {formatDistanceToNow(new Date(ticket.created_at), { 
                                      addSuffix: true, 
                                      locale: fr 
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <span className="text-xs">
                                    {new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:ml-4">
                          <StatusBadge status={ticket.status} />
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination améliorée */}
            {loaderData.pagination.totalPages > 1 && (
              <Card className="mt-8 border-2 border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Affichage de <span className="font-semibold text-foreground">{(loaderData.pagination.currentPage - 1) * loaderData.pagination.perPage + 1}</span> à{" "}
                      <span className="font-semibold text-foreground">
                        {Math.min(loaderData.pagination.currentPage * loaderData.pagination.perPage, loaderData.pagination.total)}
                      </span>{" "}
                      sur <span className="font-semibold text-foreground">{loaderData.pagination.total}</span> tickets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loaderData.pagination.currentPage === 1}
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("page", String(loaderData.pagination.currentPage - 1));
                          navigate(url.pathname + url.search);
                        }}
                        className="h-10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      <div className="flex items-center gap-1 px-4">
                        {Array.from({ length: Math.min(5, loaderData.pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (loaderData.pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (loaderData.pagination.currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (loaderData.pagination.currentPage >= loaderData.pagination.totalPages - 2) {
                            pageNum = loaderData.pagination.totalPages - 4 + i;
                          } else {
                            pageNum = loaderData.pagination.currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={loaderData.pagination.currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set("page", String(pageNum));
                                navigate(url.pathname + url.search);
                              }}
                              className={`h-10 w-10 ${
                                loaderData.pagination.currentPage === pageNum 
                                  ? "bg-babana-cyan hover:bg-babana-cyan/90 text-babana-navy" 
                                  : ""
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loaderData.pagination.currentPage === loaderData.pagination.totalPages}
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("page", String(loaderData.pagination.currentPage + 1));
                          navigate(url.pathname + url.search);
                        }}
                        className="h-10"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

