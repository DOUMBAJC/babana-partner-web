import { useState, useEffect } from 'react';
import { useNavigate, data, useActionData } from 'react-router';
import { 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  Badge as BadgeIcon
} from 'lucide-react';
import {
  Card,
  Badge,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks'; 
import type { Customer, IdCardType } from '~/types/customer.types';
import type { Route } from "./+types/route";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';

// Import des composants et configurations modulaires
import { AUTHORIZED_ROLES, type SearchQuery, type ActivationStatus } from './config';
import { useIdCardValidation } from './hooks/useIdCardValidation';
import {
  CustomerFoundCard,
  CustomerNotFoundCard,
  SearchForm
} from './components';

// --- LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    console.log('user', user);
    
    if (!user) {
      return data({ 
        user: null, 
        idCardTypes: [], 
        hasAccess: false,
        error: null 
      });
    }

    
    const hasAccess = user.roles?.some((role) => AUTHORIZED_ROLES.includes(role))

    if (!hasAccess) {
      return data({ 
        user, 
        idCardTypes: [], 
        hasAccess: false,
        error: null 
      });
    }

    const api = await createAuthenticatedApi(request);
    const response = await api.get('/idCardTypes');
    
    const idCardTypes = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || []);

    return data({ 
      user, 
      idCardTypes, 
      hasAccess: true,
      error: null 
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);
    
    return data({ 
      user: null, 
      idCardTypes: [], 
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données' 
    });
  }
}

