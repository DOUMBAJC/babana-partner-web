/**
 * Page de préférences des notifications
 * Permet de configurer les préférences de réception des notifications
 */

import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Mail,
  Database,
  Smartphone,
  Save,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TimePicker } from "~/components/ui/time-picker";
import { cn } from "~/lib/utils";
import { notificationService } from "~/lib/notification.service";
import { useLanguage } from "~/hooks/useLanguage";
import { notificationTranslations } from "~/lib/notification-translations";
import { usePageTitle } from "~/hooks/usePageTitle";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesParams,
} from "~/types/notification.types";

/**
 * Composant de section de préférences
 */
interface PreferenceSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}

function PreferenceSection({
  icon: Icon,
  title,
  description,
  children,
}: PreferenceSectionProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-linear-to-r from-babana-cyan/5 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-babana-cyan/10">
            <Icon className="w-5 h-5 text-babana-cyan" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">{children}</div>
      </CardContent>
    </Card>
  );
}

/**
 * Composant de ligne de préférence avec switch
 */
interface PreferenceItemProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceItem({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: PreferenceItemProps) {
  const reactId = useId();
  const inputId = id || reactId;

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto] gap-6 px-6 py-4 transition-colors",
        "hover:bg-muted/30",
        disabled && "opacity-60"
      )}
    >
      <div className="min-w-0">
        <Label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-5",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-start pt-0.5">
        <Switch
          id={inputId}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-label={label}
          className={cn(
            "relative h-6 w-11 rounded-full border border-white/10 shadow-sm transition-all",
            "data-[state=unchecked]:bg-white/10 dark:data-[state=unchecked]:bg-white/10",
            "data-[state=checked]:bg-linear-to-r data-[state=checked]:from-babana-cyan data-[state=checked]:to-babana-blue",
            "data-[state=checked]:shadow-[0_0_0_3px_rgba(0,224,255,0.18),0_10px_30px_rgba(0,224,255,0.12)]"
          )}
          thumbClassName={cn(
            "h-5 w-5 bg-white shadow-md transition-transform",
            "data-[state=checked]:translate-x-5 data-[state=checked]:rotate-12 data-[state=checked]:scale-[1.02]",
            "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rotate-0"
          )}
        />
      </div>
    </div>
  );
}

/**
 * Composant principal de la page Préférences de notifications
 */
