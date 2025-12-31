import { useNavigate } from 'react-router';
import { ShieldAlert, Home, ArrowLeft, LogOut, Mail, User2, BadgeCheck, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components';
import { useAuth, useTranslation, usePageTitle } from '~/hooks';

/**
 * Page 401 - Non autorisé
 * Affichée lorsqu'un utilisateur authentifié tente d'accéder à une ressource
 * pour laquelle il n'a pas les permissions requises
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  usePageTitle(t.pages.unauthorized.title);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-red-50/30 to-slate-100 p-4 dark:from-slate-950 dark:via-red-950/10 dark:to-slate-900">
      {/* Éléments de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/20 dark:bg-red-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200/30 dark:bg-slate-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="relative w-full max-w-lg bg-card/95 backdrop-blur-sm text-card-foreground border-border shadow-2xl overflow-hidden">
        {/* Barre décorative supérieure */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-500 via-red-600 to-red-500" />
        
        <CardHeader className="space-y-6 text-center pt-8 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              {/* Cercle d'animation en arrière-plan */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 dark:bg-red-500/10 animate-ping" />
              <div className="relative rounded-full bg-linear-to-br from-red-100 to-red-50 p-5 dark:from-red-900/30 dark:to-red-950/20 ring-4 ring-red-100/50 dark:ring-red-900/20 shadow-lg">
                <ShieldAlert className="h-14 w-14 text-red-600 dark:text-red-400" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold text-foreground tracking-tight">
              Accès refusé
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">
          {user && (
            <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <User2 className="h-4 w-4 text-primary" />
                  <span>Connecté en tant que</span>
                </div>
                
                <div className="flex items-center gap-3 pl-6">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                </div>

                <div className="flex items-start gap-3 pl-6">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Rôle(s) actuel(s)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((role, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleGoHome} 
              className="w-full h-11 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200" 
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>

            <Button 
              onClick={handleGoBack} 
              className="w-full h-11 text-base font-medium border-2 hover:border-primary/50 transition-all duration-200" 
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la page précédente
            </Button>

            <Button
              onClick={handleLogout}
              className="w-full h-11 text-base font-medium hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              variant="ghost"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>

          <div className="relative mt-8 rounded-xl border-2 border-amber-200/80 dark:border-amber-800/50 bg-linear-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 p-5 shadow-sm overflow-hidden">
            {/* Icône d'arrière-plan décorative */}
            <div className="absolute top-2 right-2 opacity-10 dark:opacity-5">
              <AlertCircle className="h-20 w-20" />
            </div>
            
            <div className="relative space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
                <p className="font-semibold text-amber-900 dark:text-amber-400 text-base">
                  Besoin d'accès ?
                </p>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-500/90 leading-relaxed pl-7">
                Contactez votre administrateur pour demander les permissions nécessaires.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


