import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from '~/hooks';

interface SearchLoaderProps {
  message?: string;
}

/**
 * Composant de chargement élégant pour la recherche de clients
 * Avec animations et effets visuels impressionnants
 */
export function SearchLoader({ message }: SearchLoaderProps) {
  const { t } = useTranslation();
  const displayMessage = message || t.customerSearch.searching || 'Recherche en cours...';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Carte principale avec effet glassmorphism */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-12 md:p-16 relative overflow-hidden">
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          
          {/* Contenu */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Spinner principal avec effets multiples */}
            <div className="relative">
              {/* Cercles concentriques animés */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Spinner central */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
              </div>
              
              {/* Icônes flottantes */}
              <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0s' }}>
                <Sparkles className="w-6 h-6 text-primary/60" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Search className="w-6 h-6 text-primary/60" />
              </div>
            </div>

            {/* Message avec animation */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground animate-pulse">
                {displayMessage}
              </h3>
              <p className="text-sm text-muted-foreground">
                Veuillez patienter pendant que nous recherchons...
              </p>
            </div>

            {/* Barre de progression animée */}
            <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-primary via-primary/60 to-primary rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* Indicateurs de statut */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Connexion sécurisée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span>Recherche en cours</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); width: 0%; }
          50% { transform: translateX(0%); width: 70%; }
          100% { transform: translateX(100%); width: 100%; }
        }
      `}</style>
    </div>
  );
}

