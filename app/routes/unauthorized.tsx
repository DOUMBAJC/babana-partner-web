import { useNavigate } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components';
import { useAuth } from '~/hooks';

/**
 * Page 401 - Non autorisé
 * Affichée lorsqu'un utilisateur authentifié tente d'accéder à une ressource
 * pour laquelle il n'a pas les permissions requises
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
              <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Accès refusé</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user && (
            <div className="rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800 text-foreground">
              <p className="font-medium text-foreground">Connecté en tant que :</p>
              <p className="mt-1 text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Rôle(s) : {user.roles.join(', ')}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={handleGoHome} className="w-full" variant="default">
              Retour à l'accueil
            </Button>

            <Button onClick={handleGoBack} className="w-full border-border bg-background hover:bg-accent hover:text-accent-foreground" variant="outline">
              Retour à la page précédente
            </Button>

            <Button
              onClick={handleLogout}
              className="w-full hover:bg-accent hover:text-accent-foreground"
              variant="ghost"
            >
              Se déconnecter
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/20">
            <p className="font-medium text-amber-900 dark:text-amber-400">
              Besoin d'accès ?
            </p>
            <p className="mt-1 text-amber-700 dark:text-amber-500">
              Contactez votre administrateur pour demander les permissions nécessaires.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


