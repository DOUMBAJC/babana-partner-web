import { data, useLoaderData, useRevalidator } from "react-router";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { isAdmin } from "~/lib/permissions";
import { Layout, ProtectedRoute, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Card, CardDescription, CardHeader, CardTitle, Toaster } from "~/components";
import { usePageTitle } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import { supportService, type SupportTicketFilters } from "~/lib/services/support.service";
import { extractPaginationMeta, unwrapTickets } from "./utils";
import { useSupportFilters } from "./hooks/useSupportFilters";
import {
  SupportHeader,
  SupportFilters,
  SupportTicketsTable,
  SupportPagination,
  AnimatedBackground,
  SupportStatistics,
} from "./components";
import type { SupportTicketStatistics } from "~/lib/services/support.service";
import type { User } from "~/types/auth.types";

type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  error: string | null;
  q: string;
  status: string;
  priority: string;
  selectedTicketId: string | null;
  tickets: any[];
  statistics: SupportTicketStatistics | null;
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
    const hasAccess = user ? isAdmin(user) : false;

    if (!hasAccess) {
      const language = (await getLanguage(request)) as Language;
      const t = getTranslations(language);
      return data({
        user,
        hasAccess: false,
        error: t.pages?.unauthorized?.title || "Accès refusé",
        q: "",
        status: "",
        priority: "",
        selectedTicketId: null,
        tickets: [],
        statistics: null,
        pagination: {
          currentPage: 1,
          perPage: 15,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const api = await createAuthenticatedApi(request);
    
    // Charger les statistiques en parallèle
    let statistics: SupportTicketStatistics | null = null;
    try {
      statistics = await supportService.getStatistics(api);
    } catch (error) {
      console.error("Error loading statistics:", error);
      // Ne pas bloquer le chargement de la page si les stats échouent
    }
    const url = new URL(request.url);
    
    const q = url.searchParams.get("q") || "";
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const selectedTicketId = url.searchParams.get("ticket") || null;

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
      selectedTicketId,
      tickets,
      statistics,
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
      selectedTicketId: null,
      tickets: [],
      statistics: null,
      pagination: {
        currentPage: 1,
        perPage: 15,
        total: 0,
        totalPages: 0,
      },
    });
  }
}

export default function AdminSupportPage({ loaderData }: Route.ComponentProps) {
  usePageTitle("Gestion du Support");
  const revalidator = useRevalidator();
  const isRefreshing = revalidator.state === "loading";

  const {
    searchInput,
    statusFilter,
    priorityFilter,
    setSearchInput,
    handleStatusChange,
    handlePriorityChange,
    goToPage,
  } = useSupportFilters({
    initialSearch: loaderData.q,
    initialStatus: loaderData.status,
    initialPriority: loaderData.priority,
  });

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  if (!loaderData.hasAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Accès refusé</CardTitle>
              <CardDescription>{loaderData.error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProtectedRoute role={['admin', 'super_admin']} mode="any">
        <Toaster />
        <div className="relative min-h-screen overflow-hidden">
          <AnimatedBackground />

          <div className="relative z-10 container mx-auto space-y-6 py-6 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Support</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <SupportHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

            {/* Statistiques */}
            {loaderData.statistics && (
              <SupportStatistics statistics={loaderData.statistics} />
            )}

            <SupportFilters
              searchValue={searchInput}
              statusValue={statusFilter}
              priorityValue={priorityFilter}
              onSearchChange={setSearchInput}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
            />

            <SupportTicketsTable
              tickets={loaderData.tickets}
              totalTickets={loaderData.pagination.total}
            />

            <SupportPagination
              currentPage={loaderData.pagination.currentPage}
              totalPages={loaderData.pagination.totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

