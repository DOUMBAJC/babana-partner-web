import {
  ProtectedRoute,
  Can,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '~/components';
import { useAuth, usePermissions, useTranslation, usePageTitle } from '~/hooks';
import {
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';

/**
 * Page d'administration
 * Accessible uniquement aux utilisateurs avec le rôle admin ou super_admin
 */
export default function AdminPage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.admin.title);
  
  return (
    <ProtectedRoute role={['admin', 'super_admin']} mode="any">
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  
  const { user } = useAuth();
  
  const permissions = usePermissions();

  const adminFeatures = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Créer, modifier et gérer les utilisateurs',
      icon: Users,
      permission: 'view-users' as const,
      action: 'Gérer les utilisateurs',
    },
    {
      title: 'Gestion des produits',
      description: 'Créer et modifier les produits',
      icon: Package,
      permission: 'view-products' as const,
      action: 'Gérer les produits',
    },
    {
      title: 'Gestion des commandes',
      description: 'Voir et traiter les commandes',
      icon: ShoppingCart,
      permission: 'view-orders' as const,
      action: 'Gérer les commandes',
    },
    {
      title: 'Gestion des requêtes',
      description: 'Traiter et approuver les requêtes',
      icon: FileText,
      permission: 'view-requests' as const,
      action: 'Gérer les requêtes',
    },
    {
      title: 'Rapports',
      description: 'Consulter et générer des rapports',
      icon: BarChart3,
      permission: 'view-reports' as const,
      action: 'Voir les rapports',
    },
    {
      title: 'Paramètres',
      description: 'Configuration de la plateforme',
      icon: Settings,
      permission: 'admin-access' as const,
      action: 'Paramètres',
    },
  ];

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-babana-cyan" />
          <h1 className="text-4xl font-bold">Panneau d'administration</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Bienvenue, {user?.name} ({user?.email})
        </p>
        <p className="text-sm text-muted-foreground">
          Rôle(s) : {user?.roles.join(', ')}
        </p>
      </div>

      {/* Super Admin Only Section */}
      <Can role="super_admin">
        <Card className="border-babana-cyan bg-babana-cyan/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-babana-cyan" />
              Zone Super Administrateur
            </CardTitle>
            <CardDescription>
              Cette section est visible uniquement par les super administrateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default">
              Accéder aux paramètres avancés
            </Button>
          </CardContent>
        </Card>
      </Can>

      {/* Admin Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map((feature) => {
          const Icon = feature.icon;
          const hasPermission = permissions.can(feature.permission);

          return (
            <Can key={feature.title} permission={feature.permission}>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-babana-cyan/10 p-3">
                      <Icon className="h-6 w-6 text-babana-cyan" />
                    </div>
                    {hasPermission && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Accès autorisé
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            </Can>
          );
        })}
      </div>

      {/* Permissions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vos permissions</CardTitle>
          <CardDescription>
            Liste de toutes vos permissions actives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {permissions.permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full bg-babana-navy/10 px-3 py-1 text-sm font-medium text-babana-navy dark:bg-babana-cyan/10 dark:text-babana-cyan"
              >
                {permission}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


