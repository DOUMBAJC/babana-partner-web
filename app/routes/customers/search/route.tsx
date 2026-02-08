import { useState, useEffect } from 'react';
import { useNavigate, data, useActionData, useNavigation } from 'react-router';
import { 
  AlertCircle,
  User as UserIcon,
  Search
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
import { useSimNumberValidation } from './hooks/useSimNumberValidation';
import {
  CustomerFoundCard,
  CustomerNotFoundCard,
  SearchForm,
  SearchLoader
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
  const simNumber = (formData.get('sim_number') as string) || '';

  // Validation : au moins un critère doit être fourni
  const hasSimNumber = simNumber && simNumber.trim().length > 0;
  const hasIdCard = idCardTypeId && idCardNumber && idCardNumber.trim().length > 0;

  if (!hasSimNumber && !hasIdCard) {
    return data({
      success: false,
      error: t.customerSearch.errors.atLeastOneField,
      searchStatus: 'idle'
    }, { status: 400 });
  }

  // Validation du format sim_number si fourni
  if (hasSimNumber && !/^62\d{7}$/.test(simNumber)) {
    return data({
      success: false,
      error: t.customerSearch.errors.invalidSimNumber,
      searchStatus: 'idle'
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    // Construire le payload dynamiquement en fonction des champs fournis
    const payload: Record<string, string> = {};
    if (idCardTypeId) {
      payload.id_card_type_id = idCardTypeId;
    }
    if (idCardNumber) {
      payload.id_card_number = idCardNumber;
    }
    if (hasSimNumber) {
      payload.sim_number = simNumber;
    }

    // Une seule méthode POST côté backend : on ajoute simplement sim_number
    const response = await api.post('/customers/searchByIdCard', payload);
    const responseData = response.data;
    
    if (responseData.found && responseData.data) {
      return data({
        success: true,
        searchStatus: 'found',
        customer: responseData.data,
        activationStatus: responseData.activation_status || null,
        error: null
      });
    }
    
    return data({
      success: false,
      searchStatus: 'not_found',
      customer: null,
      activationStatus: null,
      error: responseData.message || t.customerSearch.results.notFound,
      searchQuery: { 
        id_card_type_id: idCardTypeId || '', 
        id_card_number: idCardNumber || '',
        sim_number: simNumber || ''
      }
    });
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
        error: t.customerSearch.errors.mustBeAuthenticated,
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
        error: t.customerSearch.errors.noPermissions,
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
        error: t.customerSearch.errors.validationErrors,
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }
    
    return data({
      success: false,
      searchStatus: 'idle',
      customer: null,
      activationStatus: null,
      error: error?.message || errorData?.message || t.customerSearch.errors.searchError,
      errorType: 'general'
    }, { status: 500 });
  }
}

// --- COMPOSANT PRINCIPAL ---
export default function CustomerSearchPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.search.title);
  
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  
  // Masquer le loader dès que actionData est disponible (réponse reçue)
  const isSearching = (navigation.state === 'submitting' || navigation.state === 'loading') && !actionData;
  
  const { user, idCardTypes, hasAccess, error: loaderError } = loaderData;
  const isAuthenticated = !!user;
  
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    id_card_type_id: (actionData as any)?.searchQuery?.id_card_type_id || '',
    id_card_number: (actionData as any)?.searchQuery?.id_card_number || '',
    sim_number: (actionData as any)?.searchQuery?.sim_number || ''
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

  const {
    validationError: simNumberValidationError,
    validateSimNumber,
    setValidationError: setSimNumberValidationError
  } = useSimNumberValidation(t.customerSearch.errors.invalidSimNumber);

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
          toast.error(t.customerSearch.errors.validationErrors);
        } else {
          toast.error(actionData.error);
        }
      }
    }
  }, [actionData, t]);

  const handleSimNumberChange = (value: string) => {
    setSearchQuery({...searchQuery, sim_number: value});
    
    if (value.length > 0) {
      validateSimNumber(value);
    } else {
      setSimNumberValidationError('');
    }
  };

  const handleReset = () => {
    setSearchQuery({ id_card_type_id: '', id_card_number: '', sim_number: '' });
    setValidationError('');
    setSimNumberValidationError('');
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
      
      {/* Loader pendant la recherche */}
      {isSearching && <SearchLoader />}
      
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">

        <div className="max-w-4xl mx-auto">
          {/* Header simplifié */}
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.customerSearch.title}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t.customerSearch.subtitle}
            </p>
          </div>
          
          {/* Carte principale */}
          <Card className="border shadow-lg bg-card overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              {/* En-tête de la carte simplifié */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t.customerSearch.searchCriteria}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.customerSearch.useSimOrIdCard}
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
                        ? t.customerSearch.accessDenied.title
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
              <div className="relative">
                {isSearching && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-muted-foreground">{t.customerSearch.searching}</span>
                    </div>
                  </div>
                )}
                <SearchForm
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  idCardTypes={idCardTypes}
                  validationError={validationError}
                  simNumberValidationError={simNumberValidationError}
                  onIdCardNumberChange={handleIdCardNumberChange}
                  onIdCardTypeChange={handleIdCardTypeChange}
                  onSimNumberChange={handleSimNumberChange}
                  isLocked={isLocked}
                  selectedCardType={selectedCardType}
                  isSearching={isSearching}
                />
              </div>

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
