import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { useTranslation } from "~/hooks";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "sonner";
import { 
  MapPin, 
  Smartphone, 
  User as UserIcon, 
  Store, 
  Loader2, 
  CheckCircle2,
  Navigation
} from "lucide-react";

import type { User } from "~/types/auth.types";

interface DeploymentFormProps {
  agents: User[];
}

export function DeploymentForm({ agents }: DeploymentFormProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  
  const [formData, setFormData] = useState({
    pos_number: "",
    name: "",
    agent_id: "",
    latitude: "",
    longitude: ""
  });

  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message || t.pages.sales.pos.deploy.success);
      setFormData({
        pos_number: "",
        name: "",
        agent_id: "",
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setLocationLoading(false);
        toast.success("Position récupérée avec succès.");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Impossible de récupérer votre position. Veuillez l'autoriser dans votre navigateur.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
              <SelectContent className="rounded-xl border-border/50 shadow-2xl backdrop-blur-xl">
                <SelectItem value="none" className="py-3 focus:bg-primary/10">Aucun agent (DSM direct)</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id} className="py-3 focus:bg-primary/10">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {agent.avatar ? <img src={agent.avatar} alt="" className="h-full w-full object-cover" /> : <UserIcon className="h-3 w-3" />}
                      </div>
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="agent_id" value={formData.agent_id === "none" ? "" : formData.agent_id} />
          </div>
        </div>

        <div className="space-y-6 bg-muted/30 p-8 rounded-2xl border border-border/50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {t.pages.sales.pos.deploy.form.location}
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="rounded-lg h-9 font-semibold text-xs uppercase tracking-widest border-primary/20 hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
              >
                {locationLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                {t.pages.sales.pos.deploy.form.getCurrentLocation}
              </Button>
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
            className="w-full h-16 rounded-xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-[0.98] mt-6"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>{t.pages.sales.pos.deploy.form.submitting}</span>
              </div>
            ) : (
              <span>{t.pages.sales.pos.deploy.form.submit}</span>
            )}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}
