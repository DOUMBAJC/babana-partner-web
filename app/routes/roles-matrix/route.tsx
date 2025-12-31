import { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  ShoppingBag,
  Settings,
  CreditCard,
  FileText,
  CheckCircle2,
  Lock,
  Globe,
  LayoutDashboard,
  Box,
  BarChart3,
  DollarSign,
  Store,
  ClipboardList
} from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';

// --- Types ---

type PermissionDef = {
  name: string;
  slug: string;
  group: string;
  description: string;
};

type RoleDef = {
  name: string;
  slug: string;
  description: string;
  permissions: string[] | 'all';
  badgeColor: string;
  icon: any;
};

// --- Raw Data from User ---

const PERMISSIONS_LIST: PermissionDef[] = [
  // User Management
  { name: 'Voir les utilisateurs', slug: 'view-users', group: 'users', description: 'Permet de voir la liste des utilisateurs' },
  { name: 'Créer des utilisateurs', slug: 'create-users', group: 'users', description: 'Permet de créer de nouveaux utilisateurs' },
  { name: 'Modifier des utilisateurs', slug: 'edit-users', group: 'users', description: 'Permet de modifier les informations des utilisateurs' },
  { name: 'Supprimer des utilisateurs', slug: 'delete-users', group: 'users', description: 'Permet de supprimer des utilisateurs' },

  // Product Management
  { name: 'Voir les produits', slug: 'view-products', group: 'products', description: 'Permet de voir la liste des produits' },
  { name: 'Créer des produits', slug: 'create-products', group: 'products', description: 'Permet de créer de nouveaux produits' },
  { name: 'Modifier des produits', slug: 'edit-products', group: 'products', description: 'Permet de modifier les produits' },
  { name: 'Supprimer des produits', slug: 'delete-products', group: 'products', description: 'Permet de supprimer des produits' },

  // Order Management
  { name: 'Voir les commandes', slug: 'view-orders', group: 'orders', description: 'Permet de voir les commandes' },
  { name: 'Créer des commandes', slug: 'create-orders', group: 'orders', description: 'Permet de créer des commandes' },
  { name: 'Modifier des commandes', slug: 'edit-orders', group: 'orders', description: 'Permet de modifier des commandes' },
  { name: 'Supprimer des commandes', slug: 'delete-orders', group: 'orders', description: 'Permet de supprimer des commandes' },
  { name: 'Valider des commandes', slug: 'approve-orders', group: 'orders', description: 'Permet de valider des commandes' },

  // Request Management (BA)
  { name: 'Voir les requêtes', slug: 'view-requests', group: 'requests', description: 'Permet de voir les requêtes des BA' },
  { name: 'Créer des requêtes', slug: 'create-requests', group: 'requests', description: 'Permet de créer des requêtes' },
  { name: 'Traiter des requêtes', slug: 'process-requests', group: 'requests', description: 'Permet de traiter les requêtes des BA' },
  { name: 'Approuver des requêtes', slug: 'approve-requests', group: 'requests', description: 'Permet d\'approuver des requêtes' },
  { name: 'Rejeter des requêtes', slug: 'reject-requests', group: 'requests', description: 'Permet de rejeter des requêtes' },

  // Inventory Management
  { name: 'Voir les stocks', slug: 'view-inventory', group: 'inventory', description: 'Permet de voir l\'état des stocks' },
  { name: 'Gérer les stocks', slug: 'manage-inventory', group: 'inventory', description: 'Permet de gérer les stocks' },

  // Reports
  { name: 'Voir les rapports', slug: 'view-reports', group: 'reports', description: 'Permet de voir les rapports' },
  { name: 'Créer des rapports', slug: 'create-reports', group: 'reports', description: 'Permet de créer des rapports' },
  { name: 'Exporter des rapports', slug: 'export-reports', group: 'reports', description: 'Permet d\'exporter des rapports' },

  // Sales
  { name: 'Voir les ventes', slug: 'view-sales', group: 'sales', description: 'Permet de voir les ventes' },
  { name: 'Créer des ventes', slug: 'create-sales', group: 'sales', description: 'Permet de créer des ventes' },
  { name: 'Modifier des ventes', slug: 'edit-sales', group: 'sales', description: 'Permet de modifier des ventes' },

  // POS Management
  { name: 'Gérer les POS', slug: 'manage-pos', group: 'pos', description: 'Permet de gérer les points de vente' },
  { name: 'Voir les POS', slug: 'view-pos', group: 'pos', description: 'Permet de voir les points de vente' },

  // Tasks
  { name: 'Voir ses tâches', slug: 'view-own-tasks', group: 'tasks', description: 'Permet de voir ses propres tâches' },
  { name: 'Gérer ses tâches', slug: 'manage-own-tasks', group: 'tasks', description: 'Permet de gérer ses propres tâches' },
  { name: 'Voir toutes les tâches', slug: 'view-all-tasks', group: 'tasks', description: 'Permet de voir toutes les tâches' },
  { name: 'Assigner des tâches', slug: 'assign-tasks', group: 'tasks', description: 'Permet d\'assigner des tâches' },

  // System
  { name: 'Gérer les rôles', slug: 'manage-roles', group: 'system', description: 'Permet de gérer les rôles et permissions' },
  { name: 'Gérer les paramètres', slug: 'manage-settings', group: 'system', description: 'Permet de gérer les paramètres système' },
  { name: 'Accès administrateur', slug: 'admin-access', group: 'system', description: 'Accès complet à l\'administration' },
];