export default function NotificationPreferencesPage() {
  const { language } = useLanguage();
  const t = notificationTranslations[language].notifications;
  const navigate = useNavigate();
  usePageTitle(t.preferences.title);

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [initialPreferences, setInitialPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "inapp" | "push" | "general">(
    "email"
  );

  /**
   * Charge les préférences au montage
   */
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await notificationService.getPreferences();
      setPreferences(response.data);
      setInitialPreferences(response.data);
    } catch (error: any) {
      setErrorMessage(error.message || (language === "fr" 
        ? "Erreur lors du chargement des préférences"
        : "Error loading preferences"));
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: value });
    }
  };

  const isDirty =
    !!preferences &&
    !!initialPreferences &&
    JSON.stringify(preferences) !== JSON.stringify(initialPreferences);

  const normalizeTime = (value: string | null): string | null => {
    if (!value) return null;
    // Accept "HH:mm" or "HH:mm:ss"
    if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
    return value; // fallback (will be validated by backend; we'll show details)
  };

  const timeToMinutes = (value: string) => {
    const v = value.length === 5 ? `${value}:00` : value;
    const [hh, mm] = v.split(":");
    const h = Number(hh);
    const m = Number(mm);
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
    return h * 60 + m;
  };

  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Local validation for quiet hours to avoid backend 422
      const quietStart = preferences.quiet_hours_start;
      const quietEnd = preferences.quiet_hours_end;
      const hasStart = !!quietStart;
      const hasEnd = !!quietEnd;

      if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
        setErrorMessage(
          language === "fr"
            ? "Veuillez renseigner l'heure de début et l'heure de fin des heures silencieuses."
            : "Please provide both quiet hours start and end."
        );
        setIsSaving(false);
        return;
      }

      if (hasStart && hasEnd) {
        const startMin = timeToMinutes(quietStart!);
        const endMin = timeToMinutes(quietEnd!);
        if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) {
          setErrorMessage(
            language === "fr"
              ? "Format d'heure invalide pour les heures silencieuses."
              : "Invalid time format for quiet hours."
          );
          setIsSaving(false);
          return;
        }
        if (startMin >= endMin) {
          setErrorMessage(
            language === "fr"
              ? "L'heure de début doit être avant l'heure de fin."
              : "Quiet hours start must be before end."
          );
          setIsSaving(false);
          return;
        }
      }

      const updates: UpdateNotificationPreferencesParams = {
        email_activation_request: preferences.email_activation_request,
        email_activation_approved: preferences.email_activation_approved,
        email_activation_rejected: preferences.email_activation_rejected,
        email_system_updates: preferences.email_system_updates,
        email_welcome: preferences.email_welcome,
        database_activation_request: preferences.database_activation_request,
        database_activation_approved: preferences.database_activation_approved,
        database_activation_rejected: preferences.database_activation_rejected,
        database_system_updates: preferences.database_system_updates,
        database_welcome: preferences.database_welcome,
        push_activation_request: preferences.push_activation_request,
        push_activation_approved: preferences.push_activation_approved,
        push_activation_rejected: preferences.push_activation_rejected,
        push_system_updates: preferences.push_system_updates,
        notify_on_weekends: preferences.notify_on_weekends,
        // Backend often expects "HH:mm:ss" (Laravel time). Normalize to be safe.
        quiet_hours_start: normalizeTime(preferences.quiet_hours_start),
        quiet_hours_end: normalizeTime(preferences.quiet_hours_end),
        preferred_language: preferences.preferred_language,
      };

      const response = await notificationService.updatePreferences(updates);
      setPreferences(response.data);
      setInitialPreferences(response.data);
      setSuccessMessage(language === "fr" 
        ? "Préférences enregistrées avec succès"
        : "Preferences saved successfully");

      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      const base =
        error.message ||
        (language === "fr"
          ? "Erreur lors de l'enregistrement"
          : "Error saving preferences");

      const details = error.details as
        | Record<string, string[] | string>
        | undefined;

      const detailsText = details
        ? Object.entries(details)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages[0] : messages;
              return `${field}: ${msg}`;
            })
            .slice(0, 4)
            .join(" • ")
        : "";

      setErrorMessage(detailsText ? `${base} — ${detailsText}` : base);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm(language === "fr"
      ? "Voulez-vous vraiment réinitialiser toutes vos préférences ?"
      : "Are you sure you want to reset all your preferences?")) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await notificationService.resetPreferences();
      setPreferences(response.data);
      setInitialPreferences(response.data);
      setSuccessMessage(language === "fr"
        ? "Préférences réinitialisées avec succès"
        : "Preferences reset successfully");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || (language === "fr"
        ? "Erreur lors de la réinitialisation"
        : "Error resetting preferences"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babana-cyan" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {language === "fr" ? "Erreur" : "Error"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {errorMessage || (language === "fr" 
                ? "Impossible de charger les préférences"
                : "Unable to load preferences")}
            </p>
            <Button onClick={loadPreferences}>
              {language === "fr" ? "Réessayer" : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl pb-28">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/notifications")}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "fr" ? "Retour aux notifications" : "Back to notifications"}
          </Button>

          <div className="flex items-center justify-between gap-3">
            <div className="p-3 rounded-xl bg-linear-to-br from-babana-cyan/20 to-babana-blue/20">
              <Bell className="w-8 h-8 text-babana-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t.preferences.title}
                </h1>
                {isDirty && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    {language === "fr" ? "Modifs non enregistrées" : "Unsaved changes"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === "fr"
                  ? "Personnalisez vos préférences de réception des notifications"
                  : "Customize your notification preferences"}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === "fr" ? "Réinitialiser" : "Reset"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="bg-babana-cyan hover:bg-babana-cyan/90"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === "fr" ? "Enregistrement..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {language === "fr" ? "Enregistrer" : "Save"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <div className="sticky top-0 z-10 -mx-4 px-4 pt-2 pb-3 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted/40">
              <TabsTrigger value="email" className="text-xs sm:text-sm">
                {language === "fr" ? "Email" : "Email"}
              </TabsTrigger>
              <TabsTrigger value="inapp" className="text-xs sm:text-sm">
                {language === "fr" ? "In‑App" : "In‑App"}
              </TabsTrigger>
              <TabsTrigger value="push" className="text-xs sm:text-sm">
                {language === "fr" ? "Push" : "Push"}
              </TabsTrigger>
              <TabsTrigger value="general" className="text-xs sm:text-sm">
                {language === "fr" ? "Général" : "General"}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="email" className="m-0 space-y-6">
            <PreferenceSection
              icon={Mail}
              title={language === "fr" ? "Notifications par Email" : "Email Notifications"}
              description={language === "fr" 
                ? "Recevez des emails pour les événements importants"
                : "Receive emails for important events"}
            >
              <PreferenceItem
                id="email_activation_request"
                label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
                description={language === "fr"
                  ? "Recevoir un email quand une demande d'activation est créée"
                  : "Receive an email when an activation request is created"}
                checked={preferences.email_activation_request}
                onChange={(v) => updatePreference("email_activation_request", v)}
              />
              <PreferenceItem
                id="email_activation_approved"
                label={language === "fr" ? "Activations approuvées" : "Approved activations"}
                description={language === "fr"
                  ? "Recevoir un email quand une activation est approuvée"
                  : "Receive an email when an activation is approved"}
                checked={preferences.email_activation_approved}
                onChange={(v) => updatePreference("email_activation_approved", v)}
              />
              <PreferenceItem
                id="email_activation_rejected"
                label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
                description={language === "fr"
                  ? "Recevoir un email quand une activation est rejetée"
                  : "Receive an email when an activation is rejected"}
                checked={preferences.email_activation_rejected}
                onChange={(v) => updatePreference("email_activation_rejected", v)}
              />
              <PreferenceItem
                id="email_system_updates"
                label={language === "fr" ? "Mises à jour système" : "System updates"}
                description={language === "fr"
                  ? "Recevoir des emails sur les mises à jour importantes"
                  : "Receive emails about important updates"}
                checked={preferences.email_system_updates}
                onChange={(v) => updatePreference("email_system_updates", v)}
              />
              <PreferenceItem
                id="email_welcome"
                label={language === "fr" ? "Messages de bienvenue" : "Welcome messages"}
                description={language === "fr"
                  ? "Recevoir des emails de bienvenue"
                  : "Receive welcome emails"}
                checked={preferences.email_welcome}
                onChange={(v) => updatePreference("email_welcome", v)}
              />
            </PreferenceSection>
          </TabsContent>

          <TabsContent value="inapp" className="m-0 space-y-6">
            <PreferenceSection
              icon={Database}
              title={language === "fr" ? "Notifications In-App" : "In-App Notifications"}
              description={language === "fr"
                ? "Notifications affichées dans l'application"
                : "Notifications displayed in the application"}
            >
              <PreferenceItem
                id="database_activation_request"
                label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
                description={language === "fr"
                  ? "Voir les notifications de demandes d'activation"
                  : "View activation request notifications"}
                checked={preferences.database_activation_request}
                onChange={(v) => updatePreference("database_activation_request", v)}
              />
              <PreferenceItem
                id="database_activation_approved"
                label={language === "fr" ? "Activations approuvées" : "Approved activations"}
                description={language === "fr"
                  ? "Voir les notifications d'approbation"
                  : "View approval notifications"}
                checked={preferences.database_activation_approved}
                onChange={(v) => updatePreference("database_activation_approved", v)}
              />
              <PreferenceItem
                id="database_activation_rejected"
                label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
                description={language === "fr"
                  ? "Voir les notifications de rejet"
                  : "View rejection notifications"}
                checked={preferences.database_activation_rejected}
                onChange={(v) => updatePreference("database_activation_rejected", v)}
              />
              <PreferenceItem
                id="database_system_updates"
                label={language === "fr" ? "Mises à jour système" : "System updates"}
                description={language === "fr"
                  ? "Voir les notifications système"
                  : "View system notifications"}
                checked={preferences.database_system_updates}
                onChange={(v) => updatePreference("database_system_updates", v)}
              />
              <PreferenceItem
                id="database_welcome"
                label={language === "fr" ? "Messages de bienvenue" : "Welcome messages"}
                description={language === "fr"
                  ? "Voir les messages de bienvenue"
                  : "View welcome messages"}
                checked={preferences.database_welcome}
                onChange={(v) => updatePreference("database_welcome", v)}
              />
            </PreferenceSection>
          </TabsContent>

          <TabsContent value="push" className="m-0 space-y-6">
            <PreferenceSection
              icon={Smartphone}
              title={language === "fr" ? "Notifications Push" : "Push Notifications"}
              description={language === "fr"
                ? "Notifications push sur vos appareils (si disponible)"
                : "Push notifications on your devices (if available)"}
            >
              <PreferenceItem
                id="push_activation_request"
                label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
                description={language === "fr"
                  ? "Recevoir des push pour les demandes"
                  : "Receive push for requests"}
                checked={preferences.push_activation_request}
                onChange={(v) => updatePreference("push_activation_request", v)}
              />
              <PreferenceItem
                id="push_activation_approved"
                label={language === "fr" ? "Activations approuvées" : "Approved activations"}
                description={language === "fr"
                  ? "Recevoir des push pour les approbations"
                  : "Receive push for approvals"}
                checked={preferences.push_activation_approved}
                onChange={(v) => updatePreference("push_activation_approved", v)}
              />
              <PreferenceItem
                id="push_activation_rejected"
                label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
                description={language === "fr"
                  ? "Recevoir des push pour les rejets"
                  : "Receive push for rejections"}
                checked={preferences.push_activation_rejected}
                onChange={(v) => updatePreference("push_activation_rejected", v)}
              />
              <PreferenceItem
                id="push_system_updates"
                label={language === "fr" ? "Mises à jour système" : "System updates"}
                description={language === "fr"
                  ? "Recevoir des push pour les mises à jour"
                  : "Receive push for updates"}
                checked={preferences.push_system_updates}
                onChange={(v) => updatePreference("push_system_updates", v)}
              />
            </PreferenceSection>
          </TabsContent>

          <TabsContent value="general" className="m-0 space-y-6">
            <PreferenceSection
              icon={Bell}
              title={language === "fr" ? "Paramètres généraux" : "General settings"}
              description={language === "fr"
                ? "Options générales de notifications"
                : "General notification options"}
            >
              <PreferenceItem
                id="notify_on_weekends"
                label={language === "fr" ? "Notifications le week-end" : "Weekend notifications"}
                description={language === "fr"
                  ? "Recevoir des notifications les samedis et dimanches"
                  : "Receive notifications on Saturdays and Sundays"}
                checked={preferences.notify_on_weekends}
                onChange={(v) => updatePreference("notify_on_weekends", v)}
              />

              {/* Heures silencieuses */}
              <div className="px-6 py-5">
                <div className="min-w-0">
                  <Label className="text-sm font-medium">
                    {language === "fr" ? "Heures silencieuses" : "Quiet hours"}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "fr"
                      ? "Ne pas recevoir de notifications pendant ces heures"
                      : "Do not receive notifications during these hours"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="quiet-start" className="text-xs mb-1 block text-muted-foreground">
                      {language === "fr" ? "Début" : "Start"}
                    </Label>
                  <TimePicker
                      id="quiet-start"
                    value={preferences.quiet_hours_start || null}
                    onChange={(v) => updatePreference("quiet_hours_start", v)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end" className="text-xs mb-1 block text-muted-foreground">
                      {language === "fr" ? "Fin" : "End"}
                    </Label>
                  <TimePicker
                      id="quiet-end"
                    value={preferences.quiet_hours_end || null}
                    onChange={(v) => updatePreference("quiet_hours_end", v)}
                    />
                  </div>
                </div>
              </div>

              {/* Langue préférée */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="language" className="text-sm font-medium">
                    {language === "fr" ? "Langue des notifications" : "Notification language"}
                  </Label>
                </div>
                <div className="mt-3">
                  <Select
                    value={preferences.preferred_language}
                    onValueChange={(v) => updatePreference("preferred_language", v as "fr" | "en")}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PreferenceSection>
          </TabsContent>
        </Tabs>
      </div>

      {/* Barre d'actions (mobile + access rapide) */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="shrink-0"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === "fr" ? "Reset" : "Reset"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/notifications")}
                disabled={isSaving}
              >
                {language === "fr" ? "Annuler" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="bg-babana-cyan hover:bg-babana-cyan/90"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === "fr" ? "..." : "..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {language === "fr" ? "Enregistrer" : "Save"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

