import { useState, useEffect } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/route";
import { getCurrentUser } from "~/services/api.server";
import { useAuth, useTranslation, usePageTitle } from "~/hooks";
import { authService } from "~/lib/auth.service";
import type { UserSession } from "~/types";
import { Layout } from "~/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import {
  User as UserIcon,
  Shield,
  Monitor,
  Settings,
  Bell,
  Upload,
  Check,
  X,
  Smartphone,
  MapPin,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Loader2,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Globe,
  Palette,
  Timer,
} from "lucide-react";
import { cn } from "~/lib/utils";

// Loader - Vérifier l'authentification
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  
  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  usePageTitle(t.pages.profile.title);

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const data = await authService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    setRevokingSessionId(sessionId.toString());
    try {
      await authService.revokeSession(sessionId.toString());
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error("Error revoking session:", error);
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsSaving(true);
    try {
      await authService.revokeOtherSessions();
      setSessions(sessions.filter(s => s.is_current));
    } catch (error) {
      console.error("Error revoking other sessions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", variant: "default" as const, className: "bg-green-500/10 text-green-500 border-green-500/20" },
      pending_verification: { label: "Vérification", variant: "secondary" as const, className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      verified: { label: "Vérifié", variant: "default" as const, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      suspended: { label: "Suspendu", variant: "destructive" as const, className: "bg-red-500/10 text-red-500 border-red-500/20" },
      rejected: { label: "Rejeté", variant: "destructive" as const, className: "bg-red-700/10 text-red-700 border-red-700/20" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant="outline" className={cn(config.className, "font-medium px-2.5 py-0.5")}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Login history - still using dummy data but improved display
  const loginHistory = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Douala, Cameroun",
      date: "27 Déc 2025, 14:30",
      success: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Yaoundé, Cameroun",
      date: "26 Déc 2025, 09:15",
      success: true,
    },
    {
      id: 3,
      device: "Chrome on Mac",
      location: "Inconnu",
      date: "25 Déc 2025, 18:45",
      success: false,
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header Card */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 blur-3xl rounded-full -z-10 h-32 w-full opacity-50" />
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-linear-to-br from-babana-cyan to-babana-blue text-white text-4xl font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                <Upload className="w-5 h-5 text-babana-cyan" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </h1>
                <div className="flex justify-center md:justify-start">
                  {getStatusBadge(user.account_status)}
                </div>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
                {user.email} • {user.roles.join(', ')}
              </p>
            </div>

            <div className="hidden md:flex gap-3">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                {t.profile.tabs.preferences}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 p-1 text-zinc-500 dark:text-zinc-400 w-full md:w-auto">
              {[
                { value: "general", icon: UserIcon, label: t.profile.tabs.general },
                { value: "security", icon: Shield, label: t.profile.tabs.security },
                { value: "sessions", icon: Monitor, label: t.profile.tabs.sessions },
                { value: "preferences", icon: Settings, label: t.profile.tabs.preferences },
                { value: "notifications", icon: Bell, label: t.profile.tabs.notifications },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-babana-cyan data-[state=active]:shadow-sm"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar info (Visible on large screens) */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    Aperçu du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-babana-cyan/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-babana-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{t.profile.general.memberSince}</p>
                      <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-babana-cyan/10 rounded-lg">
                      <Clock className="w-4 h-4 text-babana-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{t.profile.general.lastLogin}</p>
                      <p className="text-sm font-medium">{formatDateTime(new Date())}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-babana-cyan/10 rounded-lg">
                      <Lock className="w-4 h-4 text-babana-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Protection 2FA</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">Désactivé</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden">
                <div className="bg-babana-navy p-6 text-white relative">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
                    <p className="text-babana-cyan/80 text-sm mb-4">
                      Notre support est disponible pour vous accompagner dans la configuration de votre compte.
                    </p>
                    <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-white">
                      Contacter le support
                    </Button>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-10">
                    <AlertCircle className="w-32 h-32" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Onglet Général */}
              <TabsContent value="general" className="mt-0 space-y-6 focus-visible:outline-none">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-babana-cyan text-white rounded-lg">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{t.profile.general.title}</CardTitle>
                        <CardDescription>{t.profile.general.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-xs font-bold uppercase text-zinc-500">
                          {t.profile.general.firstName}
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                          <Input id="firstName" defaultValue={user.first_name || ""} className="pl-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-bold uppercase text-zinc-500">
                          {t.profile.general.lastName}
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                          <Input id="lastName" defaultValue={user.last_name || ""} className="pl-10" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase text-zinc-500">
                          {t.profile.general.email}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                          <Input id="email" type="email" defaultValue={user.email} disabled className="pl-10 bg-zinc-50 dark:bg-zinc-900" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase text-zinc-500">
                          {t.profile.general.phone}
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                          <Input id="phone" defaultValue={user.personal_phone || ""} className="pl-10" />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase text-zinc-500">Rôles assignés</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <div key={role} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                            <Shield className="w-3 h-3 text-babana-cyan" />
                            {role}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end">
                    <Button 
                      className="bg-babana-cyan hover:bg-babana-cyan/90 text-white min-w-[150px] shadow-lg shadow-babana-cyan/20"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.profile.general.saving}
                        </>
                      ) : (
                        t.profile.general.saveChanges
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Onglet Sécurité */}
              <TabsContent value="security" className="mt-0 space-y-6 focus-visible:outline-none">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-babana-cyan text-white rounded-lg">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{t.profile.security.title}</CardTitle>
                        <CardDescription>{t.profile.security.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-10">
                    {/* Changement de mot de passe */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-babana-cyan" />
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.profile.security.changePassword}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">{t.profile.security.currentPassword}</Label>
                          <div className="relative">
                            <Input 
                              id="currentPassword" 
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-zinc-400"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">{t.profile.security.newPassword}</Label>
                            <div className="relative">
                              <Input 
                                id="newPassword" 
                                type={showNewPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-zinc-400"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t.profile.security.confirmPassword}</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" className="border-babana-cyan text-babana-cyan hover:bg-babana-cyan/5">
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                    {/* Authentification à deux facteurs - PLACEHOLDER */}
                    <div className="relative group overflow-hidden p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-babana-blue/10 text-babana-blue border-babana-blue/20">
                          Bientôt disponible
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-5">
                        <div className="p-3 bg-babana-cyan/10 rounded-2xl">
                          <Smartphone className="w-6 h-6 text-babana-cyan" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                            {t.profile.security.twoFactor.title}
                          </h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                            {t.profile.security.twoFactor.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between opacity-50 pointer-events-none">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-red-500">{t.profile.security.twoFactor.disabled}</span>
                        </div>
                        <Switch disabled />
                      </div>
                    </div>

                    {/* Historique de connexion rapide */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.profile.security.loginHistory.title}</h3>
                      <div className="space-y-3">
                        {loginHistory.map((entry) => (
                          <div 
                            key={entry.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-2 rounded-lg",
                                entry.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                              )}>
                                {entry.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{entry.device}</p>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>{entry.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-zinc-400">{entry.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Sessions */}
              <TabsContent value="sessions" className="mt-0 space-y-6 focus-visible:outline-none">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-babana-cyan text-white rounded-lg">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{t.profile.sessions.title}</CardTitle>
                          <CardDescription>{t.profile.sessions.subtitle}</CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                        onClick={handleRevokeOtherSessions}
                        disabled={isSaving || sessions.length <= 1}
                      >
                        {t.profile.sessions.revokeAll}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoadingSessions ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-8 h-8 text-babana-cyan animate-spin" />
                        <p className="text-zinc-500 text-sm">Chargement de vos sessions...</p>
                      </div>
                    ) : sessions.length > 0 ? (
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div 
                            key={session.id}
                            className={cn(
                              "group p-5 rounded-2xl border transition-all",
                              session.is_current 
                                ? "bg-babana-cyan/5 border-babana-cyan/20 ring-1 ring-babana-cyan/10" 
                                : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={cn(
                                  "p-3 rounded-xl border transition-colors",
                                  session.is_current 
                                    ? "bg-white dark:bg-zinc-900 border-babana-cyan/20 text-babana-cyan" 
                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 group-hover:bg-white dark:group-hover:bg-zinc-900"
                                )}>
                                  <Smartphone className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                                      {session.device_name}
                                    </h4>
                                    {session.is_current && (
                                      <Badge className="bg-babana-cyan text-white border-none text-[10px] uppercase font-bold px-2 py-0">
                                        {t.profile.sessions.current}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-3 h-3 text-zinc-400" />
                                      <span>{session.location || "Localisation inconnue"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 text-zinc-400" />
                                      <span>
                                        {t.profile.sessions.lastActive}: {session.last_used_human}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Globe className="w-3 h-3 text-zinc-400" />
                                      <span>IP: {session.ip_address || "Inconnue"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Monitor className="w-3 h-3 text-zinc-400" />
                                      <span className="truncate">
                                        {session.device_info.browser} ({session.device_info.os})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {!session.is_current && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => handleRevokeSession(session.id)}
                                  disabled={revokingSessionId === session.id.toString()}
                                >
                                  {revokingSessionId === session.id.toString() ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                        <Monitor className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500">Aucune session active trouvée.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Préférences */}
              <TabsContent value="preferences" className="mt-0 space-y-6 focus-visible:outline-none">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-babana-cyan text-white rounded-lg">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{t.profile.preferences.title}</CardTitle>
                        <CardDescription>{t.profile.preferences.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {[
                      {
                        icon: Globe,
                        title: t.profile.preferences.language.title,
                        description: t.profile.preferences.language.description,
                        control: (
                          <select className="w-full md:w-48 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-babana-cyan/20 focus:border-babana-cyan outline-none transition-all">
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                          </select>
                        )
                      },
                      {
                        icon: Palette,
                        title: t.profile.preferences.theme.title,
                        description: t.profile.preferences.theme.description,
                        control: (
                          <select className="w-full md:w-48 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-babana-cyan/20 focus:border-babana-cyan outline-none transition-all">
                            <option value="light">{t.theme.light}</option>
                            <option value="dark">{t.theme.dark}</option>
                            <option value="system">{t.theme.system}</option>
                          </select>
                        )
                      },
                      {
                        icon: Timer,
                        title: t.profile.preferences.timezone.title,
                        description: t.profile.preferences.timezone.description,
                        control: (
                          <select className="w-full md:w-48 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-babana-cyan/20 focus:border-babana-cyan outline-none transition-all">
                            <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                            <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                          </select>
                        )
                      },
                      {
                        icon: Calendar,
                        title: t.profile.preferences.dateFormat.title,
                        description: t.profile.preferences.dateFormat.description,
                        control: (
                          <select className="w-full md:w-48 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-babana-cyan/20 focus:border-babana-cyan outline-none transition-all">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        )
                      }
                    ].map((pref, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <pref.icon className="w-4 h-4 text-zinc-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{pref.title}</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{pref.description}</p>
                          </div>
                        </div>
                        {pref.control}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end">
                    <Button className="bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-lg shadow-babana-cyan/20">
                      {t.profile.general.saveChanges}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Onglet Notifications */}
              <TabsContent value="notifications" className="mt-0 space-y-6 focus-visible:outline-none">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-babana-cyan text-white rounded-lg">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{t.profile.notifications.title}</CardTitle>
                        <CardDescription>{t.profile.notifications.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* Notifications Email */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-babana-cyan" />
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.profile.notifications.email.title}</h3>
                      </div>
                      <div className="grid gap-3">
                        {[
                          { label: t.profile.notifications.email.marketing, defaultChecked: false },
                          { label: t.profile.notifications.email.updates, defaultChecked: true },
                          { label: t.profile.notifications.email.security, defaultChecked: true },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                            <Switch defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-babana-cyan" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                    {/* Notifications Push */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-babana-cyan" />
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.profile.notifications.push.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: "all", label: t.profile.notifications.push.all, defaultChecked: true },
                          { value: "important", label: t.profile.notifications.push.important, defaultChecked: false },
                          { value: "none", label: t.profile.notifications.push.none, defaultChecked: false },
                        ].map((item) => (
                          <label 
                            key={item.value} 
                            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-babana-cyan/5 hover:border-babana-cyan/30 transition-all text-center group"
                          >
                            <input type="radio" name="push" value={item.value} defaultChecked={item.defaultChecked} className="sr-only peer" />
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-300 group-hover:border-babana-cyan peer-checked:border-babana-cyan peer-checked:bg-babana-cyan ring-offset-2 peer-checked:ring-2 peer-checked:ring-babana-cyan/20 transition-all" />
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-babana-cyan transition-colors">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end">
                    <Button className="bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-lg shadow-babana-cyan/20">
                      {t.profile.general.saveChanges}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}

