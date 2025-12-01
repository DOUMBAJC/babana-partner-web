import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLanguage } from '~/hooks';
import { AuthLayout, Button } from '~/components';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired';

/**
 * Page de vérification d'email
 */
export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [isResending, setIsResending] = useState(false);

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Vérification automatique au chargement
  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        // TODO: Implémenter l'appel API de vérification
        // const result = await authService.verifyEmail(token);

        // Simulation d'un délai d'API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulation : succès aléatoire
        const isSuccess = Math.random() > 0.3; // 70% de succès
        
        if (isSuccess) {
          setStatus('success');
          
          // Rediriger vers la connexion après 3 secondes
          setTimeout(() => {
            navigate('/login', {
              state: {
                message: t(
                  'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
                  'Email verified successfully! You can now sign in.'
                ),
              },
            });
          }, 3000);
        } else {
          setStatus('expired');
        }
      } catch (err) {
        console.error('Email verification error:', err);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, navigate, t]);

  // Renvoyer l'email de vérification
  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      // TODO: Implémenter l'appel API de renvoi
      // await authService.resendVerificationEmail(email);

      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('success');
    } catch (err) {
      console.error('Resend verification error:', err);
    } finally {
      setIsResending(false);
    }
  };

  // État: Vérification en cours
  if (status === 'verifying') {
    return (
      <AuthLayout
        title={t('Vérification en cours...', 'Verifying...')}
        description={t(
          'Veuillez patienter pendant que nous vérifions votre email',
          'Please wait while we verify your email'
        )}
      >
        <div className="space-y-6">
          <div className="form-element rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-babana-cyan animate-spin" />
              <div className="absolute inset-0 w-16 h-16 bg-babana-cyan/20 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('Vérification de votre email', 'Verifying your email')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('Cela ne prendra que quelques secondes...', 'This will only take a few seconds...')}
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // État: Succès
  if (status === 'success') {
    return (
      <AuthLayout
        title={t('Email vérifié !', 'Email verified!')}
        description={t('Votre compte a été activé avec succès', 'Your account has been activated successfully')}
      >
        <div className="space-y-6">
          <div className="form-element rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                {t('Vérification réussie !', 'Verification successful!')}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                {t(
                  'Votre adresse email a été vérifiée. Vous allez être redirigé vers la page de connexion...',
                  'Your email address has been verified. You will be redirected to the sign in page...'
                )}
              </p>
            </div>
          </div>

          {/* Avantages du compte vérifié */}
          <div className="form-element bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">
              {t('Votre compte est maintenant actif !', 'Your account is now active!')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {t('Accès complet à toutes les fonctionnalités', 'Full access to all features')}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {t('Sécurité renforcée de votre compte', 'Enhanced account security')}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {t('Notifications importantes par email', 'Important email notifications')}
              </li>
            </ul>
          </div>

          {/* Bouton pour aller à la connexion manuellement */}
          <Button
            onClick={() => navigate('/login')}
            variant="gradient"
            style={{
              background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
            }}
            className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 form-button"
          >
            {t('Se connecter maintenant', 'Sign in now')}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // État: Lien expiré
  if (status === 'expired') {
    return (
      <AuthLayout
        title={t('Lien expiré', 'Link expired')}
        description={t('Ce lien de vérification a expiré', 'This verification link has expired')}
      >
        <div className="space-y-6">
          <div className="form-element rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-8 flex flex-col items-center text-center space-y-6">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-4">
              <Mail className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                {t('Lien de vérification expiré', 'Verification link expired')}
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                {t(
                  'Ce lien de vérification a expiré pour des raisons de sécurité. Demandez un nouveau lien pour vérifier votre email.',
                  'This verification link has expired for security reasons. Request a new link to verify your email.'
                )}
              </p>
            </div>
          </div>

          {/* Bouton pour renvoyer l'email */}
          {email && (
            <>
              <div className="form-element bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('Email :', 'Email:')} <strong>{email}</strong>
                </p>
              </div>

              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="gradient"
                style={{
                  background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
                }}
                className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 form-button"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    {t('Envoi en cours...', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-5 h-5" />
                    {t('Renvoyer l\'email de vérification', 'Resend verification email')}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Lien vers le support */}
          <div className="form-element text-center text-sm text-muted-foreground">
            <p>
              {t('Besoin d\'aide ?', 'Need help?')}{' '}
              <button className="text-babana-cyan hover:underline font-medium">
                {t('Contactez le support', 'Contact support')}
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // État: Erreur
  return (
    <AuthLayout
      title={t('Erreur de vérification', 'Verification error')}
      description={t('Impossible de vérifier votre email', 'Unable to verify your email')}
    >
      <div className="space-y-6">
        <div className="form-element rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
            <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
              {t('Vérification impossible', 'Verification failed')}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {t(
                'Le lien de vérification est invalide ou a déjà été utilisé.',
                'The verification link is invalid or has already been used.'
              )}
            </p>
          </div>
        </div>

        {/* Actions possibles */}
        <div className="form-element bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">
            {t('Que faire maintenant ?', 'What to do now?')}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-babana-cyan">•</span>
              {t(
                'Vérifiez que vous avez cliqué sur le bon lien dans l\'email',
                'Check that you clicked the correct link in the email'
              )}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-babana-cyan">•</span>
              {t('Demandez un nouveau lien de vérification', 'Request a new verification link')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-babana-cyan">•</span>
              {t('Contactez notre support si le problème persiste', 'Contact our support if the problem persists')}
            </li>
          </ul>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          {email && (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="gradient"
              style={{
                background: 'linear-gradient(to right, #5FC8E9, rgba(95, 200, 233, 0.8))',
              }}
              className="w-full h-12 font-semibold shadow-babana-cyan/25 duration-300 form-button"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  {t('Envoi en cours...', 'Sending...')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 w-5 h-5" />
                  {t('Renvoyer l\'email', 'Resend email')}
                </>
              )}
            </Button>
          )}

          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full h-12 form-element"
          >
            {t('Retour à la connexion', 'Back to sign in')}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

