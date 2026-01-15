import { useState, useEffect } from 'react';
import { Link, useLocation, useActionData, useNavigation, Form, data, redirect } from 'react-router';
import { useAuth, useLanguage } from '~/hooks';
import { AuthLayout, FormInput, Button } from '~/components';
import type { LoginCredentials } from '~/types';
import type { Route } from "./+types/login";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { createUserSession, getLanguage, getUserToken, getSession, destroySession } from '~/services/session.server';
import { createApiFromRequest, getCurrentUser } from '~/services/api.server';
import { getTranslations, type Language } from '~/lib/translations';
import { api, type ApiError } from '~/lib/axios';
import { getClientMetadata } from '~/lib/client/client-metadata';
import { getCachedGeolocation } from '~/lib/geo/geolocation';
import { hasGeolocationConsent, requestGeolocationWithConsent } from '~/lib/geo/consent-geolocation';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Connexion" }
  ];
}

// Loader pour rediriger les utilisateurs déjà connectés
export async function loader({ request }: Route.LoaderArgs) {
  // Vérifier d'abord si un token existe
  const token = await getUserToken(request);
  
  // Si un token existe, vérifier sa validité réelle
  if (token) {
    const user = await getCurrentUser(request);
    
    // Si l'utilisateur est valide et connecté, rediriger vers l'accueil
    if (user) {
      throw redirect('/');
    }
    
    // Si le token existe mais est invalide (session supprimée côté serveur),
    // nettoyer le cookie invalide pour éviter des problèmes futurs
    const session = await getSession(request.headers.get("Cookie"));
    return data(null, {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  
  return null;
}

// Action côté serveur pour gérer le login de manière sécurisée
export async function action({ request }: Route.ActionArgs) {
  // Récupérer la langue de l'utilisateur pour les messages d'erreur
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return data(
      { 
        success: false, 
        error: t.auth.login.errors.emailPasswordRequired,
        emailNotVerified: false,
        email: undefined
      },
      { status: 400 }
    );
  }

  try {
    // Récupérer les métadonnées du client depuis le formulaire
    const loginData: Record<string, any> = {
      email,
      password,
      device_name: formData.get('device_name') as string || undefined,
      client_os: formData.get('client_os') as string || undefined,
      client_browser: formData.get('client_browser') as string || undefined,
      client_browser_version: formData.get('client_browser_version') as string || undefined,
      client_platform: formData.get('client_platform') as string || undefined,
      screen_resolution: formData.get('screen_resolution') as string || undefined,
      timezone: formData.get('timezone') as string || undefined,
      client_language: formData.get('client_language') as string || undefined,
    };

    // Ajouter la géolocalisation si disponible
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const location_accuracy = formData.get('location_accuracy') as string;
    
    if (latitude && longitude) {
      loginData.latitude = parseFloat(latitude);
      loginData.longitude = parseFloat(longitude);
      if (location_accuracy) {
        loginData.location_accuracy = parseFloat(location_accuracy);
      }
    }

    // Créer l'API avec la langue extraite de la requête
    const api = await createApiFromRequest(request);
    const response = await api.post('/auth/login', loginData);
    const { token } = response.data.data;
    const welcomeMessage = response.data.message || response.data.data.message;
    
    // Stocker le token dans un cookie HttpOnly sécurisé
    // et rediriger vers la page d'accueil avec un message de bienvenue
    return createUserSession(token, '/', welcomeMessage);
  } catch (error: any) {
    const responseData = error.response?.data;
    const message = responseData?.message 
      || responseData?.error?.message 
      || responseData?.error
      || t.auth.login.errors.loginFailed;
    
    // Vérifier directement le champ requires_email_verification retourné par le backend
    const isEmailNotVerified = responseData?.requires_email_verification === true;
    
    return data(
      { 
        success: false, 
        error: message,
        emailNotVerified: isEmailNotVerified,
        email: isEmailNotVerified ? email : undefined
      },
      { status: error.response?.status || 401 }
    );
  }
}

export default function LoginPage() {
  const location = useLocation();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { isLoading } = useAuth();
  const { language } = useLanguage();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendEmailSuccess, setResendEmailSuccess] = useState<string | null>(null);
  const [clientMetadata, setClientMetadata] = useState<Record<string, string>>({});

  const isSubmitting = navigation.state === 'submitting';
  const error = actionData?.success === false ? actionData.error : null;
  const emailNotVerified = (actionData && 'emailNotVerified' in actionData) ? actionData.emailNotVerified === true : false;
  const userEmail = (actionData && 'email' in actionData && actionData.email) ? actionData.email : credentials.email;

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Récupérer les métadonnées du client au chargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadMetadata = async () => {
        const metadata = getClientMetadata();
        
        // Récupérer la géolocalisation uniquement si le consentement est accordé
        const hasConsent = hasGeolocationConsent();
        let geolocation = hasConsent ? getCachedGeolocation() : null;
        
        // Si le consentement est donné mais que la géolocalisation n'est pas en cache, essayer de la demander
        if (hasConsent && !geolocation) {
          try {
            geolocation = await requestGeolocationWithConsent();
          } catch (error) {
            console.warn('Impossible de récupérer la géolocalisation:', error);
          }
        }
        
        const metadataFields: Record<string, string> = {
          device_name: `${metadata.os} (${metadata.browser})`,
          client_os: metadata.os,
          client_browser: metadata.browser,
          client_browser_version: metadata.browserVersion,
          client_platform: metadata.platform,
          screen_resolution: metadata.screenResolution,
          timezone: metadata.timezone,
          client_language: metadata.language,
        };

        // Ajouter la géolocalisation uniquement si disponible ET si le consentement est accordé
        if (geolocation && hasConsent) {
          metadataFields.latitude = String(geolocation.latitude);
          metadataFields.longitude = String(geolocation.longitude);
          metadataFields.location_accuracy = String(geolocation.accuracy);
        }

        setClientMetadata(metadataFields);
      };
      
      loadMetadata();
    }
  }, []);

  // Réinitialiser le mot de passe en cas d'erreur
  useEffect(() => {
    if (error) {
      setCredentials(prev => ({ ...prev, password: '' }));
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Effacer le message de succès quand l'utilisateur tape
    if (successMessage) setSuccessMessage(null);
    if (resendEmailSuccess) setResendEmailSuccess(null);
  };

  // Fonction pour renvoyer l'email de vérification
  const handleResendVerificationEmail = async () => {
    if (!userEmail) return;

    setIsResendingEmail(true);
    setResendEmailSuccess(null);
    
    try {
      const response = await api.post('/auth/email/resend', { email: userEmail });
      setResendEmailSuccess(
        response.message || 
        (language === 'fr' 
          ? 'Email de vérification renvoyé avec succès. Vérifiez votre boîte de réception.' 
          : 'Verification email sent successfully. Please check your inbox.')
      );
    } catch (err: any) {
      console.error('Resend verification error:', err);
      const apiError = err as ApiError;
      // L'erreur sera affichée dans le message d'erreur principal
      setResendEmailSuccess(null);
    } finally {
      setIsResendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-br from-babana-navy via-babana-navy to-babana-cyan">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-babana-cyan/30 border-t-babana-cyan" />
          <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-babana-cyan/20" />
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title={t('Connexion', 'Sign In')}
      description={t('Entrez vos identifiants pour accéder à votre compte', 'Enter your credentials to access your account')}
    >
      <Form method="post" className="space-y-5">
        {/* Champs cachés pour les métadonnées du client */}
        {Object.entries(clientMetadata).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        
        {/* Message de succès */}
        {successMessage && (
          <div className="form-element rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <p className="text-sm text-green-600 dark:text-green-400 flex-1">{successMessage}</p>
          </div>
        )}

        {/* Email */}
        <FormInput
          label={t('Adresse email', 'Email address')}
          name="email"
          type="email"
          placeholder={t('votre.email@example.com', 'your.email@example.com')}
          value={credentials.email}
          onChange={handleChange}
          icon={<Mail className="w-5 h-5" />}
          required
          autoComplete="email"
        />

        {/* Mot de passe */}
        <div className="space-y-2 form-element">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('Mot de passe', 'Password')}
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-babana-cyan hover:text-babana-cyan/80 transition-colors font-medium"
            >
              {t('Mot de passe oublié ?', 'Forgot password?')}
            </Link>
          </div>
          <FormInput
            id="password"
            label=""
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            icon={<Lock className="w-5 h-5" />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            containerClassName="!mt-0"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="form-element rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start space-x-3">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              
              {/* Option pour renvoyer l'email de vérification */}
              {emailNotVerified && userEmail && (
                <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                    {t(
                      'Votre email n\'a pas encore été vérifié. Souhaitez-vous recevoir un nouvel email de vérification ?',
                      'Your email has not been verified yet. Would you like to receive a new verification email?'
                    )}
                  </p>
                  <Button
                    type="button"
                    onClick={handleResendVerificationEmail}
                    disabled={isResendingEmail}
                    variant="outline"
                    className="w-full text-sm border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    {isResendingEmail ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        {t('Envoi en cours...', 'Sending...')}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 w-4 h-4" />
                        {t('Renvoyer l\'email de vérification', 'Resend verification email')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message de succès pour le renvoi d'email */}
        {resendEmailSuccess && (
          <div className="form-element rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <p className="text-sm text-green-600 dark:text-green-400 flex-1">{resendEmailSuccess}</p>
          </div>
        )}

        {/* Bouton de connexion */}
        <Button
          type="submit"
          variant="gradient"
          style={{
            background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
            opacity: 1,
          }}
          className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 opacity-100! form-button group"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t('Connexion en cours...', 'Signing in...')}
            </>
          ) : (
            <>
              {t('Se connecter', 'Sign In')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </Form>

      {/* Lien vers l'inscription */}
      <div className="mt-6 text-center text-sm form-element">
        <p className="text-muted-foreground">
          {t('Vous n\'avez pas de compte ?', 'Don\'t have an account?')}{' '}
          <Link 
            to="/register" 
            className="text-babana-cyan hover:underline font-medium inline-flex items-center gap-1"
          >
            {t('S\'inscrire', 'Sign up')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground form-element">
        <p>
          {t("En vous connectant, vous acceptez nos", "By signing in, you agree to our")}{' '}
          <button className="text-babana-cyan hover:underline font-medium">
            {t("Conditions d'utilisation", "Terms of Service")}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
