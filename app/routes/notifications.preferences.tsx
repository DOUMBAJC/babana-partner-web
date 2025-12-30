/**
 * Page de préférences des notifications
 * Permet de configurer les préférences de réception des notifications
 */

import { useEffect, useState } from "react";
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
  Moon,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
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
    <Card>
      <CardHeader>
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
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/**
 * Composant de ligne de préférence avec switch
 */
interface PreferenceItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceItem({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: PreferenceItemProps) {
  return (
    <div className="flex items-center justify-between space-x-4 py-3">
      <div className="flex-1">
        <Label
          htmlFor={label}
          className={cn(
            "text-sm font-medium cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
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
        quiet_hours_start: preferences.quiet_hours_start,
        quiet_hours_end: preferences.quiet_hours_end,
        preferred_language: preferences.preferred_language,
      };

      const response = await notificationService.updatePreferences(updates);
      setPreferences(response.data);
      setSuccessMessage(language === "fr" 
        ? "Préférences enregistrées avec succès"
        : "Preferences saved successfully");

      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || (language === "fr"
        ? "Erreur lors de l'enregistrement"
        : "Error saving preferences"));
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/notifications")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "fr" ? "Retour aux notifications" : "Back to notifications"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-linear-to-br from-babana-cyan/20 to-babana-blue/20">
              <Bell className="w-8 h-8 text-babana-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t.preferences.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === "fr"
                  ? "Personnalisez vos préférences de réception des notifications"
                  : "Customize your notification preferences"}
              </p>
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

        <div className="space-y-6">
          {/* Notifications Email */}
          <PreferenceSection
            icon={Mail}
            title={language === "fr" ? "Notifications par Email" : "Email Notifications"}
            description={language === "fr" 
              ? "Recevez des emails pour les événements importants"
              : "Receive emails for important events"}
          >
            <PreferenceItem
              label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
              description={language === "fr"
                ? "Recevoir un email quand une demande d'activation est créée"
                : "Receive an email when an activation request is created"}
              checked={preferences.email_activation_request}
              onChange={(v) => updatePreference("email_activation_request", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations approuvées" : "Approved activations"}
              description={language === "fr"
                ? "Recevoir un email quand une activation est approuvée"
                : "Receive an email when an activation is approved"}
              checked={preferences.email_activation_approved}
              onChange={(v) => updatePreference("email_activation_approved", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
              description={language === "fr"
                ? "Recevoir un email quand une activation est rejetée"
                : "Receive an email when an activation is rejected"}
              checked={preferences.email_activation_rejected}
              onChange={(v) => updatePreference("email_activation_rejected", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Mises à jour système" : "System updates"}
              description={language === "fr"
                ? "Recevoir des emails sur les mises à jour importantes"
                : "Receive emails about important updates"}
              checked={preferences.email_system_updates}
              onChange={(v) => updatePreference("email_system_updates", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Messages de bienvenue" : "Welcome messages"}
              description={language === "fr"
                ? "Recevoir des emails de bienvenue"
                : "Receive welcome emails"}
              checked={preferences.email_welcome}
              onChange={(v) => updatePreference("email_welcome", v)}
            />
          </PreferenceSection>

          {/* Notifications In-App */}
          <PreferenceSection
            icon={Database}
            title={language === "fr" ? "Notifications In-App" : "In-App Notifications"}
            description={language === "fr"
              ? "Notifications affichées dans l'application"
              : "Notifications displayed in the application"}
          >
            <PreferenceItem
              label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
              description={language === "fr"
                ? "Voir les notifications de demandes d'activation"
                : "View activation request notifications"}
              checked={preferences.database_activation_request}
              onChange={(v) => updatePreference("database_activation_request", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations approuvées" : "Approved activations"}
              description={language === "fr"
                ? "Voir les notifications d'approbation"
                : "View approval notifications"}
              checked={preferences.database_activation_approved}
              onChange={(v) => updatePreference("database_activation_approved", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
              description={language === "fr"
                ? "Voir les notifications de rejet"
                : "View rejection notifications"}
              checked={preferences.database_activation_rejected}
              onChange={(v) => updatePreference("database_activation_rejected", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Mises à jour système" : "System updates"}
              description={language === "fr"
                ? "Voir les notifications système"
                : "View system notifications"}
              checked={preferences.database_system_updates}
              onChange={(v) => updatePreference("database_system_updates", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Messages de bienvenue" : "Welcome messages"}
              description={language === "fr"
                ? "Voir les messages de bienvenue"
                : "View welcome messages"}
              checked={preferences.database_welcome}
              onChange={(v) => updatePreference("database_welcome", v)}
            />
          </PreferenceSection>

          {/* Notifications Push */}
          <PreferenceSection
            icon={Smartphone}
            title={language === "fr" ? "Notifications Push" : "Push Notifications"}
            description={language === "fr"
              ? "Notifications push sur vos appareils (si disponible)"
              : "Push notifications on your devices (if available)"}
          >
            <PreferenceItem
              label={language === "fr" ? "Demandes d'activation" : "Activation requests"}
              description={language === "fr"
                ? "Recevoir des push pour les demandes"
                : "Receive push for requests"}
              checked={preferences.push_activation_request}
              onChange={(v) => updatePreference("push_activation_request", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations approuvées" : "Approved activations"}
              description={language === "fr"
                ? "Recevoir des push pour les approbations"
                : "Receive push for approvals"}
              checked={preferences.push_activation_approved}
              onChange={(v) => updatePreference("push_activation_approved", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Activations rejetées" : "Rejected activations"}
              description={language === "fr"
                ? "Recevoir des push pour les rejets"
                : "Receive push for rejections"}
              checked={preferences.push_activation_rejected}
              onChange={(v) => updatePreference("push_activation_rejected", v)}
            />
            <Separator />
            <PreferenceItem
              label={language === "fr" ? "Mises à jour système" : "System updates"}
              description={language === "fr"
                ? "Recevoir des push pour les mises à jour"
                : "Receive push for updates"}
              checked={preferences.push_system_updates}
              onChange={(v) => updatePreference("push_system_updates", v)}
            />
          </PreferenceSection>

          {/* Paramètres généraux */}
          <PreferenceSection
            icon={Bell}
            title={language === "fr" ? "Paramètres généraux" : "General settings"}
            description={language === "fr"
              ? "Options générales de notifications"
              : "General notification options"}
          >
            <PreferenceItem
              label={language === "fr" ? "Notifications le week-end" : "Weekend notifications"}
              description={language === "fr"
                ? "Recevoir des notifications les samedis et dimanches"
                : "Receive notifications on Saturdays and Sundays"}
              checked={preferences.notify_on_weekends}
              onChange={(v) => updatePreference("notify_on_weekends", v)}
            />
            <Separator />

            {/* Heures silencieuses */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <Label className="text-sm font-medium">
                  {language === "fr" ? "Heures silencieuses" : "Quiet hours"}
                </Label>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {language === "fr"
                  ? "Ne pas recevoir de notifications pendant ces heures"
                  : "Do not receive notifications during these hours"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start" className="text-xs mb-1 block">
                    {language === "fr" ? "Début" : "Start"}
                  </Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={preferences.quiet_hours_start || ""}
                    onChange={(e) =>
                      updatePreference("quiet_hours_start", e.target.value || null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end" className="text-xs mb-1 block">
                    {language === "fr" ? "Fin" : "End"}
                  </Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={preferences.quiet_hours_end || ""}
                    onChange={(e) =>
                      updatePreference("quiet_hours_end", e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Langue préférée */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="language" className="text-sm font-medium">
                  {language === "fr" ? "Langue des notifications" : "Notification language"}
                </Label>
              </div>
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
          </PreferenceSection>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === "fr" ? "Réinitialiser" : "Reset"}
                </Button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/notifications")}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none"
                  >
                    {language === "fr" ? "Annuler" : "Cancel"}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none bg-babana-cyan hover:bg-babana-cyan/90"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

