import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, data, useActionData, useNavigation } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import { Layout } from '~/components';
import { Loader2 } from "lucide-react";
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';
import { hasAnyRole } from '~/lib/auth/permissions';

import { useActivationForm } from '~/routes/sales/activation/hooks/useActivationForm';
import { AccessDenied } from '~/routes/sales/activation/components/AccessDenied';
import { NoCustomerScreen } from '~/routes/sales/activation/components/NoCustomerScreen';
import { SuccessScreen } from '~/routes/sales/activation/components/SuccessScreen';
import { ErrorScreen } from '~/routes/sales/activation/components/ErrorScreen';
import { QuotaReachedScreen } from '~/routes/sales/activation/components/QuotaReachedScreen';
import { ActivationForm } from '~/routes/sales/activation/components/ActivationForm';
import type { CustomerData } from '~/routes/sales/activation/types';
import { AUTHORIZED_ROLES, canAccessCustomerForActivation } from "~/routes/sales/activation/config";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data({
        user: null,
        hasAccess: false,
        error: null,
        customer: null,
        activationStatus: null,
        quotaReached: false
      });
    }

    const hasAccess = hasAnyRole(user, AUTHORIZED_ROLES as any);

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null,
        customer: null,
        activationStatus: null,
        quotaReached: false
      });
    }

    // SÉCURITÉ : Ne pas charger le client depuis l'URL
    // L'utilisateur doit toujours passer par la recherche de clients
    // Les données du client seront fournies via location.state dans le composant
    // Cela empêche les utilisateurs de modifier l'ID dans l'URL pour accéder à des clients non autorisés

    return data({
      user,
      hasAccess: true,
      error: null,
      customer: null, // Ne jamais charger depuis l'URL
      activationStatus: null,
      quotaReached: false
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);

    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données',
      customer: null,
      activationStatus: null,
      quotaReached: false
    });
  }
}

