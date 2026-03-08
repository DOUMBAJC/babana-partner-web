import { useState } from "react";
import { Button } from "./ui/button";
import { Navigation, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

interface GeolocationButtonProps {
  onLocationFound: (latitude: string, longitude: string) => void;
  label?: string;
  className?: string;
}

export function GeolocationButton({ onLocationFound, label, className }: GeolocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationFound(
          position.coords.latitude.toString(),
          position.coords.longitude.toString()
        );
        setLoading(false);
        setSuccess(true);
        toast.success("Position récupérée avec succès.");
        
        // Reset success state after a while
        setTimeout(() => setSuccess(false), 3000);
      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "Impossible de récupérer votre position.";
        
        if (error.code === error.PERMISSION_DENIED) {
          message = "Veuillez autoriser la géolocalisation dans votre navigateur.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "La position est indisponible.";
        } else if (error.code === error.TIMEOUT) {
          message = "Délai d'attente dépassé.";
        }
        
        toast.error(message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={getCurrentLocation}
      disabled={loading}
      className={cn(
        "relative overflow-hidden group transition-all duration-500",
        "rounded-xl h-11 px-6 border-primary/20",
        "hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-primary/10",
        "flex items-center gap-2.5 font-bold text-[10px] uppercase tracking-[0.15em]",
        success && "border-green-500/50 bg-green-500/5 text-green-600 shadow-green-500/10",
        loading && "border-primary/40 bg-primary/5 cursor-wait",
        className
      )}
    >
      {/* Background Pulse Effect when loading */}
      {loading && (
        <span className="absolute inset-0 bg-primary/20 animate-pulse" />
      )}
      
      {/* Status Icon */}
      <div className="relative">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : success ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 animate-in zoom-in duration-300" />
        ) : (
          <Navigation className={cn(
            "h-4 w-4 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110",
            "text-primary"
          )} />
        )}
      </div>
      
      {/* Text with fade-in effect */}
      <span className="relative z-10">
        {loading ? "Localisation..." : success ? "Position Trouvée" : (label || "Ma Position")}
      </span>

      {/* Premium Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0" />
      
      {/* Shine effect animation */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:animate-shine" />
    </Button>
  );
}
