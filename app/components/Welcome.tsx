import { Logo } from './Logo';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useTranslation, useAuth } from '~/hooks';
import { Link } from 'react-router';
import { 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  UserPlus,
  ClipboardList,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import logoUrl from '~/assets/logo.png';
import { hasPermission, isAdmin } from '~/lib/permissions';
import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';

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

  // Utiliser une version "hydration-safe" de isAuthenticated
  // Pendant l'hydratation (isMounted=false), on affiche toujours la version publique
  const safeIsAuthenticated = isMounted && isAuthenticated;

  const features = [
    {
      icon: Smartphone,
      title: language === 'fr' ? 'Gestion de cartes SIM' : 'SIM Card Management',
      description: language === 'fr' 
        ? 'Gérez facilement vos stocks de cartes SIM avec notre interface intuitive'
        : 'Easily manage your SIM card inventory with our intuitive interface',
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? 'Suivi des ventes' : 'Sales Tracking',
      description: language === 'fr'
        ? 'Suivez vos performances en temps réel avec des statistiques détaillées'
        : 'Track your performance in real-time with detailed statistics',
    },
    {
      icon: Shield,
      title: language === 'fr' ? 'Sécurisé et fiable' : 'Secure & Reliable',
      description: language === 'fr'
        ? 'Vos données sont protégées avec les plus hauts standards de sécurité'
        : 'Your data is protected with the highest security standards',
    },
    {
      icon: Zap,
      title: language === 'fr' ? 'Activation rapide' : 'Fast Activation',
      description: language === 'fr'
        ? 'Activez vos cartes SIM en quelques clics seulement'
        : 'Activate your SIM cards with just a few clicks',
    },
  ];

  const getDashboardActions = () => {
    if (!safeIsAuthenticated || !user) return [];

    const actions = [];

    // Recherche Client
    if (hasPermission(user, 'view-orders') || hasPermission(user, 'create-orders')) {
      actions.push({
        title: t.nav.searchCustomer,
        description: language === 'fr' ? 'Rechercher et vérifier les informations d\'un client' : 'Search and verify customer information',
        icon: Search,
        href: "/customers/search",
        color: "bg-blue-500",
        permission: 'view-orders'
      });
    }

    // Nouveau Client
    if (hasPermission(user, 'create-orders')) {
      actions.push({
        title: t.nav.newCustomer,
        description: language === 'fr' ? 'Enregistrer un nouveau client dans la plateforme' : 'Register a new customer in the platform',
        icon: UserPlus,
        href: "/customers/create",
        color: "bg-emerald-500",
        permission: 'create-orders'
      });
    }

    // Activation SIM
    if (hasPermission(user, 'create-requests')) {
      actions.push({
        title: t.nav.simActivation,
        description: language === 'fr' ? 'Initier une nouvelle demande d\'activation de SIM' : 'Initiate a new SIM activation request',
        icon: Zap,
        href: "/sales/activation",
        color: "bg-amber-500",
        permission: 'create-requests'
      });
    }

    // Requêtes d'Activation
    if (hasPermission(user, 'process-requests') || hasPermission(user, 'approve-requests')) {
      actions.push({
        title: t.nav.activationRequests,
        description: language === 'fr' ? 'Gérer et traiter les demandes d\'activation en attente' : 'Manage and process pending activation requests',
        icon: ClipboardList,
        href: "/sales/activation-requests",
        color: "bg-purple-500",
        permission: 'process-requests'
      });
    }

    // Administration
    if (isAdmin(user)) {
      actions.push({
        title: t.nav.admin,
        description: language === 'fr' ? 'Accéder aux paramètres et à la gestion du système' : 'Access system settings and management',
        icon: Settings,
        href: "/admin",
        color: "bg-slate-700",
        permission: 'admin-access'
      });
    }

    return actions;
  };

  const dashboardActions = getDashboardActions();

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
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">
              {language === 'fr' ? 'Vos fonctionnalités' : 'Your features'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href} className="group">
                  <Card className="h-full border-2 border-transparent hover:border-babana-cyan/50 transition-all duration-300 hover:shadow-2xl hover:shadow-babana-cyan/10 dark:hover:shadow-babana-cyan/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg",
                          action.color
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-babana-cyan transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center text-babana-cyan font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>{language === 'fr' ? 'Accéder' : 'Access'}</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                      </div>
                    </CardContent>
                    
                    {/* Progress indicator on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-babana-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Landing Features Section (Always visible, but secondary if authenticated) */}
      <section className={cn(
        "relative py-16",
        safeIsAuthenticated ? "mt-12 bg-transparent" : "bg-linear-to-b from-transparent to-babana-navy/5 dark:to-babana-cyan/5"
      )}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'fr' ? 'Pourquoi choisir BABANA ?' : 'Why Choose BABANA?'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Une plateforme complète pour gérer vos activités de vente de SIM'
                : 'A complete platform to manage your SIM sales activities'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-babana-cyan/50 transition-all duration-300 hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-babana-cyan to-babana-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section (Visible if not authenticated or as footer) */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-babana-navy to-babana-blue dark:from-babana-navy/80 dark:to-babana-cyan/80 p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl font-bold text-white">500+</div>
                <div className="text-babana-cyan font-medium">{language === 'fr' ? 'Partenaires actifs' : 'Active Partners'}</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl font-bold text-white">50K+</div>
                <div className="text-babana-cyan font-medium">{language === 'fr' ? 'SIM vendues' : 'SIMs Sold'}</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl font-bold text-white">99.9%</div>
                <div className="text-babana-cyan font-medium">{language === 'fr' ? 'Disponibilité' : 'Uptime'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