// --- ACTION ---
export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const simNumber = formData.get('sim_number') as string;
  const iccid = formData.get('iccid') as string;
  const imei = formData.get('imei') as string;
  const ba_notes = formData.get('ba_notes') as string;
  const customerId = formData.get('customerId') as string;

  if (!simNumber || !iccid || !imei || !customerId) {
    return data({
      success: false,
      error: 'Tous les champs requis doivent être remplis',
      errors: {},
      activation: null
    }, { status: 400 });
  }

  // Vérifier l'authentification et les permissions
  const user = await getCurrentUser(request);
  if (!user) {
    return data({
      success: false,
      error: 'Vous devez être authentifié',
      errors: {},
      activation: null
    }, { status: 401 });
  }

  // Vérifier que l'utilisateur a un rôle autorisé
  if (!hasAnyRole(user, AUTHORIZED_ROLES as any)) {
    return data({
      success: false,
      error: 'Vous n\'avez pas la permission d\'effectuer cette action',
      errors: {},
      activation: null
    }, { status: 403 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    // SÉCURITÉ : Vérifier que l'utilisateur peut accéder à ce client
    // Charger le client pour vérifier les permissions
    try {
      const customerResponse = await api.get(`/customers/${customerId}`);
      const customer = customerResponse.data?.data || customerResponse.data;
      
      if (!canAccessCustomerForActivation(user, customer)) {
        return data({
          success: false,
          error: 'Vous n\'avez pas la permission d\'accéder à ce client',
          errors: {},
          activation: null
        }, { status: 403 });
      }
    } catch (error: any) {
      // Si l'API retourne 403 ou 404, c'est probablement un accès non autorisé
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return data({
          success: false,
          error: 'Client introuvable ou accès non autorisé',
          errors: {},
          activation: null
        }, { status: error.response.status });
      }
      throw error; // Propager les autres erreurs
    }

    const response = await api.post('/activation-requests', {
      customer_id: customerId,
      sim_number: simNumber,
      iccid: iccid,
      imei: imei,
      ba_notes: ba_notes || undefined
    });

    const activation = response.data?.data || response.data;

    return data({
      success: true,
      activation,
      error: null,
      errors: {}
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'activation SIM:', error);
    
    const errorResponse = error?.response;
    const errorData = errorResponse?.data;
    const status = errorResponse?.status || 500;

    // Extraire tous les messages d'erreur
    let errorMessage = '';
    const errors: Record<string, string[]> = {};

    // 1. Erreurs de validation (format Laravel: { errors: { field: [messages] } })
    if (errorData?.errors && typeof errorData.errors === 'object') {
      Object.keys(errorData.errors).forEach((field) => {
        const fieldErrors = errorData.errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
    }

    // 2. Message d'erreur principal
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Si on n'a pas de message mais qu'on a des erreurs de validation, utiliser le premier
    if (!errorMessage && Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      errorMessage = errors[firstField][0];
    }

    // Message par défaut si rien n'est trouvé
    if (!errorMessage) {
      errorMessage = 'Une erreur est survenue lors de l\'activation';
    }

    return data({
      success: false,
      error: errorMessage,
      errors,
      activation: null
    }, { status });
  }
}


// --- COMPOSANT PRINCIPAL ---
export default function SimActivationPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  usePageTitle(t.pages.sales.activation.title);

  const { user, hasAccess, error: loaderError } = loaderData;
  const isAuthenticated = !!user;

  // SÉCURITÉ : Le client doit toujours venir de location.state (après une recherche)
  // Ne jamais charger depuis l'URL pour empêcher les attaques par manipulation d'ID
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [activationStatus, setActivationStatus] = useState<any>(null);
  const [quotaReached, setQuotaReached] = useState(false);
  const [showNoCustomerError, setShowNoCustomerError] = useState(false);
  const processedActionDataRef = useRef<any>(null);
  const previousShowSuccessRef = useRef<boolean>(false);
  // Préserver les données du client pour permettre de nouvelles activations
  const customerDataRef = useRef<{ customer: CustomerData | null; activationStatus: any } | null>(null);
  const shouldProcessActionData = navigation.state === 'idle';

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
    clearApiErrors,
  } = useActivationForm(t);


  // Load customer data - UNIQUEMENT depuis location.state (après recherche)
  useEffect(() => {
    // Le client doit venir de location.state (passé après une recherche de client)
    if (location.state && location.state.customer) {
      const customerFromState = location.state.customer;
      const activationStatusFromState = location.state.activationStatus;
      
      // SÉCURITÉ : Vérifier les permissions même si le client vient de location.state
      // Cela empêche un utilisateur de modifier location.state dans les DevTools
      if (canAccessCustomerForActivation(user, customerFromState)) {
        setCustomer(customerFromState);
        setShowNoCustomerError(false);
        
        // Préserver les données du client pour permettre de nouvelles activations
        customerDataRef.current = {
          customer: customerFromState,
          activationStatus: activationStatusFromState
        };
        
        // Utiliser le statut d'activation depuis location.state si disponible
        if (activationStatusFromState) {
          setActivationStatus(activationStatusFromState);
          setQuotaReached(!activationStatusFromState.can_activate);
        }
      } else {
        // L'utilisateur n'a pas le droit d'accéder à ce client
        setShowNoCustomerError(true);
        toast.error('Vous n\'avez pas la permission d\'accéder à ce client');
      }
      return;
    }

    // Si aucun customer dans location.state, essayer de restaurer depuis la référence
    // (pour permettre de nouvelles activations sans perdre les données du client)
    if (customerDataRef.current && customerDataRef.current.customer) {
      const preservedCustomer = customerDataRef.current.customer;
      const preservedStatus = customerDataRef.current.activationStatus;
      
      // Vérifier à nouveau les permissions (cast pour compatibilité de type)
      if (canAccessCustomerForActivation(user, preservedCustomer as any)) {
        setCustomer(preservedCustomer);
        setShowNoCustomerError(false);
        
        if (preservedStatus) {
          setActivationStatus(preservedStatus);
          setQuotaReached(!preservedStatus.can_activate);
        }
        return;
      }
    }

    // Si aucun customer dans location.state ni dans la référence, afficher l'erreur après un court délai
    const timer = setTimeout(() => {
      setShowNoCustomerError(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state, user]);

  // Gérer la réponse de l'action
  useEffect(() => {
    // Ne pas traiter l'actionData si showSuccess vient de passer de true à false
    // (cela signifie qu'on vient de faire une nouvelle activation)
    const justResetFromSuccess = previousShowSuccessRef.current && !showSuccess;
    
    // Mettre à jour la référence de l'état précédent
    previousShowSuccessRef.current = showSuccess;

    // Ne pas traiter l'actionData si on vient juste de réinitialiser depuis un succès
    if (justResetFromSuccess && actionData?.success) {
      // Ignorer cette actionData car on vient de faire une nouvelle activation
      processedActionDataRef.current = actionData; // Marquer comme traitée pour éviter de la retraiter
      return;
    }

    // Ne traiter l'actionData que si :
    // 1. On a une actionData
    // 2. On ne l'a pas déjà traitée
    // 3. La navigation est idle
    // 4. On n'est pas déjà en état de succès
    if (actionData && actionData !== processedActionDataRef.current && shouldProcessActionData && !showSuccess) {
      processedActionDataRef.current = actionData;
      if (actionData.success) {
        toast.success(t.simActivation.success || 'Activation réussie !');
        handleSubmitSuccess();
      } else if (actionData.error) {
        // Afficher le message d'erreur principal dans le toaster
        toast.error(actionData.error);
        // Passer les erreurs de validation à handleSubmitError pour les afficher sur le formulaire
        handleSubmitError(actionData.error, actionData.errors);
      }
    }
  }, [actionData, shouldProcessActionData, showSuccess, handleSubmitSuccess, handleSubmitError, t]);

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
    // Réinitialiser complètement pour une nouvelle activation
    // Réinitialiser la référence pour permettre de traiter une nouvelle actionData
    // resetForNewActivation() mettra showSuccess à false, ce qui empêchera
    // le retraitement de l'ancienne actionData dans le useEffect
    processedActionDataRef.current = null;
    resetForNewActivation();
    
    // Restaurer le client depuis la référence pour permettre une nouvelle activation
    // sans avoir à refaire une recherche
    if (customerDataRef.current && customerDataRef.current.customer) {
      const preservedCustomer = customerDataRef.current.customer;
      const preservedStatus = customerDataRef.current.activationStatus;
      
      // Vérifier à nouveau les permissions
      if (canAccessCustomerForActivation(user, preservedCustomer as any)) {
        setCustomer(preservedCustomer);
        setShowNoCustomerError(false);
        
        if (preservedStatus) {
          setActivationStatus(preservedStatus);
          setQuotaReached(!preservedStatus.can_activate);
        }
      }
    }
  };

  const handleRetry = () => {
    // Réinitialiser la référence pour permettre de traiter une nouvelle actionData
    processedActionDataRef.current = null;
    clearApiErrors();
    resetForRetry();
  };

  // --- ÉCRAN D'ERREUR : ACCÈS REFUSÉ ---
  if ((loaderData as any).accessDenied || loaderError) {
    return (
      <Layout>
        <Toaster />
        <AccessDenied onBack={handleGoHome} />
      </Layout>
    );
  }

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

  // --- ÉCRAN : QUOTA ATTEINT ---
  if (quotaReached && activationStatus && customer) {
    return (
      <Layout>
        <Toaster />
        <QuotaReachedScreen
          customerName={customer.full_name || (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : undefined)}
          maxActivations={activationStatus.max_activations || 3}
          activationsCount={activationStatus.activations_count || 0}
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
