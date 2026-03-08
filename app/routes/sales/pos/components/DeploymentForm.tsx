import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { useTranslation } from "~/hooks";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "sonner";
import {
  MapPin,
  Smartphone,
  User as UserIcon,
  Store,
  Loader2,
  Search,
  CheckCircle2,
  Navigation,
} from "lucide-react";

import { GeolocationButton } from "~/components";

import type { User } from "~/types/auth.types";

interface DeploymentFormProps {
  agents: User[];
  dsms?: User[];
  userIsAdmin?: boolean;
}

export function DeploymentForm({ agents, dsms = [], userIsAdmin = false }: DeploymentFormProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [formData, setFormData] = useState({
    pos_number: "",
    name: "",
    agent_id: "",
    dsm_id: "",
    latitude: "",
    longitude: ""
  });
  const [agentSearch, setAgentSearch] = useState("");
  const [dsmSearch, setDsmSearch] = useState("");

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.email?.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const filteredDsms = dsms.filter(dsm =>
    dsm.name.toLowerCase().includes(dsmSearch.toLowerCase()) ||
    dsm.email?.toLowerCase().includes(dsmSearch.toLowerCase())
  );


  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message || t.pages.sales.pos.deploy.success);
      setFormData({
        pos_number: "",
        name: "",
        agent_id: "",
        dsm_id: "",
        latitude: "",
        longitude: ""
      });
      // Optionally redirect or switch tab
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (value: string) => {
    setFormData(prev => ({ ...prev, agent_id: value }));
  };

  const onLocationFound = (lat: string, lng: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  return (
    <fetcher.Form method="post" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <input type="hidden" name="intent" value="deploy" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="pos_number" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              {t.pages.sales.pos.deploy.form.posNumber}
            </Label>
            <Input
              id="pos_number"
              name="pos_number"
              value={formData.pos_number}
              onChange={handleInputChange}
              placeholder="e.g. 620XXXXXX"
              className="h-14 rounded-xl border-border bg-background focus:ring-primary/20 transition-all text-lg font-medium"
              required
            />
            {fetcher.data?.errors?.pos_number && (
              <p className="text-sm font-medium text-destructive mt-1.5 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {fetcher.data.errors.pos_number[0]}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              {t.pages.sales.pos.deploy.form.posName}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="h-14 rounded-xl border-border bg-background focus:ring-primary/20 transition-all text-lg font-medium"
              placeholder="e.g. Boutique Maelys"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="agent_id" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              {t.pages.sales.pos.deploy.form.agent}
            </Label>
            <Select value={formData.agent_id} onValueChange={handleAgentChange}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background focus:ring-primary/20 transition-all text-lg font-medium">
                <SelectValue placeholder="Choisir un agent..." />
              </SelectTrigger>
              <SelectContent className="p-0 border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-3xl rounded-2xl overflow-hidden min-w-[280px]">
                <div className="bg-muted/30 p-3 pt-4 border-b border-border/10 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Sélection Agent</span>
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

                    {filteredAgents.map((agent) => (
                      <SelectItem
                        key={agent.id}
                        value={agent.id}
                        className="py-3 px-3 rounded-xl focus:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden group-hover:scale-110 transition-transform">
                            {agent.avatar ? (
                              <img src={agent.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-foreground truncate">{agent.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate opacity-70 group-focus:opacity-100">{agent.email}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}

                    {filteredAgents.length === 0 && (
                      <div className="py-12 px-4 text-center space-y-2">
                        <div className="h-8 w-8 rounded-full bg-muted mx-auto flex items-center justify-center opacity-40">
                          <Search className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Aucun agent trouvé</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </SelectContent>
            </Select>
            <input type="hidden" name="agent_id" value={formData.agent_id === "none" ? "" : formData.agent_id} />
          </div>

          {userIsAdmin && dsms.length > 0 && (
            <div className="space-y-3 pt-2">
              <Label htmlFor="dsm_id" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-violet-500" />
                District Sales Manager (DSM)
              </Label>
              <Select
                value={formData.dsm_id}
                onValueChange={(v) => setFormData(p => ({ ...p, dsm_id: v }))}
                required
              >
                <SelectTrigger className="h-14 rounded-xl border-violet-500/20 bg-violet-500/5 focus:ring-violet-500/20 transition-all text-lg font-medium ring-offset-background disabled:opacity-50">
                  <SelectValue placeholder="Choisir le DSM..." />
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
                      {filteredDsms.map((dsm) => (
                        <SelectItem
                          key={dsm.id}
                          value={dsm.id}
                          className="py-3 px-3 rounded-xl focus:bg-violet-500/5 cursor-pointer border border-transparent hover:border-violet-500/10 transition-all font-medium"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20 overflow-hidden group-hover:scale-110 transition-transform">
                              {dsm.avatar ? (
                                <img src={dsm.avatar} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <UserIcon className="h-4 w-4 text-violet-500" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm text-foreground truncate">{dsm.name}</span>
                              <span className="text-[10px] text-muted-foreground truncate opacity-70">{dsm.email}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}

                      {filteredDsms.length === 0 && (
                        <div className="py-12 px-4 text-center space-y-2">
                          <div className="h-8 w-8 rounded-full bg-muted mx-auto flex items-center justify-center opacity-40">
                            <Search className="h-4 w-4" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Aucun DSM trouvé</p>
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

        <div className="space-y-6 bg-muted/30 p-8 rounded-2xl border border-border/50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {t.pages.sales.pos.deploy.form.location}
              </Label>
              <GeolocationButton 
                onLocationFound={onLocationFound} 
                label={t.pages.sales.pos.deploy.form.getCurrentLocation} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-xs font-semibold uppercase text-muted-foreground">{t.pages.sales.pos.deploy.form.latitude}</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="rounded-lg border-border/50 bg-background/50 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-xs font-semibold uppercase text-muted-foreground">{t.pages.sales.pos.deploy.form.longitude}</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="rounded-lg border-border/50 bg-background/50 h-11"
                  required
                />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                La précision GPS est cruciale pour le suivi de vos agents et la performance commerciale du point de vente.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 rounded-2xl text-lg font-black bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.4)] hover:translate-y-[-2px] hover:scale-[1.01] transition-all duration-300 active:scale-[0.98] mt-6 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {isSubmitting ? (
              <div className="flex items-center gap-3 relative z-10">
                <Loader2 className="h-6 w-6 animate-spin stroke-[3px]" />
                <span className="tracking-tight">{t.pages.sales.pos.deploy.form.submitting}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 relative z-10">
                <CheckCircle2 className="h-6 w-6 group-hover:scale-110 transition-transform stroke-[2.5px]" />
                <span className="tracking-tight">{t.pages.sales.pos.deploy.form.submit}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}
