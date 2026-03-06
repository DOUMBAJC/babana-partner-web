import { data, useNavigate, useSearchParams } from "react-router";
import { Layout } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { hasAnyRole } from "~/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Toaster } from "~/components/ui/toaster";
import { PosList } from "./components/PosList";
import { DeploymentForm } from "./components/DeploymentForm";
import { PosStatsCards } from "./components/PosStatsCards";
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

  try {
    const api = await createAuthenticatedApi(request);
    const [posResponse, agentsResponse, statsResponse] = await Promise.all([
      api.get("/dsm/pos", {
        params: { search, status, page, per_page: 10 }
      }),
      api.get("/admin/users", {
        params: { role: 'vendeur', per_page: 100 }
      }),
      api.get("/dsm/pos/statistics").catch(() => ({ data: { data: null } })),
    ]);

    return data({
      user,
      posData: posResponse.data.data,
      agents: agentsResponse.data.data?.data || agentsResponse.data.data || [],
      stats: statsResponse.data.data || { total: 0, active: 0, inactive: 0, this_month: 0 },
      filters: { search, status, page }
    });
  } catch (error: any) {
    console.error("Error loading POS:", error.message);
    return data({
      user,
      posData: { data: [], total: 0, current_page: 1, last_page: 1 },
      agents: [],
      stats: { total: 0, active: 0, inactive: 0, this_month: 0 },
      filters: { search, status, page },
      error: "Failed to load points of sale"
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
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
      });

      return data({ success: true, message: response.data.message });
    } catch (error: any) {
      return data({ 
        success: false, 
        error: error.response?.data?.message || "Failed to deploy POS",
        errors: error.response?.data?.errors
      }, { status: error.response?.status || 500 });
    }
  }

  if (intent === "delete") {
    const pos_id = formData.get("pos_id") as string;
    const deletion_note = formData.get("deletion_note") as string;
    try {
      const response = await api.delete(`/dsm/pos/${pos_id}`, {
        data: { deletion_note: deletion_note || undefined }
      });
      return data({ success: true, message: response.data.message });
    } catch (error: any) {
      return data({ 
        success: false, 
        error: error.response?.data?.message || "Failed to delete POS"
      }, { status: error.response?.status || 500 });
    }
  }

  return data({ success: false, error: "Invalid intent" }, { status: 400 });
}

export default function PosManagementPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { user, posData, agents, stats, filters } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeTab = searchParams.get("tab") || "list";

  usePageTitle(t.pages.sales.pos.title);

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("tab", value);
      return prev;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t.pages.sales.pos.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              {t.pages.sales.pos.description}
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <PosStatsCards stats={stats} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="flex items-center justify-between bg-background/50 backdrop-blur-sm p-1 rounded-xl border border-border sticky top-4 z-10 shadow-sm">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-transparent">
              <TabsTrigger 
                value="list" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 text-base font-medium"
              >
                {t.pages.sales.pos.tabs.list}
              </TabsTrigger>
              <TabsTrigger 
                value="deploy" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 text-base font-medium"
              >
                {t.pages.sales.pos.tabs.deploy}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <PosList 
              data={posData.data} 
              pagination={{
                total: posData.total,
                currentPage: posData.current_page,
                lastPage: posData.last_page
              }}
              filters={filters}
            />
          </TabsContent>

          <TabsContent value="deploy" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Card className="border-border/50 shadow-xl overflow-hidden bg-background/50 backdrop-blur-md">
              <CardHeader className="border-b border-border/50 bg-muted/30 pb-6">
                <CardTitle className="text-2xl font-semibold">{t.pages.sales.pos.deploy.title}</CardTitle>
                <CardDescription className="text-base">{t.pages.sales.pos.deploy.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <DeploymentForm agents={agents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </Layout>
  );
}