// --- ACTION ---
export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);
  
  const formData = await request.formData();
  const idCardTypeId = formData.get('id_card_type_id') as string;
  const idCardNumber = formData.get('id_card_number') as string;

  if (!idCardTypeId || !idCardNumber) {
    return data({
      success: false,
      error: t.customerSearch.errors.fillAllFields,
      searchStatus: 'idle'
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    
    const response = await api.post('/customers/searchByIdCard', {
      id_card_type_id: parseInt(idCardTypeId),
      id_card_number: idCardNumber
    });

    const responseData = response.data;
    
    if (responseData.found && responseData.data) {
      return data({
        success: true,
        searchStatus: 'found',
        customer: responseData.data,
        activationStatus: responseData.activation_status || null,
        error: null
      });
    } else {
      return data({
        success: false,
        searchStatus: 'not_found',
        customer: null,
        activationStatus: null,
        error: responseData.message || t.customerSearch.results.notFound,
        searchQuery: { id_card_type_id: idCardTypeId, id_card_number: idCardNumber }
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de la recherche:', error);
    
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    
    // 401 - Non authentifié
    if (status === 401) {
      return data({
        success: false,
        searchStatus: 'idle',
        customer: null,
        activationStatus: null,
        error: 'Vous devez être authentifié',
        errorType: 'authentication'
      }, { status: 401 });
    }
    
    // 403 - Non autorisé
    if (status === 403) {
      return data({
        success: false,
        searchStatus: 'idle',
        customer: null,
        activationStatus: null,
        error: 'Vous n\'avez pas les permissions nécessaires',
        errorType: 'authorization'
      }, { status: 403 });
    }
    
    // 422 - Erreurs de validation
    if (status === 422) {
      return data({
        success: false,
        searchStatus: 'idle',
        customer: null,
        activationStatus: null,
        error: 'Erreurs de validation',
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }
    
    return data({
      success: false,
      searchStatus: 'idle',
      customer: null,
      activationStatus: null,
      error: error?.message || errorData?.message || 'Une erreur est survenue lors de la recherche',
      errorType: 'general'
    }, { status: 500 });
  }
}

// --- COMPOSANT PRINCIPAL ---
export default function CustomerSearchPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.search.title);
  
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  
  const { user, idCardTypes, hasAccess, error: loaderError } = loaderData;
  const isAuthenticated = !!user;
  
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    id_card_type_id: (actionData as any)?.searchQuery?.id_card_type_id || '',
    id_card_number: (actionData as any)?.searchQuery?.id_card_number || ''
  });

  const searchStatus = (actionData as any)?.searchStatus || 'idle';
  const customer = (actionData as any)?.customer || null;
  const activationStatus = (actionData as any)?.activationStatus || null;
  const errorMessage = (actionData as any)?.error || loaderError || '';

  const selectedCardType = idCardTypes.find(
    (type: IdCardType) => type.id.toString() === searchQuery.id_card_type_id
  );

  const { 
    validationError, 
    validateIdCardNumber, 
    setValidationError 
  } = useIdCardValidation(selectedCardType, t.customerSearch.errors.invalidFormat);

  const handleIdCardNumberChange = (value: string) => {
    setSearchQuery({...searchQuery, id_card_number: value});
    
    if (value.length > 0) {
      validateIdCardNumber(value);
    } else {
      setValidationError('');
    }
  };

  const handleIdCardTypeChange = (value: string) => {
    setSearchQuery({...searchQuery, id_card_type_id: value});
    
    if (searchQuery.id_card_number) {
      setTimeout(() => {
        const newCardType = idCardTypes.find(
          (type: IdCardType) => type.id.toString() === value
        );
        if (newCardType?.validation_pattern) {
          try {
            const regex = new RegExp(newCardType.validation_pattern);
            const isValid = regex.test(searchQuery.id_card_number);
            if (!isValid) {
              setValidationError(
                t.customerSearch.errors.invalidFormat 
                || `Format invalide pour ${newCardType.name}`
              );
            } else {
              setValidationError('');
            }
          } catch (error) {
            setValidationError('');
          }
        } else {
          setValidationError('');
        }
      }, 100);
    }
  };

  // Afficher les toasts pour les réponses du serveur
  useEffect(() => {
    if (actionData) {
      if (actionData.success && actionData.searchStatus === 'found') {
        toast.success(t.customerSearch.results.found || 'Client trouvé !');
      } else if (!actionData.success && actionData.searchStatus === 'not_found') {
        toast.info(t.customerSearch.results.notFound || 'Client non trouvé');
      } else if (actionData.error && actionData.searchStatus === 'idle') {
        const errorType = (actionData as any).errorType;
        if (errorType === 'authentication' || errorType === 'authorization') {
          toast.error(actionData.error);
        } else if (errorType === 'validation') {
          toast.error('Erreurs de validation');
        } else {
          toast.error(actionData.error);
        }
      }
    }
  }, [actionData, t]);

  const handleReset = () => {
    setSearchQuery({ id_card_type_id: '', id_card_number: '' });
    setValidationError('');
    // Naviguer vers la même route pour réinitialiser sans rechargement brutal
    navigate('/customers/search', { replace: true });
  };

  const handleCreateCustomer = () => {
    navigate('/customers/create', {
      state: {
        idCardTypeId: searchQuery.id_card_type_id,
        idCardNumber: searchQuery.id_card_number
      }
    });
  };

  const handleActivateCustomer = () => {
    if (customer) {
      navigate(`/sales/activation?customerId=${customer.id}`, { state: { customer } });
    }
  };

  useEffect(()=>{
    if (!isAuthenticated) {
      navigate('/login');
    }
  
    if (isAuthenticated && !hasAccess) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, hasAccess])

  const isLocked = searchStatus === 'found';

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
              {t.customerSearch.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerSearch.subtitleIdCard}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                {t.customerSearch.securePortal}
              </Badge>
            </div>
          </div>
          
          {/* Carte principale */}
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
            <div className="p-8 md:p-10 space-y-8">
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t.customerSearch.searchCriteria}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.customerSearch.searchCriteriaDescription}
                    </p>
                  </div>
                </div>
                {searchStatus === 'found' && (
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-3 py-1 text-sm">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {t.customerSearch.results.found}
                  </Badge>
                )}
              </div>

              {/* Message d'erreur */}
              {errorMessage && searchStatus !== 'found' && (
                <div className={`border rounded-xl p-5 flex items-start gap-4 ${
                  (actionData as any)?.errorType === 'authentication' || (actionData as any)?.errorType === 'authorization'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
                }`}>
                  <div className={`p-2 rounded-full mt-1 ${
                    (actionData as any)?.errorType === 'authentication' || (actionData as any)?.errorType === 'authorization'
                      ? 'bg-red-500/20 text-red-600'
                      : 'bg-yellow-500/20 text-yellow-600'
                  }`}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      (actionData as any)?.errorType === 'authentication' || (actionData as any)?.errorType === 'authorization'
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {(actionData as any)?.errorType === 'authentication' || (actionData as any)?.errorType === 'authorization'
                        ? 'Accès refusé'
                        : t.customerSearch.errors.attention
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      (actionData as any)?.errorType === 'authentication' || (actionData as any)?.errorType === 'authorization'
                        ? 'text-red-600/90 dark:text-red-400/90'
                        : 'text-yellow-600/90 dark:text-yellow-400/90'
                    }`}>
                      {errorMessage}
                    </p>
                    
                    {/* Afficher les erreurs de validation si disponibles */}
                    {(actionData as any)?.validationErrors && (
                      <ul className="mt-2 space-y-1 text-sm">
                        {Object.entries((actionData as any).validationErrors).map(([field, errors]) => (
                          <li key={field} className="flex items-start gap-2">
                            <span className="font-medium">{field}:</span>
                            <span>{Array.isArray(errors) ? errors.join(', ') : String(errors)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Résultat : Client trouvé */}
              {searchStatus === 'found' && customer && (
                <CustomerFoundCard
                  customer={customer}
                  activationStatus={activationStatus}
                  onActivateCustomer={handleActivateCustomer}
                  onReset={handleReset}
                />
              )}

              {/* Formulaire de recherche */}
              <SearchForm
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                idCardTypes={idCardTypes}
                validationError={validationError}
                onIdCardNumberChange={handleIdCardNumberChange}
                onIdCardTypeChange={handleIdCardTypeChange}
                isLocked={isLocked}
                selectedCardType={selectedCardType}
              />

              {/* Actions : Client non trouvé */}
              {searchStatus === 'not_found' && (
                <CustomerNotFoundCard
                  onCreateCustomer={handleCreateCustomer}
                  onReset={handleReset}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
