import { useState, useEffect, useRef } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/route";
import { getCurrentUser } from "~/services/api.server";
import { useAuth, useTranslation, usePageTitle } from "~/hooks";
import { useLanguage } from "~/hooks/useLanguage";
import { useTheme } from "~/hooks/useTheme";
import { authService } from "~/lib/auth.service";
import type { UserSession } from "~/types";
import { notificationService } from "~/lib/services/notification.service";
import type { UpdateNotificationPreferencesParams } from "~/types/notification.types";
import { toast } from "sonner";
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
  const { user, updateUser } = useAuth();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    personal_phone: user?.personal_phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [preferences, setPreferences] = useState({
    language: language,
    theme: "system",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: "DD/MM/YYYY",
  });
  const [notificationPrefs, setNotificationPrefs] = useState<UpdateNotificationPreferencesParams>({
    email_activation_request: false,
    email_activation_approved: true,
    email_activation_rejected: true,
    email_system_updates: true,
    email_welcome: false,
    database_activation_request: true,
    database_activation_approved: true,
    database_activation_rejected: true,
    database_system_updates: true,
    database_welcome: true,
    push_activation_request: true,
    push_activation_approved: true,
    push_activation_rejected: true,
    push_system_updates: true,
    notify_on_weekends: true,
  });
  
  // Refs pour les inputs
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  
  // Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  usePageTitle(t.pages.profile.title);

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    setSessionsError(null);
    try {
      const data = await authService.getSessions();
      setSessions(data);
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      // Afficher un message d'erreur sans déconnecter l'utilisateur
      const errorMessage = error?.message || (language === 'fr' 
        ? "Impossible de charger les sessions. Veuillez réessayer." 
        : "Unable to load sessions. Please try again.");
      setSessionsError(errorMessage);
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
      toast.success(language === 'fr' ? 'Autres sessions révoquées avec succès' : 'Other sessions revoked successfully');
    } catch (error) {
      console.error("Error revoking other sessions:", error);
      toast.error(language === 'fr' ? 'Erreur lors de la révocation des sessions' : 'Error revoking sessions');
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder le profil général
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({
        first_name: firstNameRef.current?.value || "",
        last_name: lastNameRef.current?.value || "",
        personal_phone: phoneRef.current?.value || "",
      });
      updateUser(updatedUser);
      toast.success(language === 'fr' ? 'Profil mis à jour avec succès' : 'Profile updated successfully');
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || (language === 'fr' ? 'Erreur lors de la mise à jour du profil' : 'Error updating profile'));
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder le mot de passe
  const handleSavePassword = async () => {
    if (!currentPasswordRef.current?.value || !newPasswordRef.current?.value) {
      toast.error(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill all fields');
      return;
    }

    if (newPasswordRef.current.value !== confirmPasswordRef.current?.value) {
      toast.error(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword({
        current_password: currentPasswordRef.current.value,
        password: newPasswordRef.current.value,
        password_confirmation: confirmPasswordRef.current?.value || "",
      });
      toast.success(language === 'fr' ? 'Mot de passe modifié avec succès' : 'Password changed successfully');
      // Réinitialiser les champs
      if (currentPasswordRef.current) currentPasswordRef.current.value = "";
      if (newPasswordRef.current) newPasswordRef.current.value = "";
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error?.message || (language === 'fr' ? 'Erreur lors du changement de mot de passe' : 'Error changing password'));
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les préférences
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Mettre à jour la langue
      if (preferences.language !== language) {
        setLanguage(preferences.language as "fr" | "en");
      }
      
      // Mettre à jour le thème
      if (preferences.theme) {
        setTheme(preferences.theme as "light" | "dark" | "system");
      }

      // TODO: Sauvegarder timezone et dateFormat si l'API le supporte
      toast.success(language === 'fr' ? 'Préférences mises à jour avec succès' : 'Preferences updated successfully');
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error(error?.message || (language === 'fr' ? 'Erreur lors de la mise à jour des préférences' : 'Error updating preferences'));
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les préférences de notifications
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await notificationService.updatePreferences(notificationPrefs);
      toast.success(language === 'fr' ? 'Préférences de notifications mises à jour' : 'Notification preferences updated');
    } catch (error: any) {
      console.error("Error updating notification preferences:", error);
      toast.error(error?.message || (language === 'fr' ? 'Erreur lors de la mise à jour des préférences' : 'Error updating preferences'));
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

  // Composant pour afficher l'icône du navigateur et de l'OS
  const getDeviceIcon = (browser: string, os: string) => {
    const browserLower = browser?.toLowerCase() || '';
    const osLower = os?.toLowerCase() || '';

    // Fonction pour obtenir le chemin de l'image selon le navigateur
    const getBrowserImagePath = () => {
      if (browserLower.includes('chrome')) {
        return {
          light: '/images/icon-chrome-ligth.jpeg',
          dark: '/images/icon-chrome-dark.jpeg',
        };
      }
      if (browserLower.includes('firefox')) {
        return {
          light: '/images/icon-firefox-ligth.jpeg',
          dark: '/images/icon-firefox-dark.jpeg',
        };
      }
      if (browserLower.includes('safari')) {
        return {
          light: '/images/icon-safari-ligth.jpeg',
          dark: '/images/icon-safari-dark.jpeg',
        };
      }
      if (browserLower.includes('edge')) {
        return {
          light: '/images/icon-edge-ligth.jpeg',
          dark: '/images/icon-edge-dark.jpeg',
        };
      }
      if (browserLower.includes('opera')) {
        return {
          light: '/images/icon-opera-ligth.jpeg',
          dark: '/images/icon-opera-dark.jpeg',
        };
      }
      return null;
    };

    const browserImages = getBrowserImagePath();

    // Composant d'icône de navigateur avec images
    const BrowserIcon = () => {
      if (browserImages) {
        return (
          <>
            {/* Image pour le mode clair */}
            <img 
              src={browserImages.light} 
              alt={browser}
              className="w-12 h-12 object-contain dark:hidden rounded-lg"
              style={{ imageRendering: 'auto' }}
            />
            {/* Image pour le mode sombre */}
            <img 
              src={browserImages.dark} 
              alt={browser}
              className="w-12 h-12 object-contain hidden dark:block rounded-lg"
              style={{ imageRendering: 'auto' }}
            />
          </>
        );
      }
      // Icône par défaut pour navigateur inconnu
      return <img src="/images/icon-smartphone.jpeg" alt="Device" className="w-12 h-12 object-contain rounded-lg" />;
    };

    // Badge OS avec icône
    const getOSBadge = () => {
      if (!osLower) return null;
      
      if (osLower.includes('windows')) {
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.628h11.377V24H0zm12.623 0H24V24H12.623z"/>
            </svg>
          </div>
        );
      }
      if (osLower.includes('mac') || osLower.includes('macos')) {
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-600 dark:bg-gray-400 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        );
      }
      if (osLower.includes('ios')) {
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-800 dark:bg-gray-200 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white dark:text-gray-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </div>
        );
      }
      if (osLower.includes('linux')) {
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.052-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.63.382-1.06.382-.829 0-1.523-.28-1.927-.746-.363-.412-.5-.95-.587-1.506-.012-.078-.022-.155-.034-.248-.054-.415-.112-.845-.227-1.222-.348-1.15-1.184-2.135-2.216-2.855-1.468-1.02-3.272-1.405-4.36-1.563C.96 6.748 0 6.923 0 8.11c0 .97.524 1.81 1.274 2.36.127.096.26.186.398.27.12.074.24.15.36.22.05.03.1.05.15.08.05.02.1.05.15.07.05.02.1.04.15.06.05.01.1.03.15.04.05.01.1.02.15.03.05 0 .1.01.15.01h.15c.05 0 .1-.01.15-.01.05-.01.1-.02.15-.03.05-.01.1-.03.15-.04.05-.02.1-.04.15-.06.05-.02.1-.05.15-.07.05-.03.1-.05.15-.08.12-.07.24-.15.36-.22.14-.08.27-.17.4-.27.75-.55 1.27-1.39 1.27-2.36 0-1.187-.96-1.362-1.9-1.47 1.088.158 2.892.543 4.36 1.563 1.032.72 1.868 1.705 2.216 2.855.115.377.173.807.227 1.222.012.093.022.17.034.248.087.556.224 1.094.587 1.506.404.466 1.098.746 1.927.746.43 0 .8-.114 1.06-.382a.424.424 0 00.11-.135c-.123-.805.009-1.657.287-2.489.589-1.771 1.831-3.469 2.716-4.521.75-1.067 1.074-1.928 1.05-3.02.065-1.491-1.056-5.965 3.17-6.298.165-.013.325-.021.48-.021 4.951 0 9.496 4.05 9.496 9.497 0 4.95-4.049 9.003-9.003 9.003-4.948 0-9.003-4.049-9.003-9.003 0-1.647.45-3.19 1.233-4.515.078-.13.16-.26.245-.39-.085-.13-.167-.26-.245-.39C4.497 4.06 4.047 5.603 4.047 7.25c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 0 12.504 0z"/>
            </svg>
          </div>
        );
      }
      if (osLower.includes('android')) {
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C17.5902 8.2439 16.8533 7.9988 16.0533 7.9988c-1.6505 0-3.0868.8533-3.9065 2.1258l-5.6112-2.4139a.416.416 0 00-.5676.1521.416.416 0 00.1521.5676l5.6362 2.4234c-.3016.9648-.3016 1.9993 0 2.9641l-5.6362 2.4234a.416.416 0 00-.1521.5676c.1366.2366.3887.3708.6366.3708a.416.416 0 00.3581-.2057l5.6112-2.4139c.8197 1.2725 2.256 2.1258 3.9065 2.1258.8 0 1.5369-.2451 2.1447-.6613l2.0223 3.503a.416.416 0 00.5676.1521.416.416 0 00.1521-.5676l-1.9973-3.4592c.6689-.6048 1.0905-1.4702 1.0905-2.4234 0-.9532-.4216-1.8186-1.0905-2.4234m-.7037 4.8434c-.3047 0-.5511-.2468-.5511-.5511 0-.3047.2464-.5511.5511-.5511.3047 0 .5511.2464.5511.5511 0 .3043-.2464.5511-.5511.5511m-11.046 0c-.3047 0-.5511-.2468-.5511-.5511 0-.3047.2464-.5511.5511-.5511.3047 0 .5511.2464.5511.5511 0 .3043-.2464.5511-.5511.5511m11.7497-4.8434H4.5514c-.3047 0-.5511-.2468-.5511-.5511 0-.3047.2464-.5511.5511-.5511h13.5771c.3047 0 .5511.2464.5511.5511 0 .3043-.2464.5511-.5511.5511"/>
            </svg>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="relative">
        <BrowserIcon />
        {getOSBadge()}
      </div>
    );
  };

  // Génère un message WhatsApp randomisé pour le support
  const getWhatsAppSupportMessage = (): string => {
    const messages = [
      language === 'fr' 
        ? "Bonjour, je suis Calvin Pro et j'ai besoin d'aide sur la plateforme BABANA Partner. Pourriez-vous m'assister ?"
        : "Hello, I'm Calvin Pro and I need help on the BABANA Partner platform. Could you assist me?",
      language === 'fr'
        ? "Salut ! Calvin Pro ici. J'aimerais obtenir de l'aide concernant la plateforme BABANA Partner. Merci !"
        : "Hi! Calvin Pro here. I would like to get help regarding the BABANA Partner platform. Thanks!",
      language === 'fr'
        ? "Bonjour, c'est Calvin Pro. J'ai quelques questions sur l'utilisation de la plateforme BABANA Partner. Pouvez-vous m'aider ?"
        : "Hello, this is Calvin Pro. I have some questions about using the BABANA Partner platform. Can you help me?",
      language === 'fr'
        ? "Salut ! Je suis Calvin Pro et j'aurais besoin d'assistance sur la plateforme BABANA Partner. Est-ce que vous pouvez m'aider ?"
        : "Hi! I'm Calvin Pro and I would need assistance on the BABANA Partner platform. Can you help me?",
      language === 'fr'
        ? "Bonjour, Calvin Pro à l'appareil. J'ai besoin de support sur la plateforme BABANA Partner. Merci de votre aide !"
        : "Hello, Calvin Pro here. I need support on the BABANA Partner platform. Thanks for your help!",
    ];
    
    // Sélectionner un message aléatoire
    const randomIndex = Math.floor(Math.random() * messages.length);
    return encodeURIComponent(messages[randomIndex]);
  };

  const whatsAppSupportUrl = `https://wa.me/237622037000?text=${getWhatsAppSupportMessage()}`;

  // Générer l'historique de connexion à partir des sessions réelles
  const loginHistory = sessions
    .sort((a, b) => {
      // Trier par date de dernière utilisation (plus récent en premier)
      const dateA = new Date(a.last_used_at).getTime();
      const dateB = new Date(b.last_used_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5) // Limiter aux 5 sessions les plus récentes
    .map((session) => ({
      id: session.id,
      device: session.device_name || `${session.device_info.browser} on ${session.device_info.os}`,
      location: session.location || (language === 'fr' ? 'Localisation inconnue' : 'Unknown location'),
      date: formatDateTime(session.last_used_at),
      success: true, // Les sessions actives sont toutes des connexions réussies
      isCurrent: session.is_current,
    }));

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
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/10 hover:bg-white/20 border-none text-white"
                      asChild
                    >
                      <a 
                        href={whatsAppSupportUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.089c0 1.847.485 3.58 1.335 5.081L0 24l8.986-2.301a11.807 11.807 0 003.063.395h.004c5.554 0 10.089-4.534 10.089-10.088 0-2.724-1.087-5.202-2.856-7.02z"/>
                        </svg>
                        {language === 'fr' ? 'Contacter le support' : 'Contact Support'}
                      </a>
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
                          <Input 
                            id="firstName" 
                            ref={firstNameRef}
                            defaultValue={user.first_name || ""} 
                            className="pl-10" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-bold uppercase text-zinc-500">
                          {t.profile.general.lastName}
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                          <Input 
                            id="lastName" 
                            ref={lastNameRef}
                            defaultValue={user.last_name || ""} 
                            className="pl-10" 
                          />
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
                          <Input 
                            id="phone" 
                            ref={phoneRef}
                            defaultValue={user.personal_phone || ""} 
                            className="pl-10" 
                          />
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
                      onClick={handleSaveProfile}
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
                              ref={currentPasswordRef}
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
                                ref={newPasswordRef}
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
                              ref={confirmPasswordRef}
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          className="border-babana-cyan text-babana-cyan hover:bg-babana-cyan/5"
                          onClick={handleSavePassword}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {language === 'fr' ? 'Mise à jour...' : 'Updating...'}
                            </>
                          ) : (
                            language === 'fr' ? 'Mettre à jour le mot de passe' : 'Update password'
                          )}
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
                      {loginHistory.length > 0 ? (
                      <div className="space-y-3">
                        {loginHistory.map((entry) => (
                          <div 
                            key={entry.id}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-colors",
                                entry.isCurrent 
                                  ? "bg-babana-cyan/5 border-babana-cyan/20" 
                                  : "border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                              )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-2 rounded-lg",
                                entry.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                              )}>
                                {entry.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm">{entry.device}</p>
                                    {entry.isCurrent && (
                                      <Badge className="bg-babana-cyan text-white border-none text-[10px] uppercase font-bold px-1.5 py-0">
                                        {language === 'fr' ? 'Actuel' : 'Current'}
                                      </Badge>
                                    )}
                                  </div>
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
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl">
                          <p className="text-zinc-500 text-sm">
                            {language === 'fr' 
                              ? 'Aucun historique de connexion disponible' 
                              : 'No login history available'}
                          </p>
                        </div>
                      )}
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
                    {sessionsError ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">{sessionsError}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchSessions}
                          className="mt-2"
                        >
                          Réessayer
                        </Button>
                      </div>
                    ) : isLoadingSessions ? (
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
                                  "p-2 rounded-xl border transition-colors flex items-center justify-center min-w-[56px] min-h-[56px]",
                                  session.is_current 
                                    ? "bg-white dark:bg-zinc-900 border-babana-cyan/20" 
                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 group-hover:bg-white dark:group-hover:bg-zinc-900"
                                )}>
                                  {getDeviceIcon(session.device_info.browser, session.device_info.os)}
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
                    <Button 
                      className="bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-lg shadow-babana-cyan/20"
                      onClick={handleSavePreferences}
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
                          { key: 'email_activation_request', label: t.profile.notifications.email.marketing, checked: notificationPrefs.email_activation_request },
                          { key: 'email_system_updates', label: t.profile.notifications.email.updates, checked: notificationPrefs.email_system_updates },
                          { key: 'email_activation_approved', label: t.profile.notifications.email.security, checked: notificationPrefs.email_activation_approved },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                            <Switch 
                              checked={item.checked || false}
                              onCheckedChange={(checked) => 
                                setNotificationPrefs({ ...notificationPrefs, [item.key]: checked })
                              }
                              className="data-[state=checked]:bg-babana-cyan" 
                            />
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
                          { value: "all", label: t.profile.notifications.push.all },
                          { value: "important", label: t.profile.notifications.push.important },
                          { value: "none", label: t.profile.notifications.push.none },
                        ].map((item) => (
                          <label 
                            key={item.value} 
                            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-babana-cyan/5 hover:border-babana-cyan/30 transition-all text-center group"
                          >
                            <input 
                              type="radio" 
                              name="push" 
                              value={item.value} 
                              checked={
                                item.value === "all" 
                                  ? (notificationPrefs.push_activation_request && notificationPrefs.push_activation_approved)
                                  : item.value === "important"
                                  ? (notificationPrefs.push_activation_approved && !notificationPrefs.push_activation_request)
                                  : (!notificationPrefs.push_activation_request && !notificationPrefs.push_activation_approved)
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setNotificationPrefs({
                                  ...notificationPrefs,
                                  push_activation_request: value === "all" || value === "important",
                                  push_activation_approved: value === "all" || value === "important",
                                  push_activation_rejected: value === "all",
                                  push_system_updates: value === "all",
                                } as UpdateNotificationPreferencesParams);
                              }}
                              className="sr-only peer" 
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-300 group-hover:border-babana-cyan peer-checked:border-babana-cyan peer-checked:bg-babana-cyan ring-offset-2 peer-checked:ring-2 peer-checked:ring-babana-cyan/20 transition-all" />
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-babana-cyan transition-colors">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end">
                    <Button 
                      className="bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-lg shadow-babana-cyan/20"
                      onClick={handleSaveNotifications}
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
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}

