import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation, usePageTitle } from '~/hooks';
import { AuthLayout, FormInput, Button } from '~/components';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { authService } from '~/lib/auth.service';
import type { Route } from "./+types/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Inscription" }
  ];
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  personal_phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  personal_phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

/**
 * Page d'inscription
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  usePageTitle(t.pages.register.title);

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    personal_phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = t.auth.register.validation.firstNameRequired;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = t.auth.register.validation.firstNameTooShort;
    }

    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.auth.register.validation.lastNameRequired;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = t.auth.register.validation.lastNameTooShort;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t.auth.register.validation.emailRequired;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t.auth.register.validation.invalidEmail;
    }

    // Validation du téléphone
    const phoneRegex = /^6[245789][0-9]{7}$/;
    if (!formData.personal_phone.trim()) {
      newErrors.personal_phone = t.auth.register.validation.phoneRequired;
    } else if (!phoneRegex.test(formData.personal_phone.replace(/\s/g, ''))) {
      newErrors.personal_phone = t.auth.register.validation.invalidPhone;
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = t.auth.register.validation.passwordRequired;
    } else if (formData.password.length < 8) {
      newErrors.password = t.auth.register.validation.passwordTooShort;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t.auth.register.validation.passwordWeak;
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.register.validation.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.register.validation.passwordMismatch;
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

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.register({
        name: `${formData.firstName} @ ${formData.lastName}`,
        email: formData.email,
        personal_phone: formData.personal_phone.replace(/\s/g, ''),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      // Succès - Rediriger vers la page de connexion
      navigate('/login', { 
        state: { 
          message: response.message
        } 
      });
    } catch (err: any) {
      setErrors({
        general: err?.message || t.auth.register.messages.registrationError
      });
      console.error('Register error:', err);
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
        label: t.auth.register.strength.weak, 
        color: 'bg-red-500' 
      };
    } else if (strength <= 3) {
      return { 
        strength: 66, 
        label: t.auth.register.strength.medium, 
        color: 'bg-yellow-500' 
      };
    } else {
      return { 
        strength: 100, 
        label: t.auth.register.strength.strong, 
        color: 'bg-green-500' 
      };
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength() : null;

  return (
    <AuthLayout
      title={t.auth.register.title}
      description={t.auth.register.subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label={t.auth.register.labels.firstName}
            name="firstName"
            type="text"
            placeholder={t.auth.register.placeholders.firstName}
            value={formData.firstName}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            error={errors.firstName}
            required
            autoComplete="given-name"
          />

          <FormInput
            label={t.auth.register.labels.lastName}
            name="lastName"
            type="text"
            placeholder={t.auth.register.placeholders.lastName}
            value={formData.lastName}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            error={errors.lastName}
            required
            autoComplete="family-name"
          />
        </div>

        {/* Email */}
        <FormInput
          label={t.auth.register.labels.email}
          name="email"
          type="email"
          placeholder={t.auth.register.placeholders.email}
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="w-5 h-5" />}
          error={errors.email}
          required
          autoComplete="email"
        />

        {/* Téléphone */}
        <FormInput
          label={t.auth.register.labels.personalPhone}
          name="personal_phone"
          type="tel"
          placeholder={t.auth.register.placeholders.phone}
          value={formData.personal_phone}
          onChange={handleChange}
          icon={<Phone className="w-5 h-5" />}
          error={errors.personal_phone}
          required
          autoComplete="tel"
        />

        {/* Mot de passe */}
        <div className="space-y-2 form-element">
          <FormInput
            label={t.auth.register.labels.password}
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
          />

          {/* Indicateur de force du mot de passe */}
          {formData.password && passwordStrength && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t.auth.register.labels.passwordStrength}
                </span>
                <span className={`font-medium ${
                  passwordStrength.strength === 33 ? 'text-red-500' :
                  passwordStrength.strength === 66 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
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
          label={t.auth.register.labels.confirmPassword}
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

        {/* Message d'erreur général */}
        {errors.general && (
          <div className="form-element rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start space-x-3">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 flex-1">{errors.general}</p>
          </div>
        )}

        {/* Bouton d'inscription */}
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
              {t.auth.register.buttons.signingUp}
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 w-5 h-5" />
              {t.auth.register.buttons.signUp}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Lien vers la connexion */}
      <div className="mt-6 text-center text-sm form-element">
        <p className="text-muted-foreground">
          {t.auth.register.messages.alreadyHaveAccount}{' '}
          <Link 
            to="/login" 
            className="text-babana-cyan hover:underline font-medium inline-flex items-center gap-1"
          >
            {t.auth.register.messages.signIn}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </p>
      </div>

      {/* Conditions d'utilisation */}
      <div className="mt-6 text-center text-xs text-muted-foreground form-element">
        <p>
          {t.auth.register.messages.bySigningUp}{' '}
          <button className="text-babana-cyan hover:underline font-medium">
            {t.auth.register.messages.termsOfService}
          </button>
          {' '}{t.auth.register.messages.and}{' '}
          <button className="text-babana-cyan hover:underline font-medium">
            {t.auth.register.messages.privacyPolicy}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

