import { Logo } from './Logo';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useTranslation } from '~/hooks';
import { Link } from 'react-router';
import { 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import logoUrl from '~/assets/logo.png';

export function Welcome() {
  const { t, language } = useTranslation();

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

  const stats = [
    {
      icon: Users,
      value: '500+',
      label: language === 'fr' ? 'Partenaires actifs' : 'Active Partners',
    },
    {
      icon: Smartphone,
      value: '50K+',
      label: language === 'fr' ? 'SIM vendues' : 'SIMs Sold',
    },
    {
      icon: BarChart3,
      value: '99.9%',
      label: language === 'fr' ? 'Disponibilité' : 'Uptime',
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section with Dynamic Background */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/10 via-white to-babana-navy/5 dark:from-babana-navy dark:via-gray-900 dark:to-babana-cyan/10 transition-colors duration-500" />
        
        {/* Decorative Blobs */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-babana-navy/20 dark:bg-babana-navy/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo with Glow Effect */}
            <div className="relative group">
              <div className="absolute inset-0 bg-babana-cyan/30 dark:bg-babana-cyan/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <Logo logoUrl={logoUrl} />
            </div>

            {/* Main Title with Gradient */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-linear-to-r from-babana-navy via-babana-cyan to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                  {t.home.title}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t.home.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue hover:shadow-xl hover:shadow-babana-cyan/50 dark:hover:shadow-babana-cyan/30 transition-all duration-300 text-white px-8"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.home.getStarted}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-babana-cyan/50 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/10 hover:border-babana-cyan transition-all duration-300 px-8"
                >
                  {t.actions.login}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-linear-to-b from-transparent to-babana-navy/5 dark:to-babana-cyan/5">
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
                  className="group relative overflow-hidden border-2 border-transparent hover:border-babana-cyan/50 transition-all duration-300 hover:shadow-xl hover:shadow-babana-cyan/10 dark:hover:shadow-babana-cyan/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Icon with Gradient Background */}
                    <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-babana-cyan to-babana-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-babana-cyan to-babana-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/90 to-babana-blue/90 dark:from-babana-navy/90 dark:to-babana-cyan/90" />
            <div className="absolute inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10" />
            
            <div className="relative px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index}
                      className="flex flex-col items-center text-center space-y-4 group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-lg text-white/90 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

