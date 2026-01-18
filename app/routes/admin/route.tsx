import {
  ProtectedRoute,
  Can,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  FeatureCard,
  PermissionBadge,
  Layout,
} from '~/components';
import { useAuth, usePermissions, useTranslation, usePageTitle } from '~/hooks';
import { isAdmin } from '~/lib/permissions';
import {
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Crown,
  AlertCircle,
  Key,
  MessageSquare,
} from 'lucide-react';
import type { Permission } from '~/types/auth.types';

/**
 * Page d'administration
 * Accessible uniquement aux utilisateurs avec le rôle admin ou super_admin
 */
export default function AdminPage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.admin.title);
  
  return (
    <Layout>
      <ProtectedRoute role={['admin', 'super_admin']} mode="any">
        <AdminContent />
      </ProtectedRoute>
    </Layout>
  );
}

function AdminContent() {
  
  const { user } = useAuth();
  
  const permissions = usePermissions();

  const adminFeatures = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Créer, modifier et gérer les utilisateurs de la plateforme',
      icon: Users,
      permission: 'view-users' as Permission,
      action: 'Gérer les utilisateurs',
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      title: 'Gestion des produits',
      description: 'Créer et modifier les produits disponibles',
      icon: Package,
      permission: 'view-products' as Permission,
      action: 'Gérer les produits',
      color: 'bg-green-500',
      href: '/admin/products',
    },
    {
      title: 'Gestion des commandes',
      description: 'Voir et traiter toutes les commandes',
      icon: ShoppingCart,
      permission: 'view-orders' as Permission,
      action: 'Gérer les commandes',
      color: 'bg-purple-500',
      href: '/admin/orders',
    },
    {
      title: 'Gestion des requêtes',
      description: 'Traiter et approuver les requêtes d\'activation',
      icon: FileText,
      permission: 'view-requests' as Permission,
      action: 'Gérer les requêtes',
      color: 'bg-indigo-500',
      href: '/admin/requests',
    },
    {
      title: 'Rapports et statistiques',
      description: 'Consulter et générer des rapports détaillés',
      icon: BarChart3,
      permission: 'view-reports' as Permission,
      action: 'Voir les rapports',
      color: 'bg-orange-500',
      href: '/admin/reports',
    },
    {
      title: 'Paramètres système',
      description: 'Configuration avancée de la plateforme',
      icon: Settings,
      permission: 'admin-access' as Permission,
      action: 'Paramètres',
      color: 'bg-slate-700',
      href: '/admin/settings',
    },
    {
      title: 'Gestion des logins CAMTEL',
      description: 'Créer, modifier et supprimer les identifiants CAMTEL (accès admin)',
      icon: Key,
      permission: 'admin-access' as Permission,
      action: 'Gérer les logins',
      color: 'bg-cyan-600',
      href: '/admin/camtel-logins',
    },
    {
      title: 'Gestion du Support',
      description: 'Gérer et répondre aux tickets de support',
      icon: MessageSquare,
      permission: 'admin-access' as Permission,
      action: 'Gérer le support',
      color: 'bg-babana-cyan',
      href: '/admin/support',
    },
  ];

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-babana-cyan/10 rounded-xl">
                <Shield className="h-8 w-8 text-babana-cyan" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Panneau d'administration</h1>
                <p className="text-muted-foreground mt-1">
                  Gérez l'ensemble de la plateforme depuis cet espace
                </p>
              </div>
            </div>
          </div>
          
          {/* User Role Badge */}
          <div className="flex flex-col gap-2 items-end">
            {user?.roles && user.roles.map((role) => (
              <PermissionBadge key={role} role={role} />
            ))}
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-linear-to-r from-babana-cyan/5 to-babana-navy/5 dark:from-babana-cyan/10 dark:to-babana-navy/10 border-babana-cyan/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Connecté en tant que</p>
                <p className="text-lg font-semibold text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>{permissions.permissions.length} permission{permissions.permissions.length > 1 ? 's' : ''} active{permissions.permissions.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Super Admin Only Section */}
      <Can role="super_admin">
        <Card className="border-2 border-purple-500/30 bg-linear-to-br from-purple-500/5 to-purple-600/5 dark:from-purple-500/10 dark:to-purple-600/10 shadow-lg shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Crown className="h-5 w-5" />
              Zone Super Administrateur
            </CardTitle>
            <CardDescription>
              Cette section est visible uniquement par les super administrateurs avec tous les privilèges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                Paramètres avancés
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-400">
                Logs système
              </Button>
            </div>
          </CardContent>
        </Card>
      </Can>

      {/* Admin Features Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fonctionnalités d'administration</h2>
            <p className="text-sm text-muted-foreground">Accédez aux différentes sections de gestion</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminFeatures.map((feature) => {
            const hasAccess =
              feature.permission === ('admin-access' as Permission)
                ? (user ? isAdmin(user) : false) || permissions.can(feature.permission)
                : permissions.can(feature.permission);

            return (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                href={hasAccess ? feature.href : undefined}
                color={feature.color}
                hasAccess={hasAccess}
                actionLabel={feature.action}
              />
            );
          })}
        </div>
      </div>

      {/* Permissions Summary */}
      <Card className="border-babana-cyan/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-babana-cyan" />
            <div>
              <CardTitle>Vos permissions actives</CardTitle>
              <CardDescription>
                Liste complète de toutes les permissions dont vous disposez
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {permissions.permissions.map((permission) => (
              <PermissionBadge key={permission} permission={permission} />
            ))}
          </div>
          {permissions.permissions.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Aucune permission spécifique trouvée
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