const ROLES_LIST: RoleDef[] = [
  {
    name: 'Super Administrateur',
    slug: 'super_admin',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme',
    permissions: 'all',
    badgeColor: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    icon: Lock
  },
  {
    name: 'Administrateur',
    slug: 'admin',
    description: 'Accès à la plupart des fonctionnalités administratives',
    permissions: [
      'view-users', 'create-users', 'edit-users',
      'view-products', 'create-products', 'edit-products',
      'view-orders', 'edit-orders', 'approve-orders',
      'view-requests', 'process-requests', 'approve-requests', 'reject-requests',
      'view-inventory', 'manage-inventory',
      'view-reports', 'create-reports', 'export-reports',
      'view-sales', 'view-pos',
      'view-all-tasks', 'assign-tasks',
      'admin-access'
    ],
    badgeColor: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    icon: Shield
  },
  {
    name: 'Brand Ambassador (BA)',
    slug: 'ba',
    description: 'Ambassadeur de marque avec accès aux fonctionnalités de base',
    permissions: [
      'view-products',
      'view-orders', 'create-orders',
      'create-requests', 'view-requests',
      'view-own-tasks', 'manage-own-tasks',
    ],
    badgeColor: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    icon: Globe
  },
  {
    name: 'Activateur',
    slug: 'activateur',
    description: 'Gère et traite les requêtes des BA',
    permissions: [
      'view-users',
      'view-products',
      'view-orders', 'edit-orders', 'create-orders',
      'view-requests', 'process-requests', 'approve-requests', 'reject-requests',
      'view-inventory',
      'view-reports',
      'view-own-tasks', 'manage-own-tasks', 'view-all-tasks',
    ],
    badgeColor: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    icon: Users
  },
  {
    name: 'Point de Vente (POS)',
    slug: 'pos',
    description: 'Point de vente avec les droits des BA et des droits supplémentaires',
    permissions: [
      'view-products',
      'view-orders', 'create-orders', 'edit-orders',
      'create-requests', 'view-requests',
      'view-inventory',
      'view-sales', 'create-sales',
      'view-own-tasks', 'manage-own-tasks',
    ],
    badgeColor: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    icon: Store
  },
  {
    name: 'District Sales Manager (DSM)',
    slug: 'dsm',
    description: 'Gère les points de vente (POS)',
    permissions: [
      'view-users',
      'view-products',
      'view-orders', 'edit-orders', 'approve-orders',
      'view-requests', 'process-requests',
      'view-inventory', 'manage-inventory',
      'view-reports', 'create-reports', 'export-reports',
      'view-sales', 'edit-sales',
      'manage-pos', 'view-pos',
      'view-own-tasks', 'manage-own-tasks', 'view-all-tasks', 'assign-tasks',
    ],
    badgeColor: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
    icon: BarChart3
  },
  {
    name: 'Vendeur',
    slug: 'vendeur',
    description: 'Vend les produits aux BA',
    permissions: [
      'view-users',
      'view-products',
      'view-orders', 'create-orders', 'edit-orders',
      'view-inventory',
      'view-sales', 'create-sales', 'edit-sales',
      'view-own-tasks', 'manage-own-tasks',
    ],
    badgeColor: "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20",
    icon: ShoppingBag
  },
  {
    name: 'Client',
    slug: 'client',
    description: 'Client de la plateforme',
    permissions: [
      'view-products',
      'view-orders', 'create-orders',
      'view-own-tasks', 'manage-own-tasks',
    ],
    badgeColor: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    icon: Users
  },
  {
    name: 'Autre',
    slug: 'autre',
    description: 'Utilisateur avec accès limité à la gestion de leurs tâches',
    permissions: [
      'view-own-tasks', 'manage-own-tasks',
    ],
    badgeColor: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
    icon: CreditCard
  },
];

