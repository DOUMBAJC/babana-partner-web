import { useState, useEffect } from "react";
import { data, useNavigate, useFetcher, Link } from "react-router";
import { Layout } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { hasAnyRole, isAdmin } from "~/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  MapPin, 
  Smartphone, 
  User as UserIcon, 
  Store, 
  Loader2, 
  Navigation,
  Save,
  Search,
  CheckCircle2
} from "lucide-react";
import { GeolocationButton } from "~/components";
import type { Route } from "./+types/redeploy.$id";
import type { RoleSlug } from "~/types";

const AUTHORIZED_ROLES: RoleSlug[] = ["dsm", "admin", "super_admin"];

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);

  if (!user || !hasAnyRole(user, AUTHORIZED_ROLES)) {
    throw new Response("Unauthorized", { status: 403 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    const [posResponse, agentsResponse, dsmListResponse] = await Promise.all([
      api.get(`/dsm/pos/${params.id}`),
      api.get("/dsm/pos/agents"),
      isAdmin(user) ? api.get("/admin/pos/statistics") : Promise.resolve({ data: { data: { dsm_list: [] } } })
    ]);

    return data({
      user,
      userIsAdmin: isAdmin(user),
      pos: posResponse.data.data,
      agents: agentsResponse.data.data?.data || agentsResponse.data.data || [],
      dsms: dsmListResponse.data.data?.dsm_list || []
    });
  } catch (error: any) {
    console.error("Error loading POS for redeploy:", error.message);
    throw new Response("Not Found", { status: 404 });
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const api = await createAuthenticatedApi(request);
  const formData = await request.formData();

  try {
    const response = await api.put(`/dsm/pos/${params.id}`, {
      pos_number: formData.get("pos_number"),
      name: formData.get("name"),
      agent_id: formData.get("agent_id") || undefined,
      dsm_id: formData.get("dsm_id") || undefined,
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      status: formData.get("status"),
    });

    return data({ success: true, message: response.data.message });
  } catch (error: any) {
    return data({ 
      success: false, 
      error: error.response?.data?.message || "Failed to update POS",
      errors: error.response?.data?.errors
    }, { status: error.response?.status || 500 });
  }
}

export default function RedeployPosPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { user, userIsAdmin, pos, agents, dsms } = loaderData;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  usePageTitle(t.pages.sales.pos.redeploy.title);

  const [formData, setFormData] = useState({
    pos_number: pos.pos_number || "",
    name: pos.name || "",
    agent_id: pos.agent_id || "",
    dsm_id: pos.dsm_id || "",
    latitude: pos.latitude || "",
    longitude: pos.longitude || "",
    status: pos.status || "active"
  });
  const [agentSearch, setAgentSearch] = useState("");
  const [dsmSearch, setDsmSearch] = useState("");

  const filteredAgents = agents.filter((agent: any) => 
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.email?.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const filteredDsms = dsms.filter((dsm: any) => 
    dsm.name.toLowerCase().includes(dsmSearch.toLowerCase()) ||
    dsm.email?.toLowerCase().includes(dsmSearch.toLowerCase())
  );


  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message || t.pages.sales.pos.redeploy.success);
      setTimeout(() => navigate("/sales/pos?tab=list"), 1500);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onLocationFound = (lat: string, lng: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link 
          to="/sales/pos?tab=list" 
          className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t.actions.back || 'Retour à la liste'}
        </Link>
        
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Smartphone className="h-7 w-7" />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">{t.pages.sales.pos.redeploy.title}</h1>
                <p className="text-muted-foreground text-lg">{t.pages.sales.pos.redeploy.subtitle}</p>
             </div>
          </div>

          <Card className="border-border/40 shadow-2xl overflow-hidden bg-background/40 backdrop-blur-3xl ring-1 ring-border/50">
            <CardHeader className="border-b border-border/30 bg-muted/20 pb-8 px-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                       <Store className="h-5 w-5 text-primary" />
                       {formData.name || pos.pos_number}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium">ID: {pos.id}</CardDescription>
                  </div>
                  <Badge variant={formData.status === 'active' ? 'outline' : 'destructive'} className="h-7 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
                    {formData.status}
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="p-8">
              <fetcher.Form method="post" className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-primary" />
                        {t.pages.sales.pos.deploy.form.posNumber}
                      </Label>
                      <Input
                        name="pos_number"
                        value={formData.pos_number}
                        onChange={handleInputChange}
                        className="h-14 rounded-xl border-border/50 bg-muted/20 focus:bg-background focus:ring-primary/10 transition-all font-bold text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 text-primary" />
                        {t.pages.sales.pos.deploy.form.posName}
                      </Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-14 rounded-xl border-border/50 bg-muted/20 focus:bg-background focus:ring-primary/10 transition-all font-bold text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-3.5 w-3.5 text-primary" />
                        {t.pages.sales.pos.deploy.form.agent}
                      </Label>
                      <Select value={formData.agent_id} onValueChange={(v) => setFormData(p => ({ ...p, agent_id: v }))}>
                        <SelectTrigger className="h-14 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all font-bold text-lg">
                          <SelectValue placeholder={t.pages.sales.pos.deploy.form.agent} />
                        </SelectTrigger>
                        <SelectContent className="p-0 border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-3xl rounded-2xl overflow-hidden min-w-[280px]">
                          <div className="bg-muted/30 p-3 pt-4 border-b border-border/10 space-y-3">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Agent Assigné</span>
                              <Badge variant="outline" className="h-4 text-[9px] px-1 font-bold border-primary/20 bg-primary/5 text-primary">
                                {filteredAgents.length} dispos
                              </Badge>
                            </div>
                            <div className="relative group">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input 
                                placeholder={t.pages.sales.pos.deploy.form.searchPlaceholder} 
                                className="pl-9 h-10 border-none bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/20 text-sm rounded-xl placeholder:text-muted-foreground/60"
                                value={agentSearch}
                                onChange={(e) => setAgentSearch(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <ScrollArea className="h-[280px]">
                            <div className="p-2 space-y-1">
                              <SelectItem value="none" className="py-3 px-3 rounded-xl focus:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/10 transition-all font-medium text-muted-foreground italic">
                                {t.pages.sales.pos.deploy.form.none}
                              </SelectItem>
                              
                              {filteredAgents.map((agent: any) => (
                                <SelectItem 
                                  key={agent.id} 
                                  value={agent.id} 
                                  className="py-3 px-3 rounded-xl focus:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/10 transition-all font-medium"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold">{agent.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">{agent.email}</span>
                                  </div>
                                </SelectItem>
                              ))}

                              {filteredAgents.length === 0 && (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                  Aucun agent trouvé
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="agent_id" value={formData.agent_id === "none" ? "" : formData.agent_id} />
                    </div>

                    {userIsAdmin && dsms.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-violet-500 flex items-center gap-2">
                          <UserIcon className="h-3.5 w-3.5" />
                          District Sales Manager (DSM)
                        </Label>
                        <Select value={formData.dsm_id} onValueChange={(v) => setFormData(p => ({ ...p, dsm_id: v }))}>
                          <SelectTrigger className="h-14 rounded-xl border-violet-500/30 bg-violet-500/5 focus:bg-background transition-all font-bold text-lg ring-offset-background disabled:opacity-50">
                            <SelectValue placeholder="Assigner à un DSM..." />
                          </SelectTrigger>
                          <SelectContent className="p-0 border-border/50 shadow-[0_20px_50px_rgba(30,10,60,0.3)] backdrop-blur-3xl rounded-2xl overflow-hidden min-w-[280px]">
                            <div className="bg-violet-500/5 p-3 pt-4 border-b border-border/10 space-y-3">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-violet-500/70">District Managers</span>
                                <Badge variant="outline" className="h-4 text-[9px] px-1 font-bold border-violet-500/20 bg-violet-500/5 text-violet-500">
                                  {filteredDsms.length} actifs
                                </Badge>
                              </div>
                              <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                                <Input 
                                  placeholder={t.pages.sales.pos.deploy.form.searchPlaceholder} 
                                  className="pl-9 h-10 border-none bg-background/50 focus-visible:ring-1 focus-visible:ring-violet-500/20 text-sm rounded-xl placeholder:text-muted-foreground/60"
                                  value={dsmSearch}
                                  onChange={(e) => setDsmSearch(e.target.value)}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            <ScrollArea className="h-[280px]">
                              <div className="p-2 space-y-1">
                                {filteredDsms.map((dsm: any) => (
                                  <SelectItem
                                    key={dsm.id}
                                    value={dsm.id}
                                    className="py-3 px-3 rounded-xl focus:bg-violet-500/5 cursor-pointer border border-transparent hover:border-violet-500/10 transition-all font-medium"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold">{dsm.name}</span>
                                      <span className="text-[10px] text-muted-foreground font-normal">{dsm.email}</span>
                                    </div>
                                  </SelectItem>
                                ))}

                                {filteredDsms.length === 0 && (
                                  <div className="py-8 text-center text-xs text-muted-foreground">
                                    Aucun DSM trouvé
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="dsm_id" value={formData.dsm_id} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-8 p-8 rounded-2xl bg-muted/30 border border-border/30 flex flex-col justify-between">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {t.pages.sales.pos.deploy.form.location}
                          </Label>
                          <GeolocationButton 
                            onLocationFound={onLocationFound} 
                            label="Actualiser GPS" 
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest">Latitude</Label>
                             <Input name="latitude" value={formData.latitude} onChange={handleInputChange} className="h-11 rounded-lg border-border/40 bg-background/50 font-mono text-xs" required />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest">Longitude</Label>
                             <Input name="longitude" value={formData.longitude} onChange={handleInputChange} className="h-11 rounded-lg border-border/40 bg-background/50 font-mono text-xs" required />
                          </div>
                       </div>

                       <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
                          <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                          <p className="text-xs text-foreground/70 leading-relaxed font-bold uppercase tracking-wide">
                            Le redéploiement d'un POS enregistre l'historique de ses positions successives pour un audit commercial précis.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-4">
                        <Label className="text-xs font-black uppercase tracking-widest">Statut du POS :</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v }))}>
                          <SelectTrigger className="w-40 h-10 rounded-lg border-border/40 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-xl">
                            <SelectItem value="active" className="text-green-600 font-bold">Actif</SelectItem>
                            <SelectItem value="inactive" className="text-red-600 font-bold">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="status" value={formData.status} />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full h-16 rounded-2xl text-lg font-black bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.4)] hover:translate-y-[-2px] hover:scale-[1.01] transition-all duration-300 active:scale-[0.98] group overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {isSubmitting ? (
                          <div className="flex items-center gap-3 relative z-10">
                            <Loader2 className="h-6 w-6 animate-spin stroke-[3px]" />
                            <span className="tracking-tight">Mise à jour...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-white/10 p-1.5 rounded-lg mr-1 group-hover:bg-white/20 transition-colors">
                              <Save className="h-6 w-6 transition-transform group-hover:scale-110 stroke-[2.5px]" />
                            </div>
                            <span className="tracking-tight">{t.actions?.save || 'Enregistrer les modifications'}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
