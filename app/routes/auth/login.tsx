import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { useAuth, useLanguage } from '~/hooks';
import { AuthLayout, FormInput, Button } from '~/components';
import type { LoginCredentials } from '~/types';
import type { Route } from "./+types/login";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ApiError } from '~/lib/axios';
import { authService } from '~/lib/auth.service';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Connexion" }
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAuth();
  const { language } = useLanguage();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
       const response = await authService.login(credentials);
       localStorage.setItem('babana-auth-token', response.data.token);
      // navigate('/');
    } catch (err) {
      setCredentials(prev => ({ ...prev, password: '' }));
      setError((err as unknown as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Effacer les messages quand l'utilisateur tape
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
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
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
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
      </form>

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
