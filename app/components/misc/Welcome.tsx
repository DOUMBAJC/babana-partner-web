import { Logo } from '~/components/Logo';
import { Button } from '~/components/ui/button';
import { FeatureCard } from '~/components/features/FeatureCard';
import { useTranslation, useAuth } from '~/hooks';
import { Link } from 'react-router';
import { 
  Zap,
  ArrowRight,
  UserPlus,
  ClipboardList,
  Settings,
  KeyRound,
  Sparkles,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import logoUrl from '~/assets/logo.png';
import { hasPermission, isAdmin } from '~/lib/permissions';
import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import type { Permission } from '~/types/auth.types';

interface WelcomeProps {
  welcomeMessage?: string | null;
}

export function Welcome({ welcomeMessage }: WelcomeProps) {
  const { t, language } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (welcomeMessage) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage]);

  const safeIsAuthenticated = isMounted && isAuthenticated;

  const getDashboardActions = () => {
    const allActions = [
      {
        title: t.pages.customers.identify.title,
        description: t.pages.customers.identify.description,
        icon: Sparkles,
        href: "/customers/identify",
        color: "bg-pink-500",
        permission: 'create-orders' as Permission,
      },
      {
        title: t.nav.searchCustomer,
        description: language === 'fr' ? 'Rechercher et vérifier les informations d\'un client' : 'Search and verify customer information',
        icon: Search,
        href: "/customers/search",
        color: "bg-blue-500",
        permission: 'view-orders' as Permission,
      },
      {
        title: t.nav.newCustomer,
        description: language === 'fr' ? 'Enregistrer un nouveau client dans la plateforme' : 'Register a new customer in the platform',
        icon: UserPlus,
        href: "/customers/create",
        color: "bg-emerald-500",
        permission: 'create-orders' as Permission,
      },
      {
        title: t.nav.simActivation,
        description: language === 'fr' ? 'Voir les demandes d\'activation de SIM' : 'View SIM activation requests',
        icon: Zap,
        href: "/sales/activation-requests",
        color: "bg-amber-500",
        permission: 'create-requests' as Permission,
      },
      {
        title: t.nav.activationRequests,
        description: language === 'fr' ? 'Gérer et traiter les demandes d\'activation en attente' : 'Manage and process pending activation requests',
        icon: ClipboardList,
        href: "/sales/activation-requests",
        color: "bg-purple-500",
        permission: 'process-requests' as Permission,
      },
      {
        title: t.nav.admin,
        description: language === 'fr' ? 'Accéder aux paramètres et à la gestion du système' : 'Access system settings and management',
        icon: Settings,
        href: "/admin",
        color: "bg-slate-700",
        permission: 'admin-access' as Permission,
      },
      {
        title: t.nav.camtelLogins,
        description: language === 'fr'
          ? 'Gérer les identifiants CAMTEL (admins uniquement)'
          : 'Manage CAMTEL credentials (admins only)',
        icon: KeyRound,
        href: "/admin/camtel-logins",
        color: "bg-cyan-600",
        permission: 'admin-access' as Permission,
      },
    ];

    // Retourner toutes les actions avec l'info d'accès
    return allActions.map(action => {
      const hasBasePermission = safeIsAuthenticated && user && action.permission ? (
        hasPermission(user, action.permission) ||
        (action.permission === 'admin-access' && isAdmin(user))
      ) : false;

      // Vérification spécifique des crédits pour l'identification
      const hasRequiredCredits = action.href === "/customers/identify" 
        ? (user?.wallet?.balance ?? 0) >= 1 
        : true;

      return {
        ...action,
        hasAccess: hasBasePermission && hasRequiredCredits,
      };
    });
  };

  // Ne garder que les actions accessibles
  const dashboardActions = getDashboardActions().filter(a => a.hasAccess);

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* Alert Welcome Message - Client Only */}
      {isMounted && showWelcome && welcomeMessage && (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white dark:bg-gray-800 border-2 border-babana-cyan/50 shadow-2xl shadow-babana-cyan/20 rounded-2xl p-4 max-w-lg w-full flex items-center gap-4 relative">
            <div className="bg-babana-cyan/10 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-babana-cyan" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {language === 'fr' ? 'Bienvenue !' : 'Welcome!'}
              </p>
              <p className="text-sm text-muted-foreground">{welcomeMessage}</p>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={cn(
        "relative flex items-center transition-all duration-700",
        safeIsAuthenticated ? "pt-12 pb-8" : "min-h-[90vh] py-20"
      )}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/10 via-white/50 to-babana-navy/5 dark:from-babana-navy dark:via-gray-900/50 dark:to-babana-cyan/10 -z-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-full blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-babana-navy/20 dark:bg-babana-navy/30 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />
        
        <div className="container relative mx-auto px-4">
          <div className={cn(
            "flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto",
            safeIsAuthenticated ? "items-start text-left" : "items-center text-center"
          )}>
            {!safeIsAuthenticated && (
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-babana-cyan/30 dark:bg-babana-cyan/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <Logo logoUrl={logoUrl} />
              </div>
            )}

            <div className="space-y-4">
              <h1 className={cn(
                "font-bold leading-tight tracking-tight",
                safeIsAuthenticated ? "text-3xl md:text-5xl" : "text-5xl md:text-7xl"
              )}>
                {safeIsAuthenticated ? (
                  <span className="flex flex-col">
                    <span className="text-muted-foreground font-medium text-xl md:text-2xl mb-2">
                      {language === 'fr' ? 'Bonjour,' : 'Hello,'} {user?.name}
                    </span>
                    <span className="bg-linear-to-r from-babana-navy via-babana-cyan to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent">
                      {t.home.welcomeMessage}
                    </span>
                  </span>
                ) : (
                  <span className="bg-linear-to-r from-babana-navy via-babana-cyan to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                    {t.home.title}
                  </span>
                )}
              </h1>
              
              {!safeIsAuthenticated && (
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t.home.subtitle}
                </p>
              )}
            </div>

            {!safeIsAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue hover:shadow-xl hover:shadow-babana-cyan/50 dark:hover:shadow-babana-cyan/30 transition-all duration-300 text-white px-8 h-14 text-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t.home.getStarted}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-babana-cyan/50 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/10 hover:border-babana-cyan transition-all duration-300 px-8 h-14 text-lg"
                  >
                    {t.actions.login}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Actions Grid (Only if Authenticated) */}
      {safeIsAuthenticated && dashboardActions.length > 0 && (
        <section className="container mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'fr' ? 'Vos fonctionnalités' : 'Your features'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr' 
                  ? `${dashboardActions.length} fonctionnalité${dashboardActions.length > 1 ? 's' : ''} disponible${dashboardActions.length > 1 ? 's' : ''}` 
                  : `${dashboardActions.length} feature${dashboardActions.length > 1 ? 's' : ''} available`}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardActions.map((action, index) => (
              <FeatureCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                href={action.href}
                color={action.color}
                hasAccess={action.hasAccess}
                actionLabel={language === 'fr' ? 'Accéder' : 'Access'}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

