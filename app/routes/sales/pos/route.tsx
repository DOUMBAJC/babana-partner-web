import { data, useNavigate, useSearchParams } from "react-router";
import { Layout } from "~/components";
import { useTranslation, useLanguage, usePageTitle } from "~/hooks";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { hasAnyRole, isAdmin } from "~/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Toaster } from "~/components/ui/toaster";
import { Badge } from "~/components/ui/badge";
import { PosList } from "./components/PosList";
import { DeploymentForm } from "./components/DeploymentForm";
import { PosStatsCards } from "./components/PosStatsCards";
import { AdminPosOverview } from "./components/AdminPosOverview";
import {
  LayoutList,
  Plus,
  BarChart3,
  Smartphone,
} from "lucide-react";
import type { Route } from "./+types/route";
import type { RoleSlug } from "~/types";

const AUTHORIZED_ROLES: RoleSlug[] = ["dsm", "admin", "super_admin"];

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);

  if (!user || !hasAnyRole(user, AUTHORIZED_ROLES)) {
    throw new Response("Unauthorized", { status: 403 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const page = url.searchParams.get("page") || "1";
  const dsmId = url.searchParams.get("dsm_id") || "";

  const userIsAdmin = isAdmin(user);

  try {
    const api = await createAuthenticatedApi(request);

    // Requêtes parallèles
    const requests: Promise<any>[] = [
      // POS list (DSM ou admin filtré)
      userIsAdmin && dsmId
        ? api.get("/admin/pos/overview", {
            params: { search, status, page, per_page: 10, dsm_id: dsmId },
          })
        : userIsAdmin
        ? api.get("/admin/pos/overview", {
            params: { search, status, page, per_page: 10 },
          })
        : api.get("/dsm/pos", {
            params: { search, status, page, per_page: 10 },
          }),
      // Agents (POS + BA)
      api.get("/dsm/pos/agents"),
      // Stats
      userIsAdmin
        ? api.get("/admin/pos/statistics", {
            params: dsmId ? { dsm_id: dsmId } : {},
          }).catch(() => ({ data: { data: null } }))
        : api.get("/dsm/pos/statistics").catch(() => ({ data: { data: null } })),
    ];

    const [posResponse, agentsResponse, statsResponse] = await Promise.all(requests);

    return data({
      user,
      userIsAdmin,
      posData: posResponse.data.data,
      agents: agentsResponse.data.data?.data || agentsResponse.data.data || [],
      stats: statsResponse.data.data || {
        total: 0,
        active: 0,
        inactive: 0,
        this_month: 0,
        last_month: 0,
        recent_7d: 0,
        growth_rate: 0,
        top_dsms: [],
        dsm_list: [],
      },
      filters: { search, status, page, dsm_id: dsmId },
    });
  } catch (error: any) {
    console.error("Error loading POS:", error.message);
    return data({
      user,
      userIsAdmin,
      posData: { data: [], total: 0, current_page: 1, last_page: 1 },
      agents: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        this_month: 0,
        last_month: 0,
        recent_7d: 0,
        growth_rate: 0,
        top_dsms: [],
        dsm_list: [],
      },
      filters: { search, status, page, dsm_id: "" },
      error: "Failed to load points of sale",
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const api = await createAuthenticatedApi(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "deploy") {
    try {
      const response = await api.post("/dsm/pos", {
        pos_number: formData.get("pos_number"),
        name: formData.get("name"),
        agent_id: formData.get("agent_id") || undefined,
        dsm_id: formData.get("dsm_id") || undefined,
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
      });

      return data({ success: true, message: response.data.message });
    } catch (error: any) {
      return data(
        {
          success: false,
          error: error.response?.data?.message || "Failed to deploy POS",
          errors: error.response?.data?.errors,
        },
        { status: error.response?.status || 500 }
      );
    }
  }

  if (intent === "delete") {
    const pos_id = formData.get("pos_id") as string;
    const deletion_note = formData.get("deletion_note") as string;
    try {
      const response = await api.delete(`/dsm/pos/${pos_id}`, {
        data: { deletion_note: deletion_note || undefined },
      });
      return data({ success: true, message: response.data.message });
    } catch (error: any) {
      return data(
        {
          success: false,
          error: error.response?.data?.message || "Failed to delete POS",
        },
        { status: error.response?.status || 500 }
      );
    }
  }

  return data({ success: false, error: "Invalid intent" }, { status: 400 });
}

export default function PosManagementPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, userIsAdmin, posData, agents, stats, filters } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || (userIsAdmin ? "overview" : "list");

  usePageTitle(t.pages.sales.pos.title);

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("tab", value);
      return prev;
    });
  };

  const handleDsmFilter = (dsmId: string) => {
    setSearchParams((prev) => {
      if (dsmId) {
        prev.set("dsm_id", dsmId);
      } else {
        prev.delete("dsm_id");
      }
      prev.set("tab", "overview");
      prev.set("page", "1");
      return prev;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ========== PAGE HEADER ========== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-lg shadow-primary/10 shrink-0">
              <Smartphone className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  {t.pages.sales.pos.title}
                </h1>
                {userIsAdmin && (
                  <Badge
                    variant="outline"
                    className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-base">
                {t.pages.sales.pos.description}
              </p>
            </div>
          </div>
        </div>

        {/* ========== DSM Stats (non-admin only) ========== */}
        {!userIsAdmin && <PosStatsCards stats={stats} />}

        {/* ========== TABS ========== */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="bg-background/60 backdrop-blur-xl p-1.5 rounded-2xl border border-border/40 sticky top-4 z-10 shadow-lg shadow-black/5">
            <TabsList
              className={`grid w-full h-12 bg-transparent gap-1 ${
                userIsAdmin ? "max-w-2xl grid-cols-3" : "max-w-md grid-cols-2"
              }`}
            >
              {userIsAdmin && (
                <TabsTrigger
                  value="overview"
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-200 text-sm font-bold gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  {language === "fr" ? "Vue d'ensemble" : "Overview"}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="list"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-200 text-sm font-bold gap-2"
              >
                <LayoutList className="h-4 w-4" />
                {t.pages.sales.pos.tabs.list}
              </TabsTrigger>
              <TabsTrigger
                value="deploy"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-200 text-sm font-bold gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.pages.sales.pos.tabs.deploy}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ========== ADMIN OVERVIEW TAB ========== */}
          {userIsAdmin && (
            <TabsContent value="overview" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <AdminPosOverview
                stats={stats}
                onDsmFilter={handleDsmFilter}
                selectedDsm={filters.dsm_id || ""}
              />

              {/* Admin filtered POS list */}
              {(filters.dsm_id || filters.search || filters.status) && (
                <div className="mt-6">
                  <PosList
                    data={posData.data}
                    pagination={{
                      total: posData.total,
                      currentPage: posData.current_page,
                      lastPage: posData.last_page,
                    }}
                    filters={filters}
                    showDsm={true}
                  />
                </div>
              )}
            </TabsContent>
          )}

          {/* ========== LIST TAB ========== */}
          <TabsContent value="list" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <PosList
              data={posData.data}
              pagination={{
                total: posData.total,
                currentPage: posData.current_page,
                lastPage: posData.last_page,
              }}
              filters={filters}
              showDsm={userIsAdmin}
            />
          </TabsContent>

          {/* ========== DEPLOY TAB ========== */}
          <TabsContent value="deploy" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-border/40 shadow-2xl overflow-hidden bg-card/80 backdrop-blur-xl ring-1 ring-border/30">
              <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {t.pages.sales.pos.deploy.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t.pages.sales.pos.deploy.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-8">
                <DeploymentForm 
                  agents={agents} 
                  dsms={stats?.dsm_list || []} 
                  userIsAdmin={userIsAdmin} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </Layout>
  );
}
