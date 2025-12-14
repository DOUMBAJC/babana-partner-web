import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLanguage, useTranslation, usePageTitle } from '~/hooks';
import { AuthLayout, FormInput, Button } from '~/components';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authService } from '~/lib/auth.service';
import type { ApiError } from '~/lib/axios';
import type { Route } from "./+types/reset-password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Réinitialisation de mot de passe" }
  ];
}

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

/**
 * Page de réinitialisation du mot de passe
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { t: translations } = useTranslation();
  usePageTitle(translations.pages.resetPassword.title);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [formData, setFormData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = t('Le mot de passe est requis', 'Password is required');
    } else if (formData.password.length < 8) {
      newErrors.password = t(
        'Le mot de passe doit contenir au moins 8 caractères',
        'Password must be at least 8 characters'
      );
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t(
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
        'Password must contain at least one uppercase, one lowercase and one number'
      );
    }

    // Validation de la confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(
        'La confirmation du mot de passe est requise',
        'Password confirmation is required'
      );
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        'Les mots de passe ne correspondent pas',
        'Passwords do not match'
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Vérifier le token
    if (!token) {
      setErrors({
        general: t(
          'Lien de réinitialisation invalide ou expiré',
          'Invalid or expired reset link'
        ),
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.resetPassword(token, formData.password, formData.confirmPassword, email);
      if (response.success) {
        navigate('/login', {
          state: {
            message: response.message,
          },
        });
      } else {
        setErrors({
          general: response.message,
        });
      }

      // Succès - Rediriger vers la connexion avec message
      navigate('/login', {
        state: {
          message: response.message,
        },
      });
    } catch (err) {
      setErrors({
        general: (err as unknown as ApiError).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Indicateur de force du mot de passe
  const getPasswordStrength = (): { strength: number; label: string; color: string } => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) {
      return {
        strength: 33,
        label: t('Faible', 'Weak'),
        color: 'bg-red-500',
      };
    } else if (strength <= 3) {
      return {
        strength: 66,
        label: t('Moyen', 'Medium'),
        color: 'bg-yellow-500',
      };
    } else {
      return {
        strength: 100,
        label: t('Fort', 'Strong'),
        color: 'bg-green-500',
      };
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength() : null;

  // Affichage si pas de token
  if (!token) {
    return (
      <AuthLayout
        title={t('Lien invalide', 'Invalid link')}
        description={t('Ce lien de réinitialisation est invalide', 'This reset link is invalid')}
      >
        <div className="space-y-6">
          <div className="form-element rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                {t('Lien de réinitialisation invalide', 'Invalid reset link')}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                {t(
                  'Ce lien est invalide ou a expiré. Veuillez demander un nouveau lien.',
                  'This link is invalid or has expired. Please request a new link.'
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/forgot-password')}
            variant="gradient"
            style={{
              background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
            }}
            className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 form-button"
          >
            {t('Demander un nouveau lien', 'Request new link')}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('Nouveau mot de passe', 'New password')}
      description={t(
        'Créez un nouveau mot de passe sécurisé',
        'Create a new secure password'
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nouveau mot de passe */}
        <div className="space-y-2 form-element">
          <FormInput
            label={t('Nouveau mot de passe', 'New password')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
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
            error={errors.password}
            required
            autoComplete="new-password"
            autoFocus
          />

          {/* Indicateur de force du mot de passe */}
          {formData.password && passwordStrength && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t('Force du mot de passe', 'Password strength')}
                </span>
                <span
                  className={`font-medium ${
                    passwordStrength.strength === 33
                      ? 'text-red-500'
                      : passwordStrength.strength === 66
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirmation du mot de passe */}
        <FormInput
          label={t('Confirmer le mot de passe', 'Confirm password')}
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="w-5 h-5" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        {/* Conseils de sécurité */}
        <div className="form-element bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-babana-cyan" />
            {t('Conseils pour un mot de passe sûr', 'Tips for a secure password')}
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3 h-3 ${
                  formData.password.length >= 8 ? 'text-green-500' : 'text-muted-foreground'
                }`}
              />
              {t('Au moins 8 caractères', 'At least 8 characters')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3 h-3 ${
                  /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-muted-foreground'
                }`}
              />
              {t('Une lettre majuscule', 'One uppercase letter')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3 h-3 ${
                  /[a-z]/.test(formData.password) ? 'text-green-500' : 'text-muted-foreground'
                }`}
              />
              {t('Une lettre minuscule', 'One lowercase letter')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3 h-3 ${
                  /\d/.test(formData.password) ? 'text-green-500' : 'text-muted-foreground'
                }`}
              />
              {t('Un chiffre', 'One number')}
            </li>
          </ul>
        </div>

        {/* Message d'erreur général */}
        {errors.general && (
          <div className="form-element rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start space-x-3">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
              <svg
                className="w-4 h-4 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 flex-1">{errors.general}</p>
          </div>
        )}

        {/* Bouton de réinitialisation */}
        <Button
          type="submit"
          variant="gradient"
          style={{
            background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
          }}
          className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 form-button group"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t('Réinitialisation...', 'Resetting...')}
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 w-5 h-5" />
              {t('Réinitialiser le mot de passe', 'Reset password')}
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground form-element">
        <p>
          {t('Vous vous souvenez de votre mot de passe ?', 'Remember your password?')}{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-babana-cyan hover:underline font-medium"
          >
            {t('Se connecter', 'Sign in')}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

