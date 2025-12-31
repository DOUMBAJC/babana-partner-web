import { useState, useEffect } from "react";
import { useNavigate, useLocation, data, useActionData } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import { Layout } from '~/components';
import { Loader2 } from "lucide-react";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';

import { useActivationForm } from '~/routes/sales/activation/hooks/useActivationForm';
import { AccessDenied } from '~/routes/sales/activation/components/AccessDenied';
import { NoCustomerScreen } from '~/routes/sales/activation/components/NoCustomerScreen';
import { SuccessScreen } from '~/routes/sales/activation/components/SuccessScreen';
import { ErrorScreen } from '~/routes/sales/activation/components/ErrorScreen';
import { ActivationForm } from '~/routes/sales/activation/components/ActivationForm';
import type { CustomerData } from '~/routes/sales/activation/types';
import { AUTHORIZED_ROLES } from "~/routes/sales/activation/config";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data({
        user: null,
        hasAccess: false,
        error: null,
        customer: null
      });
    }

    const hasAccess = user.roles?.some((role: any) => AUTHORIZED_ROLES.includes(role));

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null,
        customer: null
      });
    }

    // Essayer de charger le customer depuis l'URL si un ID est fourni
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    let customer = null;
    if (customerId) {
      try {
        const api = await createAuthenticatedApi(request);
        const response = await api.get(`/customers/${customerId}`);
        customer = response.data?.data || response.data;
      } catch (error) {
        console.warn('Impossible de charger le customer depuis l\'URL:', error);
        // Ne pas échouer complètement, continuer sans customer
      }
    }

    return data({
      user,
      hasAccess: true,
      error: null,
      customer
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);

    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données',
      customer: null
    });
  }
}

// --- ACTION ---
export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const simNumber = formData.get('simNumber') as string;
  const iccid = formData.get('iccid') as string;
  const imei = formData.get('imei') as string;
  const ba_notes = formData.get('ba_notes') as string;
  const customerId = formData.get('customerId') as string;

  if (!simNumber || !iccid || !imei || !customerId) {
    return data({
      success: false,
      error: 'Tous les champs requis doivent être remplis',
      activation: null
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    const response = await api.post('/activation-requests', {
      customer_id: parseInt(customerId),
      sim_number: simNumber,
      iccid: iccid,
      imei: imei,
      ba_notes: ba_notes || undefined
    });

    const activation = response.data?.data || response.data;

    return data({
      success: true,
      activation,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'activation SIM:', error);
    return data({
      success: false,
      error: error?.response?.data?.message || error?.message || 'Une erreur est survenue lors de l\'activation',
      activation: null
    }, { status: 500 });
  }
}


// --- COMPOSANT PRINCIPAL ---
export default function SimActivationPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const actionData = useActionData<typeof action>();

  usePageTitle(t.pages.sales.activation.title);

  const { user, hasAccess, error: loaderError, customer: loaderCustomer } = loaderData;
  const isAuthenticated = !!user;

  const [customer, setCustomer] = useState<CustomerData | null>(loaderCustomer);
  const [showNoCustomerError, setShowNoCustomerError] = useState(false);

  // Utilisation du hook modulaire pour la gestion du formulaire
  const {
    formData,
    errors,
    loading,
    errorMessage,
    showSuccess,
    showApiError,
    validateForm,
    handleInputChange,
    handleSubmitStart,
    handleSubmitSuccess,
    handleSubmitError,
    resetForRetry,
    resetForNewActivation,
  } = useActivationForm(t);


  // Load customer data - priorité: loader > location.state
  useEffect(() => {
    // Si on a un customer du loader, l'utiliser
    if (loaderCustomer) {
      setCustomer(loaderCustomer);
      setShowNoCustomerError(false);
      return;
    }

    // Sinon, essayer location.state
    if (location.state && location.state.customer) {
      setCustomer(location.state.customer);
      setShowNoCustomerError(false);
      return;
    }

    // Si aucun customer, afficher l'erreur après un court délai
    const timer = setTimeout(() => {
      setShowNoCustomerError(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [loaderCustomer, location.state]);

  // Gérer la réponse de l'action
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(t.simActivation.success || 'Activation réussie !');
        handleSubmitSuccess();
      } else if (actionData.error) {
        toast.error(actionData.error);
        handleSubmitError(actionData.error);
      }
    }
  }, [actionData, handleSubmitSuccess, handleSubmitError, t]);

  const handleSubmit = (e: React.FormEvent) => {
    // La validation côté client avant soumission
    if (!validateForm()) {
      e.preventDefault();
      handleSubmitError(t.simActivation.errors.required || 'Veuillez corriger les erreurs');
      return;
    }

    handleSubmitStart();
  };

  const handleBack = () => {
    navigate("/customers/search");
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToSearch = () => {
    navigate('/customers/search');
  };

  const handleNewActivation = () => {
    resetForNewActivation();
  };

  const handleRetry = () => {
    resetForRetry();
  };

  // --- ÉCRAN D'ERREUR : AUCUN CLIENT ---
  if (showNoCustomerError) {
    return (
      <Layout>
        <Toaster />
        <NoCustomerScreen
          onGoToSearch={handleGoToSearch}
          onGoHome={handleGoHome}
        />
      </Layout>
    );
  }

  // --- ÉCRAN DE SUCCÈS ---
  if (showSuccess) {
    return (
      <Layout>
        <Toaster />
        <SuccessScreen
          onGoToSearch={handleGoToSearch}
          onNewActivation={handleNewActivation}
          onGoHome={handleGoHome}
        />
      </Layout>
    );
  }

  // --- ÉCRAN D'ERREUR API ---
  if (showApiError && errorMessage) {
    return (
      <Layout>
        <Toaster />
        <ErrorScreen
          errorMessage={errorMessage}
          onRetry={handleRetry}
          onGoToSearch={handleGoToSearch}
          onGoHome={handleGoHome}
        />
      </Layout>
    );
  }

  // --- ÉTATS D'AFFICHAGE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && !hasAccess) {
    return (
      <Layout>
        <Toaster />
        <AccessDenied onBack={handleGoHome} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster />
      <ActivationForm
        customer={customer}
        formData={formData}
        errors={errors}
        loading={loading}
        errorMessage={errorMessage}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </Layout>
  );
}
