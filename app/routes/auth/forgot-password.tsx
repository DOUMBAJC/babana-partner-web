import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '~/hooks';
import { AuthLayout } from '~/components/layout/AuthLayout';
import { FormInput } from '~/components/forms/FormInput';
import { Button } from '~/components/ui/button';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '~/lib/auth.service';
import type { ApiError } from '~/lib/axios';

/**
 * Page de demande de réinitialisation de mot de passe
 */
export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError(t.auth.forgotPassword.validation.emailRequired);
      setIsSubmitting(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError(t.auth.forgotPassword.validation.invalidEmail);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(email);
      console.log(response);
      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError((err as unknown as ApiError).message);
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(undefined);
  };

  // Affichage après succès
  if (isSuccess) {
    return (
      <AuthLayout
        title={t.auth.forgotPassword.success.title}
        description={t.auth.forgotPassword.success.subtitle}
      >
        <div className="space-y-6">
          {/* Message de succès */}
          <div className="form-element rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                {t.auth.forgotPassword.success.emailSent}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                {t.auth.forgotPassword.success.sentTo}{' '}
                <strong>{email}</strong>
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="form-element bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">
              {t.auth.forgotPassword.success.nextSteps}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="text-babana-cyan mr-2">1.</span>
                {t.auth.forgotPassword.success.step1}
              </li>
              <li className="flex items-start">
                <span className="text-babana-cyan mr-2">2.</span>
                {t.auth.forgotPassword.success.step2}
              </li>
              <li className="flex items-start">
                <span className="text-babana-cyan mr-2">3.</span>
                {t.auth.forgotPassword.success.step3}
              </li>
            </ul>
          </div>

          {/* Bouton retour */}
          <Link to="/login" className="form-element">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 group"
            >
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t.auth.forgotPassword.buttons.backToSignIn}
            </Button>
          </Link>

          {/* Aide */}
          <div className="form-element text-center text-sm text-muted-foreground">
            <p>
              {t.auth.forgotPassword.success.didntReceive}{' '}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-babana-cyan hover:underline font-medium"
              >
                {t.auth.forgotPassword.buttons.resend}
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Formulaire de demande
  return (
    <AuthLayout
      title={t.auth.forgotPassword.title}
      description={t.auth.forgotPassword.subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description */}
        <div className="form-element text-sm text-muted-foreground text-center bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <p>
            {t.auth.forgotPassword.description}
          </p>
        </div>

        {/* Email */}
        <FormInput
          label={t.auth.forgotPassword.labels.email}
          name="email"
          type="email"
          placeholder={t.auth.forgotPassword.placeholders.email}
          value={email}
          onChange={handleChange}
          icon={<Mail className="w-5 h-5" />}
          error={error}
          required
          autoComplete="email"
          autoFocus
        />

        {/* Bouton d'envoi */}
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
              {t.auth.forgotPassword.buttons.sending}
            </>
          ) : (
            <>
              {t.auth.forgotPassword.buttons.sendLink}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Lien retour */}
      <div className="mt-6 text-center text-sm form-element">
        <Link
          to="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.auth.forgotPassword.buttons.backToSignIn}
        </Link>
      </div>

      {/* Aide supplémentaire */}
      <div className="mt-6 text-center text-xs text-muted-foreground form-element">
        <p>
          {t.auth.forgotPassword.messages.needHelp}{' '}
          <button className="text-babana-cyan hover:underline font-medium">
            {t.auth.forgotPassword.messages.contactSupport}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
