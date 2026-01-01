import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

/**
 * Composant d'overlay de chargement réutilisable
 * Affiche un spinner animé avec un message optionnel
 */
export function LoadingOverlay({ message = "Chargement en cours...", className = "" }: LoadingOverlayProps) {
  return (
    <div className={`absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg ${className}`}>
      <div className="flex flex-col items-center gap-3 bg-background/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl border border-border/50">
        <div className="relative">
          {/* Cercle extérieur qui pulse */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          {/* Spinner principal */}
          <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
        </div>
        <p className="text-sm font-medium text-foreground text-center">
          {message}
        </p>
      </div>
    </div>
  );
}