// Helper to get group icon and title
const getGroupInfo = (group: string, t: any) => {
  const title = t.permissionGroups[group] || group.charAt(0).toUpperCase() + group.slice(1);
  switch (group) {
    case 'users': return { title, icon: Users };
    case 'products': return { title, icon: ShoppingBag };
    case 'orders': return { title, icon: ShoppingBag };
    case 'requests': return { title, icon: FileText };
    case 'inventory': return { title, icon: Box };
    case 'reports': return { title, icon: BarChart3 };
    case 'sales': return { title, icon: DollarSign };
    case 'pos': return { title, icon: Store };
    case 'tasks': return { title, icon: ClipboardList };
    case 'system': return { title, icon: Settings };
    default: return { title, icon: Settings };
  }
};

export default function RolesMatrixPage() {
  const { t, interpolate } = useTranslation();
  usePageTitle(t.pages.rolesMatrix.title);

  const [activeRoleSlug, setActiveRoleSlug] = useState(ROLES_LIST[0].slug);

  const activeRole = ROLES_LIST.find(r => r.slug === activeRoleSlug) || ROLES_LIST[0];

  // Group permissions by 'group' property
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, PermissionDef[]> = {};
    PERMISSIONS_LIST.forEach(perm => {
      if (!grouped[perm.group]) {
        grouped[perm.group] = [];
      }
      grouped[perm.group].push(perm);
    });
    return grouped;
  }, []);

  // Check if a role has a permission
  const hasPermission = (role: RoleDef, permissionSlug: string) => {
    if (role.permissions === 'all') return true;
    return role.permissions.includes(permissionSlug);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background to-muted/20 p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="container mx-auto max-w-6xl space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>{t.matrix.systemDocs}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          {t.matrix.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t.matrix.subtitle}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl">
        <Tabs defaultValue={activeRoleSlug} onValueChange={setActiveRoleSlug} className="space-y-8">
          
          {/* Role Navigation */}
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="min-w-full md:min-w-fit h-auto flex-wrap gap-2 p-2 bg-background/50 backdrop-blur-xl border shadow-sm rounded-3xl justify-start">
              {ROLES_LIST.map((role) => (
                <TabsTrigger
                  key={role.slug}
                  value={role.slug}
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                >
                  <role.icon className="w-4 h-4 mr-2" />
                  {t.roles[role.slug]?.name || role.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Role Details Content */}
          <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
            
            {/* Sidebar: Role Overview */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-background/40 backdrop-blur-md shadow-xl overflow-hidden sticky top-8">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${activeRole.badgeColor.replace('text-', 'bg-').replace('/10', '/10').split(' ')[0]} bg-opacity-20`}>
                      <activeRole.icon className={`w-8 h-8 ${activeRole.badgeColor.match(/text-[\w-]+/)?.[0]}`} />
                    </div>
                    <Badge variant="outline" className={`px-3 py-1 text-sm ${activeRole.badgeColor} border-0`}>
                      {activeRole.slug.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{t.roles[activeRole.slug]?.name || activeRole.name}</CardTitle>
                    <CardDescription className="text-base mt-2 leading-relaxed">
                      {t.roles[activeRole.slug]?.description || activeRole.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {t.matrix.status}
                    </div>
                    {activeRole.permissions === 'all' ? (
                       <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-semibold">{t.matrix.accessLevel.unlimited}</span>
                       </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                         <Shield className="w-6 h-6" />
                         <span className="font-semibold">{interpolate(t.matrix.accessLevel.limited, { count: activeRole.permissions.length })}</span>
                      </div>
                    )}
                   
                    <Button className="w-full mt-6" variant="outline">
                      {t.matrix.manageRole}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main: Permissions Matrix */}
            <div className="space-y-6">
              <TabsContent value={activeRoleSlug} className="mt-0 space-y-6 animate-in slide-in-from-right-4 duration-500">
                {Object.entries(groupedPermissions).map(([groupKey, permissions]) => {
                  const { title, icon: GroupIcon } = getGroupInfo(groupKey, t);
                  
                  // Filter permissions to only those enabled for the role (or all if 'all')
                  const activePermissions = permissions.filter(p => hasPermission(activeRole, p.slug));
                  
                  // If no permissions in this group are enabled, hide the card
                  if (activePermissions.length === 0) return null;

                  return (
                    <Card key={groupKey} className="border-border/50 bg-card/50 backdrop-blur-sm transition-colors duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                              <GroupIcon className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">{title}</CardTitle>
                          </div>
                          <Badge variant="secondary">
                            {activePermissions.length} {t.matrix.active}{activePermissions.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                          {activePermissions.map((perm) => (
                            <div 
                              key={perm.slug} 
                              className="flex items-start gap-3 p-3 rounded-xl border bg-background/80 border-border/50 shadow-sm transition-all hover:scale-[1.01]"
                            >
                              <div className="mt-1 shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium text-sm text-foreground">
                                  {t.permissions[perm.slug]?.name || perm.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {t.permissions[perm.slug]?.description || perm.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </div>

          </div>
        </Tabs>
      </div>

    </div>
  );
}
