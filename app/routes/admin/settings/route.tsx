import { useState, useEffect } from "react";
import type React from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/route";
import { getCurrentUser } from "~/services/api.server";
import { useAuth, useTranslation, usePageTitle } from "~/hooks";
import { Layout } from "~/components/Layout";
import { ProtectedRoute } from "~/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  Settings,
  Server,
  Database,
  Shield,
  Mail,
  Bell,
  Globe,
  Lock,
  Key,
  Zap,
  Activity,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Rocket,
  TrendingUp,
  Users,
  FileText,
  Clock,
  ShieldCheck,
  Globe2,
  Palette,
  Moon,
  Sun,
  Monitor,
  Loader2,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

// Loader - Vérifier l'authentification et les permissions
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  
  if (!user) {
    throw redirect("/login");
  }

  // Vérifier que l'utilisateur est admin
  const isAdmin = user.roles?.some(role => ['admin', 'super_admin'].includes(role));
  if (!isAdmin) {
    throw redirect("/unauthorized");
  }

  return { user };
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  usePageTitle("Configuration Admin");

  // États pour les configurations
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "BABANA Partner",
    siteDescription: "Plateforme de gestion des partenaires",
    maintenanceMode: false,
    allowRegistrations: true,
    defaultLanguage: "fr",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableIpWhitelist: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@babana.com",
    fromName: "BABANA Partner",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSmsNotifications: false,
    notificationQueue: true,
    batchNotifications: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    cacheEnabled: true,
    cacheDuration: 3600,
    logLevel: "info",
    enableAnalytics: true,
    enableErrorTracking: true,
    backupFrequency: "daily",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    primaryColor: "cyan",
    enableAnimations: true,
    compactMode: false,
  });

  // Statistiques système (simulées)
  const [systemStats, setSystemStats] = useState({
    uptime: "99.9%",
    activeUsers: 1247,
    totalRequests: 45678,
    avgResponseTime: "120ms",
    serverLoad: 45,
    memoryUsage: 68,
    diskUsage: 52,
  });

  useEffect(() => {
    // Simuler des mises à jour de stats en temps réel
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5 - 2),
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10 - 5))),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + Math.floor(Math.random() * 6 - 3))),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = async (settingsType: string) => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(language === 'fr' ? 'Configuration sauvegardée avec succès' : 'Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const statsCards = [
    {
      label: "Uptime",
      value: systemStats.uptime,
      icon: Activity,
      color: "from-green-500 to-emerald-600",
      trend: "+0.1%",
    },
    {
      label: "Utilisateurs actifs",
      value: systemStats.activeUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      trend: "+12",
    },
    {
      label: "Requêtes totales",
      value: systemStats.totalRequests.toLocaleString(),
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      trend: "+1.2k",
    },
    {
      label: "Temps de réponse",
      value: systemStats.avgResponseTime,
      icon: Zap,
      color: "from-orange-500 to-red-600",
      trend: "-5ms",
    },
  ];

  const systemMetrics = [
    {
      label: "Charge serveur",
      value: systemStats.serverLoad,
      icon: Cpu,
      color: systemStats.serverLoad > 70 ? "text-red-500" : systemStats.serverLoad > 50 ? "text-yellow-500" : "text-green-500",
    },
    {
      label: "Mémoire",
      value: systemStats.memoryUsage,
      icon: MemoryStick,
      color: systemStats.memoryUsage > 80 ? "text-red-500" : systemStats.memoryUsage > 60 ? "text-yellow-500" : "text-green-500",
    },
    {
      label: "Disque",
      value: systemStats.diskUsage,
      icon: HardDrive,
      color: systemStats.diskUsage > 80 ? "text-red-500" : systemStats.diskUsage > 60 ? "text-yellow-500" : "text-green-500",
    },
  ];

  return (
    <Layout>
      <ProtectedRoute role={['admin', 'super_admin']} mode="any">
        <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          {/* Hero Section avec effet glassmorphism */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/20 via-babana-blue/20 to-babana-cyan/20 blur-3xl" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-babana-cyan rounded-2xl blur-xl opacity-50 animate-pulse" />
                      <div className="relative p-4 bg-linear-to-br from-babana-cyan to-babana-blue rounded-2xl shadow-2xl">
                        <Settings className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-clip-text text-transparent">
                        Configuration Admin
                      </h1>
                      <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">
                        Gérez tous les paramètres de la plateforme
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white border-none px-4 py-2">
                    <Activity className="w-3 h-3 mr-2" />
                    Système opérationnel
                  </Badge>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
                  </Button>
                </div>
              </div>

              {/* Stats Cards avec animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "p-3 rounded-xl bg-linear-to-br shadow-lg",
                          `bg-linear-to-br ${stat.color}`
                        )}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          {stat.trend}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                          {stat.value}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {systemMetrics.map((metric) => (
                  <Card
                    key={metric.label}
                    className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all"
                  >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className={cn("w-8 h-8", metric.color)} />
                      <span className={cn("text-2xl font-bold", metric.color)}>
                        {metric.value}%
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                      {metric.label}
                    </p>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          metric.value > 80
                            ? "bg-linear-to-r from-red-500 to-red-600"
                            : metric.value > 60
                            ? "bg-linear-to-r from-yellow-500 to-orange-500"
                            : "bg-linear-to-r from-green-500 to-emerald-600"
                        )}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-2 shadow-lg">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Général
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Server className="w-4 h-4 mr-2" />
                  Système
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-babana-cyan data-[state=active]:to-babana-blue data-[state=active]:text-white rounded-xl transition-all"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Apparence
                </TabsTrigger>
              </TabsList>

              {/* Tab: Général */}
              <TabsContent value="general" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-babana-cyan/10 to-babana-blue/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-babana-cyan to-babana-blue rounded-lg">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Paramètres généraux</CardTitle>
                        <CardDescription>Configuration de base de la plateforme</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Nom du site</Label>
                        <Input
                          id="siteName"
                          value={generalSettings.siteName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setGeneralSettings({ ...generalSettings, siteName: e.target.value });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                        <Select
                          value={generalSettings.defaultLanguage}
                          onValueChange={(value: string) => {
                            setGeneralSettings({ ...generalSettings, defaultLanguage: value });
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Description du site</Label>
                      <Textarea
                        id="siteDescription"
                        value={generalSettings.siteDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          setGeneralSettings({ ...generalSettings, siteDescription: e.target.value });
                          setHasChanges(true);
                        }}
                        className="bg-white dark:bg-zinc-900 min-h-[100px]"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Mode maintenance</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Désactive l'accès public à la plateforme
                          </p>
                        </div>
                        <Switch
                          checked={generalSettings.maintenanceMode}
                          onCheckedChange={(checked: boolean) => {
                            setGeneralSettings({ ...generalSettings, maintenanceMode: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Autoriser les inscriptions</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Permet aux nouveaux utilisateurs de s'inscrire
                          </p>
                        </div>
                        <Switch
                          checked={generalSettings.allowRegistrations}
                          onCheckedChange={(checked: boolean) => {
                            setGeneralSettings({ ...generalSettings, allowRegistrations: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('general')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Sécurité */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-red-500/10 to-orange-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-red-500 to-orange-500 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Paramètres de sécurité</CardTitle>
                        <CardDescription>Configuration de la sécurité et de l'authentification</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
                        <Input
                          id="passwordMinLength"
                          type="number"
                          value={securitySettings.passwordMinLength}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">2FA obligatoire</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Exige l'authentification à deux facteurs pour tous les utilisateurs
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorRequired}
                          onCheckedChange={(checked: boolean) => {
                            setSecuritySettings({ ...securitySettings, twoFactorRequired: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Mot de passe fort requis</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Exige des mots de passe complexes
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.requireStrongPassword}
                          onCheckedChange={(checked: boolean) => {
                            setSecuritySettings({ ...securitySettings, requireStrongPassword: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Liste blanche IP</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Restreint l'accès aux adresses IP autorisées
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.enableIpWhitelist}
                          onCheckedChange={(checked: boolean) => {
                            setSecuritySettings({ ...securitySettings, enableIpWhitelist: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('security')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Email */}
              <TabsContent value="email" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-blue-500/10 to-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Configuration email</CardTitle>
                        <CardDescription>Paramètres SMTP et envoi d'emails</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">Serveur SMTP</Label>
                        <Input
                          id="smtpHost"
                          value={emailSettings.smtpHost}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, smtpHost: e.target.value });
                            setHasChanges(true);
                          }}
                          placeholder="smtp.example.com"
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">Port SMTP</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={emailSettings.smtpPort}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                        <Input
                          id="smtpUser"
                          value={emailSettings.smtpUser}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, smtpUser: e.target.value });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, smtpPassword: e.target.value });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">Email expéditeur</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, fromEmail: e.target.value });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromName">Nom expéditeur</Label>
                        <Input
                          id="fromName"
                          value={emailSettings.fromName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailSettings({ ...emailSettings, fromName: e.target.value });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('email')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Notifications */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Paramètres de notifications</CardTitle>
                        <CardDescription>Configuration des canaux de notification</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Notifications email</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Activer l'envoi de notifications par email
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.enableEmailNotifications}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Notifications push</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Activer les notifications push en temps réel
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.enablePushNotifications}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings({ ...notificationSettings, enablePushNotifications: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Notifications SMS</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Activer l'envoi de notifications par SMS
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.enableSmsNotifications}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings({ ...notificationSettings, enableSmsNotifications: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">File d'attente de notifications</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Utiliser une file d'attente pour l'envoi asynchrone
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.notificationQueue}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings({ ...notificationSettings, notificationQueue: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Notifications groupées</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Regrouper les notifications similaires
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.batchNotifications}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings({ ...notificationSettings, batchNotifications: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('notifications')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Système */}
              <TabsContent value="system" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-slate-500/10 to-gray-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-slate-500 to-gray-600 rounded-lg">
                        <Server className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Paramètres système</CardTitle>
                        <CardDescription>Configuration avancée du serveur et des performances</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="cacheDuration">Durée du cache (secondes)</Label>
                        <Input
                          id="cacheDuration"
                          type="number"
                          value={systemSettings.cacheDuration}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSystemSettings({ ...systemSettings, cacheDuration: parseInt(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logLevel">Niveau de log</Label>
                        <Select
                          value={systemSettings.logLevel}
                          onValueChange={(value: string) => {
                            setSystemSettings({ ...systemSettings, logLevel: value });
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debug">Debug</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 relative">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <Select
                          value={systemSettings.backupFrequency}
                          onValueChange={(value: string) => {
                            setSystemSettings({ ...systemSettings, backupFrequency: value });
                            setHasChanges(true);
                          }}
                          disabled
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Horaire</SelectItem>
                            <SelectItem value="daily">Quotidienne</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Cache activé</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Améliore les performances en mettant en cache les données
                          </p>
                        </div>
                        <Switch
                          checked={systemSettings.cacheEnabled}
                          onCheckedChange={(checked: boolean) => {
                            setSystemSettings({ ...systemSettings, cacheEnabled: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Analytics activées</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Collecter des données d'analyse d'utilisation
                          </p>
                        </div>
                        <Switch
                          checked={systemSettings.enableAnalytics}
                          onCheckedChange={(checked: boolean) => {
                            setSystemSettings({ ...systemSettings, enableAnalytics: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Suivi des erreurs</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enregistrer et suivre les erreurs automatiquement
                          </p>
                        </div>
                        <Switch
                          checked={systemSettings.enableErrorTracking}
                          onCheckedChange={(checked: boolean) => {
                            setSystemSettings({ ...systemSettings, enableErrorTracking: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('system')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Apparence */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-linear-to-r from-pink-500/10 to-rose-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-linear-to-br from-pink-500 to-rose-500 rounded-lg">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Apparence</CardTitle>
                        <CardDescription>Personnalisation de l'interface utilisateur</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Thème par défaut</Label>
                        <Select
                          value={appearanceSettings.theme}
                          onValueChange={(value: string) => {
                            setAppearanceSettings({ ...appearanceSettings, theme: value });
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4" />
                                Clair
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                Sombre
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                Système
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 relative">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="primaryColor">Couleur principale</Label>
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <Select
                          value={appearanceSettings.primaryColor}
                          onValueChange={(value: string) => {
                            setAppearanceSettings({ ...appearanceSettings, primaryColor: value });
                            setHasChanges(true);
                          }}
                          disabled
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cyan">Cyan</SelectItem>
                            <SelectItem value="blue">Bleu</SelectItem>
                            <SelectItem value="purple">Violet</SelectItem>
                            <SelectItem value="pink">Rose</SelectItem>
                            <SelectItem value="green">Vert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Animations activées</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Activer les animations et transitions
                          </p>
                        </div>
                        <Switch
                          checked={appearanceSettings.enableAnimations}
                          onCheckedChange={(checked: boolean) => {
                            setAppearanceSettings({ ...appearanceSettings, enableAnimations: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                        />
                      </div>
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20 text-[10px]">
                            Bientôt disponible
                          </Badge>
                        </div>
                        <div className="space-y-1 pr-24">
                          <Label className="text-base font-semibold">Mode compact</Label>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Réduire l'espacement pour une interface plus dense
                          </p>
                        </div>
                        <Switch
                          checked={appearanceSettings.compactMode}
                          onCheckedChange={(checked: boolean) => {
                            setAppearanceSettings({ ...appearanceSettings, compactMode: checked });
                            setHasChanges(true);
                          }}
                          className="data-[state=checked]:bg-babana-cyan"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSave('appearance')}
                        disabled={isSaving || !hasChanges}
                        className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan/90 hover:to-babana-blue/90 text-white shadow-lg shadow-babana-cyan/20 min-w-[150px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

